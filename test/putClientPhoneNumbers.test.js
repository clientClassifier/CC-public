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



describe('putClientPhoneNumbers.test.js file:', function() {
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
   * putClientPhoneNumbers request
   * ****************************************************************************/




  /** ****************************************************************************
   * putClientPhoneNumbers router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  putClientPhoneNumbers DB functions
   * ****************************************************************************/
	describe('DB: putClientPhoneNumbers',function(){
		it('if client Id is good, and other data is good; error should be null',function(done){
			dbFunctions.putClientPhoneNumbers({
				clientId:'517da4343a7b7a0000000004',
				clientCellPhone:'(748) 907-1243',
				clientHomePHone:'',
				clientConfirmation:'on'
			},function(err,results){
				expect(err).to.be(null);			
				expect(results).to.not.be.empty();	
				done()
			})//end of dbfunctions
		})	

		it.skip('if client id is good, and data is bad should return error',function(done){
			dbFunctions.putClientPhoneNumbers({
				clientId:'517da4343a7b7a0000000004',
				clientCellPhone:'(748) 907-5555',
				clientHomePHone:'hola',
				clientConfirmation:'on'
			},function(err,results){
				expect(err).to.not.be.empty();
				expect(results).to.be(null);				
				done()
			})//end of dbfunctions
		})
	})// end of DB: putClientPhoneNumbers








  /** ****************************************************************************
   *  putClientPhoneNumbers socket functions
   * ****************************************************************************/












}); //end of putClientPhoneNumbers