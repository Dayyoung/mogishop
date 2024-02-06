
loadscript('../home.js');
loadscript('../menu.js');
loadscript('../item.js');
loadscript('../cart.js');
loadscript('../pos.js');
loadscript('../confirmation.js');

loadscript('https://code.jquery.com/jquery-3.7.1.min.js',onCreate);
loadscript('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js');

function onCreate() {

$(function(){

console.log('onCreate.')

  loadsCSS('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css')

  $('[class*="homebutton"]').click(function(){
    location.href = "../home"
  });
  $('[class*="menubutton"]').click(function(){
    location.href = "../menu"
  });
  $('[class*="itembutton"]').click(function(){
    location.href = "../item"
  });
  $('[class*="cartbutton"]').click(function(){
    location.href = "../cart"
  });

  $('[class*="posbutton"]').click(function(){
    location.href = "../pos"
  });

  $('[class*="_skillofeveryone"]').click(function(){
    localStorage.removeItem('userID');
    localStorage.removeItem('cartID');
    window.location.reload(true);
  });

  checkUserID();

  if (window.location.href.indexOf("home") > -1) {
    goHome();
  }
  if (window.location.href.indexOf("menu") > -1) {
    goMenu();
  }
  if (window.location.href.indexOf("item") > -1) {
    goItem();
  }
  if (window.location.href.indexOf("cart") > -1) {
    goCart();
  }
  if (window.location.href.indexOf("pos") > -1) {
    goPos();
  }
  if (window.location.href.indexOf("confirmation") > -1) {
    goConfirmation();
  }
})

}

function loadscript(url,callback) {
    var script = document.createElement('script');
    script.src = url;
    script.type = "text/javascript";
    script.async = false;
    script.onload = callback;
    document.head.appendChild(script);
}

function loadsCSS(url) {
  $('<link>')
  .appendTo('head')
  .attr({
      type: 'text/css', 
      rel: 'stylesheet',
      href: url
  });
}


function getUserData(){
  var userID = localStorage.getItem('userID');
  var cartID = localStorage.getItem('cartID');

  var cartList = GsheetToJSON('https://docs.google.com/spreadsheets/d/1u-YNqG2eOLmP-yerGt4G4sYfKBGAvvzCA88t5pCO1nY/edit?resourcekey#gid=1382901981')
  var cartItem;

  for(i in cartList){
    var nowCartItem = cartList[i];
    if(nowCartItem && nowCartItem.userID == userID && nowCartItem.cartID == cartID){
      cartItem = nowCartItem;
    }
  }
  return cartItem;
}

function checkUserID(){
  var userID = localStorage.getItem('userID');
  var cartID = localStorage.getItem('cartID');

  if(!userID || !cartID){
      userID = generateRandomCode(3);
      localStorage.setItem('userID', userID);
      createUser();
  }else{
    toastr.options.positionClass = 'toast-bottom-right';
    toastr.options.extendedTimeOut = 1000; //1000;
    toastr.options.timeOut = -1;
    toastr.options.fadeOut = 250;
    toastr.options.fadeIn = 250;    
    toastr.success("Welcome to number "+userID) 
  } 
}

function generateRandomCode(n) {
  let str = ''
  for (let i = 0; i < n; i++) {
    str += Math.floor(Math.random() * 10)
  }
  return str
}

function GsheetToJSON(requestUrl) {

  var tableList; 
  var tableColumnList = ['timeStamp','Status','cartID','userID','Carrot','Tomato','Onion','Potato'];

  $.ajax({
          type: "get",            
          url: requestUrl,         
          async: false,
          cache: false,              
          data: "",                
          success: function(res){   

          var table = $(res).find('td')
          
          tableList = [];

          var tableItem;
          var tableData;
          var startIndex;

          table.each(function(i,item){
          


            if($(item).has("div").length > 0){
              tableData = $(item).find('div').html()
            }else{
              tableData = $(item).html();
            }

            if(tableData.indexOf('2024') != -1){
              tableList.push(tableItem);
              tableItem = {};
              startIndex = 0;
            }

            if(tableItem){
              tableItem[tableColumnList[startIndex]] = tableData;
              startIndex = startIndex + 1;
            }

          });

          if(tableItem){
            tableList.push(tableItem);
          }

      }
    });
  return tableList;
}

function createUser(){

  var userID = localStorage.getItem('userID');

  var requestData = {};
  requestData["entry.1627849796"] = userID; 

  var cartID = localStorage.getItem('cartID');
  if(cartID){
    requestData["edit2"] = cartID; 
    requestData["entry.560925289"] = cartID;
  }

  var requestUrl =
    "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfhZa0aZP9YnJV5Po2r1VRCLMUpnkoy2RqCLbmh4hl2V8Snvw/formResponse";
   
  var isSucess = false; 

  $.ajax({
          type: "post",            
          url: "https://corsproxy.io/?" + requestUrl,         
          async: false,
          cache: false,              
          data: requestData,                
          success: function(res){  

            isSucess = true; 

            var responseUrl = $(res).find("a").first().attr("href");
            cartID = responseUrl.split("edit2=")[1];
            updateCartID(cartID)
          }
    });
  return isSucess;
}

function updateCartID(cartID){

  var requestUrl =
    "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfhZa0aZP9YnJV5Po2r1VRCLMUpnkoy2RqCLbmh4hl2V8Snvw/formResponse";

  var requestData = {};
  requestData["edit2"] = cartID; //Carrot
  requestData["entry.560925289"] = cartID; //Carrot

  $.ajax({
          type: "post",            
          url: "https://corsproxy.io/?" + requestUrl,         
          async: false,
          cache: false,              
          data: requestData,                
          success: function(res){ 
            isSucess = true; 
            localStorage.setItem('cartID',cartID);
            checkUserID() //Maybe?
          }
    });
  return isSucess;

}

function updateItem(type,mode){

  var userID = localStorage.getItem('userID');

  var requestData = {};
  requestData["entry.1627849796"] = userID; //userID

  var cartID = localStorage.getItem('cartID');
  if(cartID){
    requestData["edit2"] = cartID; 
    requestData["entry.560925289"] = cartID;
  }

  var requestUrl =
    "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfhZa0aZP9YnJV5Po2r1VRCLMUpnkoy2RqCLbmh4hl2V8Snvw/formResponse";
   
    if(mode == 'delete') {
    if(type==0)requestData["entry.1032449173"] = (USERDATA.Carrot > 0 ? --USERDATA.Carrot : 0); //Carrot
    if(type==1)requestData["entry.1175135802"] =(USERDATA.Tomato > 0 ? --USERDATA.Tomato : 0);  //Tomato
    if(type==2)requestData["entry.388180984"] = (USERDATA.Onion > 0 ? --USERDATA.Onion : 0);  //Onion
    if(type==3)requestData["entry.1719807681"] =(USERDATA.Potato > 0 ?--USERDATA.Potato : 0);  //Potato
  }else{
    if(type==0)requestData["entry.1032449173"] = ++USERDATA.Carrot; //Carrot
    if(type==1)requestData["entry.1175135802"] = ++USERDATA.Tomato; //Tomato
    if(type==2)requestData["entry.388180984"] = ++USERDATA.Onion; //Onion
    if(type==3)requestData["entry.1719807681"] = ++USERDATA.Potato; //Potato
  }

  var isSucess = false; 

  $.ajax({
          type: "post",            
          url: "https://corsproxy.io/?" + requestUrl,         
          async: false,
          cache: false,              
          data: requestData,                
          success: function(res){  
            isSucess = true; 
          }
    });
  return isSucess;
}


function updateStatus(){

  var userID = localStorage.getItem('userID');

  var requestData = {};
  requestData["entry.1627849796"] = userID; //userID

  var cartID = localStorage.getItem('cartID');
  if(cartID){
    requestData["edit2"] = cartID; 
    requestData["entry.560925289"] = cartID;
  }

   requestData["entry.1073279920"] = 'Completed';

  var requestUrl =
    "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfhZa0aZP9YnJV5Po2r1VRCLMUpnkoy2RqCLbmh4hl2V8Snvw/formResponse";
   
  var isSucess = false; 

  $.ajax({
          type: "post",            
          url: "https://corsproxy.io/?" + requestUrl,         
          async: false,
          cache: false,              
          data: requestData,                
          success: function(res){  
            isSucess = true; 
          }
    });
  return isSucess;
}


