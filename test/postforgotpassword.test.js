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



describe('postforgotpassword.test.js file:', function() {
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
   * this request
   * ****************************************************************************/
	describe('postforgotpassword:  request',function(){
		describe('POST data Invalid',function(){
			it('If req.body.userType != realEstateAgent or loanOfficer: redirect 302',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/forgotpassword')
				.send({
					userType:'Good',					
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(302);	
					expect(res.header.location).to.be('/forgotpassword')				
					done();
				})
			})//end of It If req.body.userType != realEstateAgent or loanOfficer: redirect 302
		})//end of POST data invalid
		describe('POS data valid',function(){
			it('Page should render with status 200',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/forgotpassword')
				.send({
					userType:'realEstateAgent',	
					email:'gilmer@email.com',				
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(200);										
					done();
				})
			})//end of It Page should render with status 200
		})//end of POST data valid
	})//end of /forgotpassword --> POST



  /** ****************************************************************************
   * this router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  this DB functions
   * ****************************************************************************/

   describe('findEmail',function(){
		it.skip('if email good, should  err == null',function(done){		
			dbFunctions.findEmail({email: 'ratwo@email.com',
									userType:'loanOfficer'
										},function(err,result){
											expect(err).to.be(null);	
											// expect(results).to.be.an('object');					
											expect(result).to.not.be.empty();				
											done() 		
			})//end of dbFunctions		
		})//end of it if email good, should  err == null
		it('if email is bad, should return err',function(done){
			dbFunctions.findEmail({email:'gilmeremail.com',
								    userType:'loanOfficer'								    
								},function(err,result){
									expect(err).to.not.be.empty();
									expect(result).to.be(null);
									done()
			})//end of dbfucntion
		})//end of it if email is bad, should return err
	})//end of findEmail






  /** ****************************************************************************
   *  this socket functions
   * ****************************************************************************/












}); //end of this