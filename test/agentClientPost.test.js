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



describe('agentClientPost.test.js file:', function() {
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
   * agentClientPost request
   * ****************************************************************************/
	describe('agentClientPost: request',function(){
		it('if email is correct,redirect 302',function(done){
			var randstring = Math.random().toString(36).substring(7);
			request.post('/agent/:agentId/calculator/:clientId')
			.send({
				email:'jorge'+randstring+'@email.com',
				agentId: '504aff792f21b4a808000002',
				clientId:'504bfa53bb86b59403000002'						
			})
			.end(function(req,res){
				expect(res.status).to.be.equal(302);				
				done();
			})
		})//end of it if email is correct,redirect 302

		it('if email is not email,redirect 400',function(done){
			request.post('/agent/:agentId/calculator/:clientId')
			.send({
				email:'xxxxxsss',
				agentId: '504aff792f21b4a808000002',
				clientId:'504bfa53bb86b59403000002'						
			})
			.end(function(req,res){
				expect(res.status).to.be.equal(400);				
				done();
			})
		})//end of it if email is not email,redirect 400				
	})//end of agentClientPost
	



  /** ****************************************************************************
   * agentClientPost router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  agentClientPost DB functions
   * ****************************************************************************/
	describe('DB agentCreateClientAccount',function(){
		describe('userData Valid',function(){
			it.skip('if agentId && clientId is good, should  err == null',function(done){			
				var randstring = Math.random().toString(36).substring(7);
				dbFunctions.agentCreateClientAccount('unema'+ randstring +'il@email.com', {
													agentId: '504aff792f21b4a808000002',
													clientId:'517da4763a7b7a0000000008'													
												},function(err){
													expect(err).to.be(null);						
													// expect(results).to.be.an('object');				
													done() 		
												})//end of dbFunctions		
			})//end of it agentId && clientId is good, should  err == null	
		})//end of userdata Valid
		describe('userdata Invalid',function(){
			it('if agentId bad && clientId is good, should return error',function(done){			
				var randstring = Math.random().toString(36).substring(7);
				dbFunctions.agentCreateClientAccount('luis'+randstring+'@email.com',{										
					agentId: '504aff792fxxx000002',
					clientId:'504bfa53bb86b59403000002'
				},function(err){
					expect(err).to.not.be.empty();
					// expect(results).to.be(null);
					done() 
				})//end of dbFunctions		
			})//end of if agentId is bad && clientId is good, should return error
			it('if agentId is good && clientId is bad, should return error',function(done){
				var randstring = Math.random().toString(36).substring(7);
				dbFunctions.agentCreateClientAccount(randstring+'@email.com',{
					agentId: '504aff792f21b4a808000002',
					clientId:'hjashjs'
				},function(err,results){
					expect(err).to.not.be.empty();
					// expect(results).to.be(null);
					done() 
				})//end of dbFunctions
			})//end of if agentId is good && clientId is bad, should return error
		})		
	})//end of DB agentCreateClient








  /** ****************************************************************************
   *  agentClientPost socket functions
   * ****************************************************************************/












}); //end of agentClientPost