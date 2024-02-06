
function goMenu() {

	  $('[class^="link___detail"]').each(function(i,item){
	  	$(item).off('click').click(function(){
    		location.href = "../item?item="+i
	  	});
	  })
}
