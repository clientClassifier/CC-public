var socket = io.connect();
$(document).ready(function () {



	$('ul#infoTab li a[href="#email"]').bind('click',function(){
		$('#eventType').val('email');
	});
	$('ul#infoTab li a[href="#text"]').bind('click',function(){
		$('#eventType').val('text');
	});
	$('ul#infoTab li a[href="#payment"]').bind('click',function(){
		$('#eventType').val('payment');
	});

	//$('.W2').unbind();
	$('.W2').bind('change',changeUserSettings);
	$('.taxes').bind('change',changeUserSettings);
	$('.payStub').bind('change',changeUserSettings);
	$('.bankStatements').bind('change',changeUserSettings);
	$('.prequal').bind('change',changeUserSettings);

	//$('.W2').bind('change',changeUserSettings);
	$('.taxes').bind('change',changeUserSettings);
	$('.payStub').bind('change',changeUserSettings);
	$('.bankStatements').bind('change',changeUserSettings);
	$('.prequal').bind('change',changeUserSettings);

	//

	$('.prequalAgent').bind('change',changeUserSettings);
	$('.showHouses').bind('change',changeUserSettings);
	$('.madeOffer').bind('change',changeUserSettings);
	$('.offerStatus').bind('change',changeUserSettings);
	$('.EMD').bind('change',changeUserSettings);
	$('.escrow').bind('change',changeUserSettings);


	$('.prelim').bind('change',changeUserSettings);
	$('.escrowInstruction').bind('change',changeUserSettings);
	$('.reDisclosures').bind('change',changeUserSettings);
	$('.homeInspections').bind('change',changeUserSettings);
	$('.NTP').bind('change',changeUserSettings);
	$('.FWT').bind('change',changeUserSettings);
	//

	$('.credit').bind('change', changeUserSettings);
	$('.driversLicense').bind('change',changeUserSettings);
	$('.socialSecurityCard').bind('change',changeUserSettings);
	$('.application').bind('change',changeUserSettings);
	$('.submissionForm').bind('change',changeUserSettings);
	$('.signed').bind('change',changeUserSettings);
	$('.preApproved').bind('change',changeUserSettings);

	$('.updatedDocs').bind('change',changeUserSettings);
	$('.subOfLoan').bind('change',changeUserSettings);
	$('.appraisal').bind('change',changeUserSettings);
	$('.approved').bind('change',changeUserSettings);
	$('.priorToDocs').bind('change',changeUserSettings);
	$('.conditions').bind('change',changeUserSettings);
	$('.conditions').bind('change',changeUserSettings);
	$('.funding').bind('change',changeUserSettings);


	$('#CreateBrokerLeaderForm').validate({
		rules:{
			groupName:{required:true},
			companyName:{required:true}
			// securityMessage:{required:true}
		},
		highlight:function(label){
			$(label).closest('.control-group').addClass('error');
		},
		success:function(label){
			label
	        	.text('OK!').addClass('valid')
	        	.closest('.control-group').addClass('success');
		},
		messages:{
			groupName:{required:"Please enter your group name"},
			companyName:{required:"Please enter your company name"},
			securityMessage:{required:"Please enter your first name"}
		}

	})//end of validate CreateBrokerLeaderForm ---

	$('form#CreateBrokerLeaderForm').submit(changePrivileges);
	
	$('#addUserForm').validate({
		rules:{
			addUser:{required:true,
						email:true}
		},
		highlight:function(label){
			$(label).closest('.control-group').addClass('error');
		},
		success:function(label){
			label
				.text('OK!').addClass('valid')
				.closest('.control-group').addClass('success')
		},
		messages:{
			addUser:{required:"Please enter the users email",
						email:"Please enter a valid Email"}
		}
	})//end of validate addUserForm

	$('form#addUserForm').submit(addUserToGroup);

	$('.onlyCharactersWithSpace').keyup(function() {
	    $(this).val($(this).val().replace(/[^A-Za-z ]/g,''));
    	});

})

function addUserToGroup(){
	console.log('function addUserToGroup has been called')
	// var emails=[];
	if(($('#addUser').val()).length>0){
		$('#msgAddUser').html('')
		console.log('will go to server next:::' + $('#userType').val())
		console.log('will go to server next:::' + $('#userCell').val())
		console.log('will go to server next:::' + $('#userEmail').val())
		console.log('will go to server next:::' + $('#userName').val())
		socket.emit('addUserToGroup',{
														email:$('#addUser').val().replace(/ /g,''),
														userId:urlData().userId, 
														userType: $('#userType').val(),
														userCell: $('#userCell').val(),
														userEmail: $('#userEmail').val(),
														userName: $('#userName').val()
												})
	}
}

socket.on("addUserToGroup",function(result){
	console.log(result)
	if(typeof(result) != 'string'){
		$('#msgAddUser').html('')
		$('#msgAddUser').append($('<div class="alert alert-success">').append($('<a class="close" data-dismiss="alert" href="#">').text("x"),$('<p>').text("Success: complete process.")))
		$('#addUserTable tbody').append($('<tr>').append($('<td>').text(result.name),$('<td>').text(result.cellPhone),$('<td>').text(result.email),$('<td>').text(result.dateAdded)))
	}else{
		$('#msgAddUser').html('')
		$('#msgAddUser').append($('<div class="alert alert-info">').append($('<a class="close" data-dismiss="alert" href="#">').text("x"),$('<p>').text("Client classifier has sent a message to " + result + " to register at Client Classifier")))
	}
})

socket.on("errorAddUserToGroup",function(err){
		console.log('errorAddUserToGroup was called from client')
		$('#msgAddUser').html('')
		$('#msgAddUser').append($('<div class="alert alert-error">').append($('<a class="close" data-dismiss="alert" href="#">').text("x"),$('<p>').text("Error: "+err)))
})

function filtrar(data,type){
	var exp=new RegExp("[a-zA-Z ]*");
	for(var i=0;i<data.length;i++){
		if(!data[i].match(exp) || data[i].length==0){
			// console.info("xd:"+data[i])
			return null;
		}
	}
	// console.info("final:"+data[i])
	return true;

}

function toCapitalLetter(texto){
texto=texto.toLowerCase();	
texto=texto.substring(0,1).toUpperCase()+texto.substring(1,texto.length)
return texto
}

function changePrivileges(){

$('#createGroupLeaderButton').attr("disabled", "disabled");
	console.log('button should be disabled.')
	var groupName=$.trim($('#groupName').val())
	var companyName=$.trim($('#companyName').val())
	var securityMessage=$.trim($('#securityMessage').val())

	if(filtrar([groupName,companyName])){
		if($('#groupName').val().length>0 && $('#companyName').val().length>0){
			$('#CreateBrokerLeader').modal('hide')
			socket.emit('changePrivileges',{
											userId:urlData().userId,
											userType: $('#userType').val(),
											groupName:toCapitalLetter(groupName),
											companyName:companyName,
											securityMessage:securityMessage})
		}
	}
}//end of changePrivileges




socket.on('changePrivileges',function(result){


	// if(typeof(result) == 'object'){
		$('#msgActions').html('')
		$('#msgActions').append($('<div class="alert alert-success">').append($('<a class="close" data-dismiss="alert" href="#">').text("x"),$('<p>').text("Success: complete process. Please refresh the page")))
		$('#addUserTable tbody').append($('<tr>').append($('<td>').text(result.name),$('<td>').text(result.cellPhone),$('<td>').text(result.email),$('<td>').text(result.dateAdded)))
	// }
})//end of socket: changePrivileges

socket.on('errorChangePrivileges',function(err){
	$('#createGroupLeaderButton').removeAttr("disabled")
	if(err.length>0){
		$('#msgActions').html('')
		$('#msgActions').append($('<div class="alert alert-error">').append($('<a class="close" data-dismiss="alert" href="#">').text("x"),$('<p>').text(err)))
	}
})//end of socket: changePrivileges

function changeUserSettings(e){
	e.stopImmediatePropagation();
	// var userdata={ userType: $('#userType').val(), userId: urlData().userId, eventType: $('#eventType').val(), checkbox: $(this).val(), state: $(this).is(':checked')};       
    socket.emit('changeUserSettings', { userType: $('#userType').val(), userId: urlData().userId, eventType: $('#eventType').val(), checkbox: $(this).val(), state: $(this).is(':checked')});
  

}

function urlData(){
    var locationObj = window.location.href;
    // console.log('locationObj = ' + locationObj);
    var spliturl = locationObj.split('/');
    // console.log('client = ' + spliturl[6]);
    // console.log('user = ' + spliturl[4]);
    var data = {userId:  spliturl[4], clientId:  spliturl[6]};
    return data;
  }

socket.on('removeSettingsCheck',function(data){
	
	if(data.state==true){
		$('#'+data.eventType+' .'+data.checkbox).removeAttr('checked');	
	}else{
		$('#'+data.eventType+' .'+data.checkbox).attr('checked','checked');
	}

	$('#errorSocket').append($('<div class="alert alert-error alert-block">').append($('<a class="close" data-dismiss="alert", href="#">').text('×'),$('<h4 class="alert-heading">').text('Error!'),$('<p>').text('Detail error...')))   


});
