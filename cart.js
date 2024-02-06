var USERDATA;

function goCart() {
	USERDATA = getUserData();
	viewCart();
}

function viewCart(){

	  if(!USERDATA)USERDATA = {};
	  if(!USERDATA.Carrot)USERDATA.Carrot=0;
	  if(!USERDATA.Tomato)USERDATA.Tomato=0;
	  if(!USERDATA.Onion)USERDATA.Onion=0;
	  if(!USERDATA.Potato)USERDATA.Potato=0;

	  $('.carrot_x_0_15_211').html("Carrot X " + USERDATA.Carrot)
	  $('.tomato_x_0_15_221').html("Tomato X " + USERDATA.Tomato)
	  $('.onion_x_0_15_231').html("Onion X " + USERDATA.Onion)
	  $('.potato_x_0_15_241').html("Potato X " + USERDATA.Potato)

	  $('[class^="link___add_15"]').each(function(i,item){

	  	$(item).off('click').click(function(){
			var isSuccess = updateItem(i);

			if(isSuccess){
				goCart();
			}
	  	});
	  })

	  $('[class*="link___delete_15"]').each(function(i,item){
	  	$(item).off('click').click(function(){
			var isSuccess = updateItem(i,'delete');

			if(isSuccess){
				goCart();
			}

	  	});
	  })


	  $('.link___buy_now__15_252').off('click').click(function(){
    		location.href = "../confirmation"
	  });
}
