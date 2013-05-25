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



describe('postChangePassword.test.js file:', function() {
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
   * postChangePassword request
   * ****************************************************************************/
	describe('postChangePassword: request',function(){
		describe('POST data invalid',function(){
			it('If email is not email: redirect 400',function(done){				
				request.post('/forgotpassword/:confirmCode ')
				.send({
					email:'gilmeremail.com',		
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);										
					done();
				})
			})//end of It If email is not email: redirect 400
		})//end of POST data invalid
		describe('POST data valid',function(){
			it('If POST data is formatted correclty: Page should redirect with status 302',function(done){
			    				
				request.post('/forgotpassword/:confirmCode ')
				.send({
					email:'gilmer@email.com',		
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(302);																		
					done();
				})
			})//end of It If POST data is formatted correclty: Page should redirect with status 302
		})//end of If POST data is formatted correclty: Page should redirect with status 302
	})//end of /forgotpassword/:confirmCode --> POST




  /** ****************************************************************************
   * postChangePassword router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  postChangePassword DB functions
   * ****************************************************************************/








  /** ****************************************************************************
   *  postChangePassword socket functions
   * ****************************************************************************/












}); //end of postChangePassword