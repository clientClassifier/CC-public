var dbFunctions = require('../DBfunctions');
var expect = require('expect.js');
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/ClientClass-RC1Test1');
mongoose.connection.on('error', function() {
    mongoose.connection.close();
});

describe('joelDBtests file:', function(){

	before(function(done){
		mongoose.connect('mongodb://localhost/ClientClass-RC1Test1');
		done()
	})
	after(function(done){
		mongoose.connection.close(function(err){
			console.log('joelDBtests cnn closed')
			done();
		}); 
	});// end function after


 	describe('DB: searchEmails',function(){
 		it('Should return list of Emails',function(done){
 			var data={email:'gilmer@email.com',agentId:'50471352a592d83c06000002'};
 			dbFunctions.getAgents(data,function(err,result){
 				if(!err){
 					console.log('::::::::::::::::::::::::::::::::::::::::::::')
 					console.log(typeof(result));
 					if(typeof(result) == 'boolean'){
 						console.log('guardado')
 					}else{
 						console.log('enviar x correo')
 					}
 				}else{
 					console.log('--------::::::::::::::.:::::::::::::---------')
 				}
 				done()
 			})
 		})
 	})//end of Describe searchBoss

 	describe.skip('DB: searchBoss',function(){
 		it('Should return list of Boss',function(done){
 			var bossName='';
 			dbFunctions.getBoss(bossName,function(err,results){
 				if(!err){
 					console.log(results);
 				}else{
 					console.log(err);
 				}
 				done()
 			})
 		})
 	})//end of Describe searchBoss

	describe.skip('DB: updateSetting : realEstateAgent ',function(){
		describe('params VALID',function(){
			it('Should update document : email',function(done){
				var userdata={userType:'realEstateAgent',userId:'5047136ba592d83c06000003',eventType:'email',checkbox:'escrow',state:false};       
				dbFunctions.updateSetting(userdata,function(result){
					expect(result).to.be(null);
					done();
				}) //end of function updateSetting
			});//end of Should update document : email
			it('Should update document : text',function(done){
				var userdata={userType:'realEstateAgent',userId:'5047136ba592d83c06000003',eventType:'email',checkbox:'escrow',state:true};       
				dbFunctions.updateSetting(userdata,function(result){
					expect(result).to.be(null);
					done();
				}) //end of function updateSetting
			});//end of Should update document : text
		})//end of params VALID	
		describe('params INVALID',function(){
			it('Bad agentId Should  not update document : email ',function(done){
				var userdata={userType:'realEstateAgent',userId:'5047136ba592d83c06000077',eventType:'email',checkbox:'escrow',state:false};       
				dbFunctions.updateSetting(userdata,function(result){
					expect(result).to.be('DB: updateSetting : ERROR: '+userdata.userType+' made no changes');
					done();
				}) //end of function updateSetting
			});// end of Bad agentId Should  not update document : email 
			it('Bad agentId Should  not update document : text ',function(done){
				var userdata={userType:'realEstateAgent',userId:'5047136ba592d83c06000077',eventType:'email',checkbox:'escrow',state:true};       
				dbFunctions.updateSetting(userdata,function(result){
					expect(result).to.be('DB: updateSetting : ERROR: '+userdata.userType+' made no changes');
					done();
				}) //end of function updateSetting
			});//end of Bad agentId Should  not update document : text
		})//end of params INVALID	
	})// end of updateSetting realEstateAgent

	describe.skip('DB: updateSetting : loanOfficer',function(){
		describe('params VALID',function(){
			it('Should update document : email ',function(done){
				var userdata={userType:'loanOfficer',userId:'50471393a592d83c06000004',eventType:'email',checkbox:'escrow',state:false};       
				dbFunctions.updateSetting(userdata,function(result){
					expect(result).to.be(null);
					done();
				}) //end of function updateSetting
			});// end Should update document : email
			it('Should update document : text ',function(done){
				var userdata={userType:'loanOfficer',userId:'50471393a592d83c06000004',eventType:'text',checkbox:'escrow',state:true};       
				dbFunctions.updateSetting(userdata,function(result){
					expect(result).to.be(null);
					done();
				}) //end of function updateSetting
			});// end of Should update document : text
		})//end of params VALID	
		describe('params INVALID',function(){
			it('Bad loanofficer id should not update document : email',function(done){
				var userdata={userType:'loanOfficer',userId:'50471393a592d83c06000777',eventType:'email',checkbox:'escrow',state:false};       
				dbFunctions.updateSetting(userdata,function(result){
					expect(result).to.be('DB: updateSetting : ERROR: '+userdata.userType+' made no changes');
					done();
				}) //end of function updateSetting
			});// end of Bad loanofficer id should not update document : email
			it('Bad loanofficer id should not update document :text',function(done){
				var userdata={userType:'loanOfficer',userId:'50471393a592d83c06000777',eventType:'text',checkbox:'escrow',state:true};       
				dbFunctions.updateSetting(userdata,function(result){
					expect(result).to.be('DB: updateSetting : ERROR: '+userdata.userType+' made no changes');
					done();
				}) //end of function updateSetting
			});//end of Bad loanofficer id should not update document :text
		})//end of params INVALID	
	});//end of updateSetting loanOfficer

	describe.skip('DB: Tasks',function(){

		describe('function getTasks',function(){
			it('should return err == null and  should return result',function(done){
					dbFunctions.getTasks({clientName:'jo',agentId:'504aff792f21b4a808000002'} ,function(err,results){
						// console.log('results ='+results.length) 
						// console.log(results) 
						expect(err).to.be(null);
						// expect(results).to.be.ok()
						// expect(results).to.be.an('object');		
						done()
					})//end of dbfunctions
			})

			it('should return err length 0',function(done){
				dbFunctions.getTasks({clientName:'hjhjhj',agentId:'504aff792f21b4a808000002'} ,function(err,results){
					// console.log('results ='+results.length) 
					// console.log(results) 
					expect(err).to.be('DB: getTasks: ERROR: results[0].clients possibly length 0');
					// expect(results.length).to.be(0);
		
					done()
				})//end of dbfunctions
			})

			it('should return err == null and  should return result in function ALL tasks',function(done){
				dbFunctions.getAllTasks({agentId:'504aff792f21b4a808000002'} ,function(err,results){
					// console.log('results ='+results.length) 
					// console.log(results) 
					expect(err).to.be(null);
					// expect(results).to.be.ok()
					// expect(results).to.be.an('object');		
					done()
				})//end of dbfunctions
			})
		})//end of describe function getTask

		describe('updateTasks: DB functions',function(){
			it('Update Task with data completed and value empty ',function(done){
				var data={value:'',clientId:'504bfa53bb86b59403000002',checkbox:'true',agentId:'504aff792f21b4a808000002',taskId:'510dbacabff32b2012000003'}
				dbFunctions.updateTask(data, function(err){		
					expect(err).to.be(null)		
					done()
				})//end of dbfunctions
			})

			it('Update Task with data completed and not Agent in DB ',function(done){
				var data={value:'',clientId:'504bfa53bb86b59403000002',checkbox:'true',agentId:'525aff792f21b4a808000002',taskId:'510dbacabff32b2012000003'}
				dbFunctions.updateTask(data, function(err){		
					expect(err).to.be('DB: updateTask: ERROR: results is null')		
					done()
				})//end of dbfunctions
			})

			it('Update Task with data completed and without Client  for this Agent ',function(done){
				var data={value:'',clientId:'504bfa53bb86b59403000002',checkbox:'true',agentId:'525aff792f21b4a808000002',taskId:'510dbacabff32b2012000003'}
				dbFunctions.updateTask(data, function(err){		
					expect(err).to.be('DB: updateTask: ERROR: results is null')		
					done()
				})//end of dbfunctions
			})

			it('Update task with data empty',function(done){
				var data={}
				dbFunctions.updateTask(data,function(err){
					expect(err).to.be('DB: updateTask: ERROR: results is null')
					done()
				})
			})	// end of it	
		})//end of describe updateTasks: DB functions
	});//end of describe Tasks


});