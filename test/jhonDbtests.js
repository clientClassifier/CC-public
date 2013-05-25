var dbFunctions = require('../DBfunctions')
var expect = require('expect.js')
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/ClientClass-RC1Test1');
// mongoose.connect('mongodb://localhost/debutTests')


mongoose.connection.on('error', function() {
    mongoose.connection.close();
});
describe('jhonDBtests file:', function(){



	before(function(done){
		mongoose.connect('mongodb://localhost/ClientClass-RC1Test1');
		done()
	})

	after(function(done){
	    mongoose.connection.close(function(err){
	    	// console.log('jhonDB cnn closed')
	    	done();
	    });
	    
	});// end after



	

/*
 * updateClientCalculatorGetCM
 */




/*
 * updateClientCalculatorIncNeed
 */
	


	

	// *NOTE* Currenlty disabled, needs tone enabled
	// cloneClientToLoanOfficer

	describe.skip('DB: cloneClientToLoanOfficer', function(){
		it('clientId && loanOfficerId valid, should return err == null',function(done){
			dbFunctions.cloneClientToLoanOfficer({
				clientId:'504bfa53bb86b59403000002', //jhonathan
				loanOfficerId:'50471393a592d83c06000004'
			},function(err){
				expect(err).to.be(null);			
				done()
			})//end of dbfunctions
		})// end of it clientId && loanOfficerId valid, should return err == null

		it('clientId INVALID && loanOfficerId valid,should return err',function(done){
			dbFunctions.cloneClientToLoanOfficer({
				clientId:'xxxx',
				loanOfficerId:'50471393a592d83c06000004'
			},function(err){
				expect(err).to.not.be(null);			
				done()
			})//end of dbfunctions
		})//end of clientId INVALID && loanOfficerId valid,should return err

		it('clientId valid && loanOfficerId INVALID,should return err',function(done){
			dbFunctions.cloneClientToLoanOfficer({
				clientId:'504e74f6c4ab2d2506000002',
				loanOfficerId:'504713xxxx93a592d83c06000004'
			},function(err){
				expect(err).to.not.be(null);			
				done()
			})//end of dbfunctions
		})//end of clientId valid && loanOfficerId INVALID,should return err
	})// end of DB: cloneClientToLoanOffice 

/*
 * DB: updateDocuments
 */	

	

	// updateCommunication
	describe('DB: updateCommunication',function(){
		describe('userType == loanOfficer',function(){
			describe('client.dispute._id == null',function(){
				it('valid userId && valid clientId: should  return null',function(done){
					dbFunctions.updateCommunication({
						message:'Hola',
						userType: 'loanOfficer',			
						userId:'50471393a592d83c06000004',
						clientId:'504e728db00d27ad04000002'		
					},function(err){
						expect(err).to.be(null);	
						done()
					})//end of dbfunctions
				})// end of it valid userId && valid clientId: should  return null

				it.skip('valid userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'loanOfficer',			
						userId:'50471393a592d83c06000004',
						clientId:'504e7pppppp'			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it valid userId && INVALID clientId: should  return err

				it.skip('INVALID userId && valid clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'loanOfficer',			
						userId:'504713xxxxxc06000004',
						clientId:'504e728db00d27ad04000002'		
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && valid clientId: should  return err

				it('INVALID userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'loanOfficer',			
						userId:'504713xx06000004',
						clientId:'5xxx27ad04000002'			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && INVALID clientId: should  return err
			})//end of client.dispute._id == null
			
			describe('client.dispute._id != null',function(){
				it.skip('valid userId && valid clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'loanOfficer',			
						userId:'50cfc954fe84a60000000003',
						clientId:'504e74f6c4ab2d2506000002'			
					},function(err){
						expect(err).to.not.be.empty();		
						done()
					})//end of dbfunctions
				})// end of it valid userId && valid clientId: should  return err
				it('valid userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'loanOfficer',			
						userId:'50cfc954fe84a60000000003',
						clientId:'504e74f6cddd2506000002'			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it valid userId && INVALID clientId: should  return err

				it('INVALID userId && valid clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'loanOfficer',			
						userId:'50cfc954fee0000000003',
						clientId:'504e74f6c4ab2d2506000002'		
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && valid clientId: should  return err

				it('INVALID userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'loanOfficer',			
						userId:'50cfc9543300000003',
						clientId:'504e733d2506000002'			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && INVALID clientId: should  return err				
			})//end of client.dispute._id != null
		})//end of userType == loanOfficer

		describe('userType == realEstateAgent',function(){
			describe('client.dispute._id == null',function(){
				it('valid userId && valid clientId: should  return null',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'realEstateAgent',			
						userId:'504aff792f21b4a808000002',
						clientId:'504bfa53bb86b59403000002'			
					},function(err){
						expect(err).to.be(null);	
						done()
					})//end of dbfunctions
				})// end of it valid userId && valid clientId: should  return null

				it('valid userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'realEstateAgent',			
						userId:'504aff792f21b4a808000002',
						clientId:'504e728ttt7ad04000002'			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it valid userId && INVALID clientId: should  return err

				it('INVALID userId && valid clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'realEstateAgent',			
						userId:'504aff7ee21b4a808000002',
						clientId:'504e728db00d27ad04000002'			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && valid clientId: should  return err

				it('INVALID userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'realEstateAgent',			
						userId:'504aqqa808000002',
						clientId:'504e7qqad04000002'			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && INVALID clientId: should  return err
			})//end of client.dispute._id == null
			describe('client.dispute._id != null',function(){
				it('valid userId && valid clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'realEstateAgent',			
						userId:'50cfc9543300000003',
						clientId:'504e733d2506000002' 			
					},function(err){
						expect(err).to.not.be.empty();		
						done()
					})//end of dbfunctions
				})// end of it valid userId && valid clientId: should  return err
				it('valid userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'realEstateAgent',			
						userId:'50cfc9543300000003',
						clientId:'504e733d2506000002'			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it valid userId && INVALID clientId: should  return err

				it('INVALID userId && valid clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'realEstateAgent',			
						userId:'50cfc9543300000003',
						clientId:'504e733d2506000002' 			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && valid clientId: should  return err

				it('INVALID userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateCommunication({			
						message:'Hola',
						userType: 'realEstateAgent',			
						userId:'50cfc9543300000003',
						clientId:'504e733d2506000002'			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && INVALID clientId: should  return err				
			})//end of client.dispute._id != null
		})//end of userType == realEstateAgent
		describe('userType != loanOfficer or realEstateAgent',function(){
			it('should return err',function(done){
				dbFunctions.updateCommunication({			
					message:'Hola',
					userType: 'pepuchera',			
					userId:'50cfc9543300000003',
					clientId:'504e733d2506000002'		
				},function(err){
					expect(err).to.not.be.empty();		
					done()
				})//end of dbfunctions
			})//end of it should return err
		})//end of userType != loanOfficer or realEstateAgent	
	});// end of DB: updateCommunication

	// removeCommunicationNotification
	

// updateInstructionsMessage
	describe('DB: updateInstructionsMessage',function(){
		describe('userType == loanOfficer',function(){
			it('valid userId && valid clientId: should  return null',function(done){
				dbFunctions.updateInstructionsMessage({
					step: 1, 
					instruction: 'buenas noches compañeros' ,
					userId:'50471393a592d83c06000004',						
					clientId:'504713b9a592d83c06000005'		
				},function(err){
					expect(err).to.be(null);		
					done()
				})//end of dbfunctions
			})//end of it valid userId && valid clientId: should  return null 
			it('valid userId && INVALID clientId: should  return err',function(done){
				dbFunctions.updateInstructionsMessage({
					step: 1, 
					instruction: 'buenas compañeros' ,
					userId:'50471393a592d83c06000004',						
					clientId:'50zzz2d83c06000005'		
				},function(err){
					expect(err).to.not.empty();		
					done()
				})//end of dbfunctions
			})//end of it valid userId && INVALID clientId: should  return err
			it('INVALID userId && valid clientIdl: should  return err',function(done){
				dbFunctions.updateInstructionsMessage({
					step: 1, 
					instruction: 'buenas noches compañeros' ,
					userId:'50471fff83c06000004',						
					clientId:'504713b9a592d83c06000005'		
				},function(err){
					expect(err).to.not.empty();			
					done()
				})//end of dbfunctions
			})// end of it INVALID userId && valid clientIdl: should  return err
			it('INVALID userId && INVALID clientId: should  return err',function(done){
				dbFunctions.updateInstructionsMessage({
					step: 1, 
					instruction: 'buenas noches compañeros' ,
					userId:'50471393jj6000004',						
					clientId:'5047jj83c06000005'		
				},function(err){
					expect(err).to.not.be.empty();		
					done()
				})//end of dbfunctions
			})//end of it INVALID userId && INVALID clientId: should  return err
		})//end of userType == loanOfficer			
	});//end of DB: updateInstructionsMessage

// updateInstructionComplete
	
	describe('DB: updateInstructionComplete',function(){
		describe('userType == loanOfficer',function(){
			it.skip('valid userId && valid clientId: should  return null',function(done){
				dbFunctions.updateInstructionComplete({				
					userId:'50471393a592d83c06000004',
					clientId:'504713b9a592d83c06000005',			
					checkbox: true,
					state: true 			
				},function(err){
					expect(err).to.be(null);		
					done()
				})//end of dbfunctions	
			})//end of it valid userId && valid clientId: should  return null
			it('valid userId && INVALID clientId: should  return err',function(done){
				dbFunctions.updateInstructionComplete({				
					userId:'50471393a592d83c06000004',
					clientId:'504xx06000005',			
					checkbox: true,
					state: true 			
				},function(err){
					expect(err).to.not.be.empty();			
					done()
				})//end of dbfunctions	
			})//end of it valid userId && INVALID clientId: should  return err
			it('INVALID userId && valid clientIdl: should  return err',function(done){
				dbFunctions.updateInstructionComplete({				
					userId:'50471xx2d83c06000004',
					clientId:'504713b9a592d83c06000005',			
					checkbox: true,
					state: true 			
				},function(err){
					expect(err).to.not.be.empty();			
					done()
				})//end of dbfunctions	
			})//end of it INVALID userId && valid clientIdl: should  return err
			it('INVALID userId && INVALID clientId: should  return err',function(done){
				dbFunctions.updateInstructionComplete({				
					userId:'llllllllll',
					clientId:'iiiiii',			
					checkbox: true,
					state: true 			
				},function(err){
					expect(err).to.not.be.empty();		
					done()
				})//end of dbfunctions	
			})//end of it INVALID userId && INVALID clientId: should  return err
		})//end of userType == loanOfficer		
	});// end of DB: updateInstructionComplete

	// requestconsultation 
	

// delClientFromAgent
	describe('DB: delClientFromAgent',function(){
			it('if userData is formatted correctly, the function should not have an error',function(done){
				dbFunctions.delClientFromAgent({
					coment:'bye bye :)',
					clientId: '504bfa53bb86b59403000002',
					agentId: '504aff792f21b4a808000002',			
				},function(err){
					expect(err).to.not.be.empty();	
					done()
				})//end of dbfunctions
			})//end of it if userData is formatted correctly, the function should not have an error	

			it('if agentId is bad, should return with error',function(done){
				dbFunctions.delClientFromAgent({
					coment:'bye bye :)',
					clientId: '504bfa53bb86b59403000002',
					agentId: 'abc',			
				},function(err){
					expect(err).to.not.be.empty();	
					done()
				})//end of dbfunctions
			})//end of it if agentId is bad, should return with error
			
			it('if agentId is good and clientId is bad, should return error',function(done){
				dbFunctions.delClientFromAgent({
					coment:'bye bye :)',
					clientId: 'ddddddddd',
					agentId: '504aff792f21b4a808000002',			
				},function(err){
					expect(err).to.not.be.empty();	
					done()
				})//end of dbfunctions
			})//end of it agentId is good and clientId is bad, should return error
	});//end of DB: delClientFromAgent

	// delClientFromLO
	describe('DB: delClientFromLO',function(){
		it('if lenderId is bad, should return error',function(done){
			dbFunctions.delClientFromLO({
				coment:'bye bye :)',
				other:'lero lero',
				clientId: '504713c3a592d83c06000006',
				agentId: '504aff792f21b4a808000002',	
				lenderId:'5dddddd004',		
			},function(err,results){
				expect(err).to.not.be.empty();	
				done()
			})//end of dbFunctions
		})				
	})//end of DB: delClientFromLO

	
	
/*
* 
*/

	describe('DB: existsClientAgent',function(){ /* BUG trailing object ID is added to clients */ // oh i have to add the proper object, else it fails
		describe('If valid userdata',function(){
			it('should return err === null',function(done){
				dbFunctions.existsClientAgent({
											clientId:'504713e2a592d83c06000007',
											value:12,
											comment:'otro test de evaluacion'
											},function(err){
												expect(err).to.be(null);												
											done()
				})//end of dbfunctions
			})//end of it should return null 
			
		})//end of if valid userdata

	
	});//end of DB: existsClientAgent
	// describe('DB: updateClientHappyness',function(){ /* BUG trailing object ID is added to clients */ // oh i have to add the proper object, else it fails
	// 	describe('If valid userdata',function(){
	// 		it('should return err === null',function(done){
	// 			dbFunctions.updateClientHappyness({
	// 										clientId:'504bfa53bb86b59403000002',
	// 										value:50,
	// 										comment:'medio feliz'
	// 										},function(err){
	// 											expect(err).to.be(null);												
	// 										done()
	// 			})//end of dbfunctions
	// 		})//end of it should return null 			
	// 	})//end of if valid userdata
	// });//end of DB: existsClientAgent

});//end of jhonDBtests file:

	