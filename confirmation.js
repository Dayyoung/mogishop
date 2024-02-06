var USERDATA;

function goConfirmation() {
	USERDATA = getUserData();

	console.log(USERDATA)
	
	var isSuccess = updateStatus();

	if(isSuccess){
		//goConfirmation();
		if(USERDATA.cartID){
			$('.heading_1___515_15_55427').html("Order ID :  " + USERDATA.cartID)
		}

	}



}