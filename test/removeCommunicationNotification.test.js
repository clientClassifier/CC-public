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



describe('removeCommunicationNotification.test.js file:', function() {
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
   * removeCommunicationNotification request
   * ****************************************************************************/




  /** ****************************************************************************
   * removeCommunicationNotification router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  removeCommunicationNotification DB functions
   * ****************************************************************************/
   //Se debe crear en el db en el tipo de user loanfficer un client para realizar esta prueba
	// describe('DB: removeCommunicationNotification',function(){
	// 	describe('userType == loanOfficer',function(){
	// 		it('valid userId && valid clientId: should return null',function(done){
	// 			dbFunctions.removeCommunicationNotification({
	// 				userType: 'loanOfficer',					
	// 				userId:'50471393a592d83c06000004',
	// 				clientId:'504e728db00d27ad04000002'			
	// 			},function(err){
	// 				expect(err).to.be(null);		
	// 				done()
	// 			})//end of dbfunctions
	// 		})//end of it valid userId && valid clientId: should return null
	// 		it('valid userId && INVALID clientId: should return err',function(done){
	// 			dbFunctions.removeCommunicationNotification({
	// 				userType: 'loanOfficer',					
	// 				userId:'50471393a592d83c06000004',
	// 				clientId:'504e72ñññ0002'			
	// 			},function(err){
	// 				expect(err).to.not.be.empty();		
	// 				done()
	// 			})//end of dbfunctions
	// 		})//end of it valid userId && INVALID clientId: should return err
	// 		it('INVALID userId && valid clientId: should return err',function(done){
	// 			dbFunctions.removeCommunicationNotification({
	// 				userType: 'loanOfficer',					
	// 				userId:'504uuu92d83c06000004',
	// 				clientId:'504e728db00d27ad04000002'			
	// 			},function(err){
	// 				expect(err).to.not.be.empty();		
	// 				done()
	// 			})//end of dbfunctions
	// 		})//end of it INVALID userId && valid clientId: should return err
	// 		it('INVALID userId && INVALID clientId: should return err',function(done){
	// 			dbFunctions.removeCommunicationNotification({
	// 				userType: 'loanOfficer',					
	// 				userId:'504uuu92d83c06000004',
	// 				clientId:'504e72wwwad04000002'			
	// 			},function(err){
	// 				expect(err).to.not.be.empty();		
	// 				done()
	// 			})//end of dbfunctions
	// 		})//end of it INVALID userId && INVALID clientId: should return err
	// 	})//end of userType == loanOfficer

	// 	describe('userType == realEstateAgent',function(){
	// 		it.only('valid userId && valid clientId: should return null',function(done){
	// 			dbFunctions.removeCommunicationNotification({
	// 				userType: 'realEstateAgent',					
	// 				userId:'504aff792f21b4a808000002',
	// 				clientId:'517da16cfae2a810ff00000f'			
	// 			},function(err){
	// 				expect(err).to.be(null);		
	// 				done()
	// 			})//end of dbfunctions
	// 		})//end of it valid userId && valid clientId: should return null
	// 		it('valid userId && INVALID clientId: should return err',function(done){
	// 			dbFunctions.removeCommunicationNotification({
	// 				userType: 'realEstateAgent',					
	// 				userId:'504aff792f21b4a808000002',
	// 				clientId:'504bkkkb59403000002'				
	// 			},function(err){
	// 				expect(err).to.not.be.empty();		
	// 				done()
	// 			})//end of dbfunctions
	// 		})//end of it valid userId && INVALID clientId: should return err
	// 		it('INVALID userId && valid clientId: should return err',function(done){
	// 			dbFunctions.removeCommunicationNotification({
	// 				userType: 'realEstateAgent',					
	// 				userId:'504aiii4a808000002',
	// 				clientId:'504bfa53bb86b59403000002'					
	// 			},function(err){
	// 				expect(err).to.not.be.empty();		
	// 				done()
	// 			})//end of dbfunctions
	// 		})//end of it INVALID userId && valid clientId: should return err
	// 		it('INVALID userId && INVALID clientId: should return err',function(done){
	// 			dbFunctions.removeCommunicationNotification({
	// 				userType: 'realEstateAgent',					
	// 				userId:'504aff79zzz8000002',
	// 				clientId:'504zzz6b59403000002'			
	// 			},function(err){
	// 				expect(err).to.not.be.empty();		
	// 				done()
	// 			})//end of dbfunctions
	// 		})//end of it INVALID userId && INVALID clientId: should return err
	// 	})//end of userType == realEstateAgent
	// 	describe('userType != loanOfficer or realEstateAgent',function(){
	// 		it('Should always return err',function(done){
	// 			dbFunctions.removeCommunicationNotification({
	// 				userType: 'bad',					
	// 				userId:'504aff79zzz8000002',
	// 				clientId:'504zzz6b59403000002'			
	// 			},function(err){
	// 				expect(err).to.not.be.empty();		
	// 				done()
	// 			})//end of dbfunctions
	// 		})//end of it INVALID userId && INVALID clientId: should return err
	// 	})//end of userType != loanOfficer or realEstateAgent			
	// });// end of DB: removeCommunicationNotification







  /** ****************************************************************************
   *  removeCommunicationNotification socket functions
   * ****************************************************************************/












}); //end of removeCommunicationNotification