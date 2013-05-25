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



describe('confirmNewUser.test.js file:', function() {
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
   * confirmNewUser request
   * ****************************************************************************/




  /** ****************************************************************************
   * confirmNewUser router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  confirmNewUser DB functions
   * ****************************************************************************/

    describe('DB: confirmNewUser',function(){ /*fails because this item does not exist in my db, need to finalize all our dbs*/	
			it.skip('if valid confirmCode: should return err == null && result',function(done){		
				dbFunctions.confirmNewUser('$2a$10$JDU/xiMxlo0KlbxMJlwPoekJEATVmsdvFljNTZpfqtnlBWoa3h.Wq',function(err){
					expect(err).to.be(null);								
					done()
				})//end of dbfunctions
			})//end of it if valid confirmCode: should return err == null && result

			it('if invalid confirm code, should return User was Null',function(done){		
				dbFunctions.confirmNewUser('zzzzzzzzzzzzzzzzzzzz',function(err){
					expect(err).to.not.be.empty();			
					done()
				})//end of dbfunctions
			})
	});//end of DB: confirmNewUser






  /** ****************************************************************************
   *  confirmNewUser socket functions
   * ****************************************************************************/












}); //end of confirmNewUser