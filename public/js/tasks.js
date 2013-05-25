socket=io.connect();
$(document).ready(function(){

	$('.onlyCharactersWithSpace').keyup(function() {
	    $(this).val($(this).val().replace(/[^A-Za-z ]/g,''));
    	});
	$('form#searchForm').submit(function(){
		console.log("test")
		socket.emit('searchClient',$('#txtSearch').val(),$('#agentId').val());
	});

    $('.isMoney').currency({
         decimals: 0
      });

    
	 // $('#txtSearch').keyup(function(e){
	 // 		// socket.emit('searchClient',this.value);	
		// if (e.which == 13) {
		// 	// console.log('-------------'+$('#txtSearch').val());		
		// 	// $('#btnSearch').attr('data-toggle','button')
		// 	// $('#btnSearch').button('toggle')
		// 	socket.emit('searchClient',$('#txtSearch').val(),$('#agentId').val());
		// }
	 // });

	$('#btnSearch').click(function(){
			// alert($('#txtSearch').val())
			socket.emit('searchClient',$('#txtSearch').val(),$('#agentId').val());				
	});
	activarFunctionCheckBox();
});



function activarFunctionCheckBox(){
		// console.log('llamando')
		$('.fixCheckbox').change(function(){
		socket.emit('updateTaskCompleted',{value:$('#txtSearch').val(),clientId:$(this).attr('id'),checkbox:this.checked,agentId:$('#agentId').val(),taskId:$(this).attr('id2')})
		// console.log({value:$('#txtSearch').val(),clientId:$(this).attr('id'),checkbox:this.checked,agentId:$('#agentId').val(),taskId:$(this).attr('id2')})
	})
}



socket.on('searchClient',function(value,tasksCompleted,tasks){
	
	// $('#btnSearch').button('toggle')
	// var msg='Your search for " '+value+' " did not match any tasks'
	var msg='Your search for " '+value+' " did not match'
	$('#Completed').html('');
	$('#Active').html('');	
	if(tasks!=null){
		msg='Found ('+(tasks.length-tasksCompleted)+' Incompleted, '+tasksCompleted+' Completed).';
		for(var i=0;i<tasks.length;i++){
			var close=(tasks[i].completed)? $("<a data-dismiss='alert',href='#' class='close'>").text('x'):'';
			var left=$('<div class="left pull-left span5">').append($('<strong>').text('For : '),$('<span>').append($('<a href="/agent/504aff792f21b4a808000002/calculator/'+tasks[i].clientId+'">').text(tasks[i].clientName)),$('<br>'),$('<strong>').text('Task : '),$('<span>').text(tasks[i].message))
				var dateCompletedA=(tasks[i].completed)? $("<br>"):'';
				var dateCompletedB=(tasks[i].completed)? $("<strong>").text('Date Completed : '):'';
				var dateCompletedC=(tasks[i].completed)? $("<span>").text(tasks[i].dateCompleted):'';          
			var right=$('<div class="right pull-right span2">').append($('<strong>').text('Due : '),$('<span>').text(tasks[i].dueDate2),$('<br>'),$('<strong>').text('Completed : '),$('<input class="fixCheckbox" id="'+(tasks[i].clientId)+'" id2="'+(tasks[i]._id)+'" type="checkbox" '+((tasks[i].completed)?'checked':'')+'>'),dateCompletedA,dateCompletedB,dateCompletedC);
			if(tasks[i].completed){
				$('#Completed').append($('<div class="span8 alert alert-block '+tasks[i].state+'">').append(close,left,right));
			}else{
				$('#Active').append($('<div class="span8 alert alert-block '+tasks[i].state+'">').append(close,left,right));				
			}
		}
	}
	$("#taskMessage").html($('<p>').text(msg))
	activarFunctionCheckBox();
})

socket.on('denyUpdateTaskCompleted',function(state,data){
	if(!state)
		$("#taskMessage").html($('<p>').text("An error occurred while get the task"))
	// console.log('updateTaskCompleted : '+estado)
})