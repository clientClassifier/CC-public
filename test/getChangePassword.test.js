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



describe('getChangePassword.test.js file:', function() {
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
   * getChangePassword request
   * ****************************************************************************/




  /** ****************************************************************************
   * getChangePassword router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  getChangePassword DB functions
   * ****************************************************************************/
    describe('DB: getChangePassword',function(){	/*i dont have this in my db... finalize DB*/
		it.skip('if confirm code correct & still valid return null',function(done){		
			dbFunctions.getChangePassword('$2a$10$v3UvMz2cXm3h/AFAHqMd4uLPi.qanq7J4pTEjsy3uGvBYoXChh3Ta',function(err){
				expect(err).to.be(null);	
				done()
			})//end of dbfunctions
		})

		it('if confirm code has been queried more than 10 times should fail',function(done){		
			dbFunctions.getChangePassword('$2a$10$HdiwY0MlelGQeZhpPd3Tx.o0S.C0B4ESYvsH.oDtERHOyqsUWXtuq',function(err){
				expect(err).to.not.be.empty();		
				done()
			})//end of dbfunctions
		})
		
		it('if confirm code is older than 2 hours and 10 minutes should fail',function(done){		
			dbFunctions.getChangePassword('$2a$10$bQcrVqgNPNc7Jj8Bm6mjl.V3popceJGRvTvJr2LPXg/ex8UPlX1v.',function(err){
				expect(err).to.not.be.empty();		
				done()
			})//end of dbfunctions
		})
		
	});//DB: getChangePassword








  /** ****************************************************************************
   *  getChangePassword socket functions
   * ****************************************************************************/












}); //end of getChangePassword