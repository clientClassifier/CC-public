var moment=require('moment');

/************************************** EXPORTS ******************************************/
exports.filtrar=function(data,type){
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

exports.toCapitalLetter=function(texto){
texto=texto.toLowerCase();  
texto=texto.substring(0,1).toUpperCase()+texto.substring(1,texto.length)
return texto
}

  exports.formatDate= function(oArray,oKey,maskFormat){
    var i=0
      // console.log("sss"+oArray[0].oKey) 
    for(i=0;i<oArray.length;i++){         
      // console.log(oArray[i].oKey)
      // console.log(oKey)
      // console.log(oArray[i].dateAdded)
      oArray[i][oKey] =moment(oArray[i][oKey]).format(maskFormat);
               
      // console.log(oArray[i].oKey)
    }

    if(i==oArray.length){
      return oArray;
    }
    
  }

  exports.filtrarData=function(results,callback){
          var task
          var data = {
              tasksCompleted:0,
              tasks:[]
              }
          data.tasks=[]
          // console.log('ESTOY EN FILTRAR')
          // console.log(results)
          var i=0
          var tasksCompleted=0
          for( i=0;i<results.length;i++){
            // console.log('documento:')
            // console.log(results[i])
            // console.log('tareas')
            // console.log(results[i].tasks)
            for(var j=0;j<results[i].tasks.length;j++){

             task=results[i].tasks[j];
             // console.log('task:SIN MODIFICAR:'+JSON.stringify(task,null,'\t'))
             var dias=moment(task.dueDate).valueOf()-moment().valueOf();
                 dias=dias/(1000*60*60*24);
              if(task.completed){
                 task['state'] = "alert-success";
                 tasksCompleted++;   
              }else if(dias>1){
                task['state'] ="alert-info";
              }else if(dias>0){
                task['state'] ="";
              }else{
                task['state'] ="alert-error";
              }
              // console.log('estado')
              // console.log(task.state)
              // console.log(task.dueDate)
              task['dueDate2'] =moment(task.dueDate).format('MM-DD-YYYY');
              // console.log(task['dueDate2'])
              task['dateCompleted'] =(task.dateCompleted!='' && task.dateCompleted!=null)?moment(task.dateCompleted).format('MM-DD-YYYY'):'';
              // console.log('estado')
              // console.log(task.dateCompleted)
              // console.log('task:STATE:'+task.state)

              // console.log('task:MODIFICADO:'+JSON.stringify(task,null,'\t'))
              data.tasks.push(task)
              // data.tasks[0].something = 'does it exist'
              // console.log('dueDateSECOND-----------')
              // console.log('for loop data =='+ JSON.stringify(data.tasks[0], null, '\t'))
              // console.log('for loop dueDateSECOND =='+ JSON.stringify(data.tasks[0].something, null, '\t'))
              // console.log('for loop lenght ' + data.tasks.length)
            };//end of for loop j
          };//end of f or loop i
          if(results.length===i){
            // console.log("filtrarData: contador:")
            // console.log(i)
            // console.log("results: length:")
            // console.log(results.length)
            data.tasksCompleted=tasksCompleted;
            callback(data)
          }
        }

