// var mail = require('../sendGridMail');
// var expect = require('expect.js');


// describe('sendGridMail test file' , function(){

// 	describe.skip('Send mail After : ', function(){
// 		it('locals is null', function(done){
// 			mail.debugTESTMAIL({to: 'sogoiii@gmail.com', locals: null, debug: true}, function(err){
// 				expect(err).to.be('Mailer: locals is null, undefined, or empty')
// 				done();
// 			})
// 		})
// 		it('locals is undefined', function(done){
// 			mail.debugTESTMAIL({to: 'sogoiii@gmail.com',debug:true}, function(err){
// 				expect(err).to.be('Mailer: locals is null, undefined, or empty')
// 				done();
// 			})
// 		})
// 		it('locals is (empty)', function(done){
// 			mail.debugTESTMAIL({to: 'sogoiii@gmail.com', locals: '',debug:true}, function(err){
// 				expect(err).to.be('Mailer: locals is null, undefined, or empty')
// 				done();
// 			})
// 		})
// 	})
// 	describe.skip('Send Mail Debug (false) : ',function(){
// 		it('send Mail is (Success)',function(done){
// 			mail.debugTESTMAIL({to: 'luciano_111@hotmail.com', locals:{user:'admin'},debug:false},function (param){
// 				expect(param).to.be("Success");
// 				done();
// 			});
// 		});
// 		it('send Mail is (error)',function(done){
// 			mail.debugTESTMAIL({to: 'luciano_111@hotmail.com', locals:{user:'admin'},debug:false},function (error){
// 				expect(error).to.be(error);
// 				done();
// 			});
// 		});
// 	});	

// 	describe('sendConfirmRegisterEmailClient',function(){
// 		it.only('send Mail is true',function(done){
// 			mail.sendConfirmRegisterEmailClient({
// 					to:'jhonsy_72@hotmail.com',
// 					locals:{
// 						email: 'jhonsy_72@hotmail.com',
// 						password:'mmmmmmmmm', 
// 						agentFirstName:'Jhon',
// 						agentLastName:'Romero' 
// 					}
// 				},function(result){
// 					// expect(result).to.not.be.empty();
// 					done();
// 			})
// 		});//end of it send Mail is true
// 	})//end of sendConfirmRegisterEmailClient
	
// });//end of sendGridMail tests

