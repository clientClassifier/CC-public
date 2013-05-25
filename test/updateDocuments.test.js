var request = require('supertest');
var expect = require('expect.js');
var mongoose = require('mongoose');
var io = require('socket.io-client');


var loginUser = require('./loginUsers.js');
var dbFunctions = require('../DBfunctions');
var routes = require('../routes');


request = request('https://localhost:2000');
var socketURL = 'https://localhost:2000';
var options = {
  transports: ["xhr-polling"],
  'polling duration': 10,
  'log level': 1,
  'force new connection': true
};
mongoose.connection.on('error', function() {
  mongoose.connection.close();
});



describe.skip('updateDocuments.test.js file:', function() {
  before(function(done) {
    mongoose.connect('mongodb://localhost/ClientClass-RC1Test1');
    done()
  })

  after(function(done) {
    mongoose.connection.close(function(err) {
      done();
    });
  }); // end after


  /** ****************************************************************************
   * updateDocuments request
   * ****************************************************************************/




  /** ****************************************************************************
   * updateDocuments router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  updateDocuments DB functions
   * ****************************************************************************/
//revisar
   describe('DB: updateDocuments',function(){
		describe('userType == loanOfficer',function(){
			describe('client.dispute._id == null',function(){
				it('valid userId && valid clientId: should  return null',function(done){
					dbFunctions.updateDocuments({			
						userType: 'loanOfficer',
						clientId:'504e728db00d27ad04000002',
						userId:'50471393a592d83c06000004' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.be(null);	
						done()
					})//end of dbfunctions
				})// end of it valid userId && valid clientId: should  return null

				it('valid userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'loanOfficer',
						clientId:'tttttb00d27ad04000002',
						userId:'50471393a592d83c06000004' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it valid userId && INVALID clientId: should  return err

				it('INVALID userId && valid clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'loanOfficer',
						clientId:'504e728db00d27ad04000002',
						userId:'50471393ahhhhhh06000004' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && valid clientId: should  return err

				it('INVALID userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'loanOfficer',
						clientId:'504e7tttt00002',
						userId:'50471393ahhhhhh06000004' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && INVALID clientId: should  return err
			})//end of client.dispute._id == null
			
			describe('client.dispute._id != null',function(){
				it.skip('valid userId && valid clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'loanOfficer',
						clientId:'504e74f6c4ab2d2506000002',
						userId:'50cfc954fe84a60000000003' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();		
						done()
					})//end of dbfunctions
				})// end of it valid userId && valid clientId: should  return err
				it('valid userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'loanOfficer',
						clientId:'504e7eeeeee06000002',
						userId:'50cfc954fe84a60000000003' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it valid userId && INVALID clientId: should  return err

				it('INVALID userId && valid clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'loanOfficer',
						clientId:'504e74f6c4ab2d2506000002',
						userId:'jajajajaja' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && valid clientId: should  return err

				it('INVALID userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'loanOfficer',
						clientId:'50aaaaa6000002',
						userId:'50cfcjjjjj954fe84a60000000003' ,			
						checkbox: true,
						state: true 			
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
					dbFunctions.updateDocuments({			
						userType: 'realEstateAgent',
						clientId:'504e728db00d27ad04000002',
						userId:'504aff792f21b4a808000002' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.be(null);	
						done()
					})//end of dbfunctions
				})// end of it valid userId && valid clientId: should  return null

				it('valid userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'realEstateAgent',
						clientId:'504exxxxd27ad04000002',
						userId:'504aff792f21b4a808000002' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it valid userId && INVALID clientId: should  return err

				it('INVALID userId && valid clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'realEstateAgent',
						clientId:'504e728db00d27ad04000002',
						userId:'504affrrrrb4a808000002' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && valid clientId: should  return err

				it('INVALID userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'realEstateAgent',
						clientId:'504ejjjjj04000002',
						userId:'504afxxxx00002',			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && INVALID clientId: should  return err
			})//end of client.dispute._id == null
			describe('client.dispute._id != null',function(){
				it.skip('valid userId && valid clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'realEstateAgent',
						clientId:'504e74f6c4ab2d2506000002',
						userId:'504aff792f21b4a808000002' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();		
						done()
					})//end of dbfunctions
				})// end of it valid userId && valid clientId: should  return err
				it('valid userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'realEstateAgent',
						clientId:'504e74xxxd2506000002',
						userId:'504aff792f21b4a808000002' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it valid userId && INVALID clientId: should  return err

				it('INVALID userId && valid clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'realEstateAgent',
						clientId:'504e74f6c4ab2d2506000002',
						userId:'ooooooo' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && valid clientId: should  return err

				it('INVALID userId && INVALID clientId: should  return err',function(done){
					dbFunctions.updateDocuments({			
						userType: 'realEstateAgent',
						clientId:'ppp06000002',
						userId:'5aaaf792f21b00002' ,			
						checkbox: true,
						state: true 			
					},function(err){
						expect(err).to.not.be.empty();	
						done()
					})//end of dbfunctions
				})// end of it INVALID userId && INVALID clientId: should  return err				
			})//end of client.dispute._id != null
		})//end of userType == realEstateAgent
		describe('userType != loanOfficer or realEstateAgent',function(){
			it('should return err',function(done){
				dbFunctions.updateDocuments({			
					userType: 'sssssss',
					clientId:'504e74f6c4ab2d2506000002',
					userId:'50471393a592d83c06000004' ,			
					checkbox: true,
					state: true 			
				},function(err){
					expect(err).to.not.be.empty();		
					done()
				})//end of dbfunctions
			})//end of it should return err
		})//end of userType != loanOfficer or realEstateAgent		
	});// end of DB: updateDocuments







  /** ****************************************************************************
   *  updateDocuments socket functions
   * ****************************************************************************/












}); //end of updateDocuments