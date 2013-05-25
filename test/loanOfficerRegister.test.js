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



describe('loanOfficerRegister.test.js file:', function() {
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
   * loanOfficerRegister  request
   * ****************************************************************************/




  /** ****************************************************************************
   * loanOfficerRegister  router tests
   * ****************************************************************************/

	describe('loanOfficerRegister',function(){
	    var req={
	      session:{errorsRegister:''}
	    }
	    it('Should Render "loanOfficer/loanOfficerRegister.jade"',function(done){
	      var res={
	        render:function(jade,data){
	          expect(jade).to.be('loanOfficer/loanOfficerRegister.jade')
	          done()
	        }//end of render  
	      }//end of res
	      routes.loanOfficerRegister(req,res)
	    })//end of  Should Render "loanOfficer/loanOfficerRegister.jade"
	    it('req.session.errorsRegister  should be equal to data.errorsRegister ',function(done){
	      var res={
	        render:function(jade,data){
	          expect(data.errorsRegister).to.be(req.session.errorsRegister);
	          done()
	        }//end of render
	      }//end of res
	      routes.loanOfficerRegister(req,res);
	    })//end of req.session.errorsRegister  should be equal to data.errorsRegister 
	    it("Render Should only receive : 'title', 'errorsRegister','message'",function(done){
	      var res={
	        render:function(jade,data){
	          expect(data).to.only.have.keys('title', 'errorsRegister','message')
	          done()
	        }// end of render
	      }//end res
	      routes.loanOfficerRegister(req,res);
	    })//end of only receive : 'title', 'errorsRegister','message'
	})//end of describe loanOfficerRegister         

  /** ****************************************************************************
   *  loanOfficerRegister  DB functions
   * ****************************************************************************/







  /** ****************************************************************************
   *  loanOfficerRegister  socket functions
   * ****************************************************************************/












}); //end of loanOfficerRegister 