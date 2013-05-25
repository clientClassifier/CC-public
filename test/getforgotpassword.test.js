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



describe('getforgotpassword.test.js file:', function() {
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
   * this  request
   * ****************************************************************************/
	
	describe('/getforgotpassword', function(){
	    it('Page should render with status 200', function(done){
	      request
	        .get('/forgotpassword')
	        .end(function(err, res){
	          expect(res.status).to.be(200);
	          done();
	        })
	    });// end of page should return 200
	});// end of describe getforgotpassword



  /** ****************************************************************************
   * this  router tests
   * ****************************************************************************/
	
	describe('getforgotpassword',function(){
	    var req={
	    }
	    it('Should Render "scriptPages/forgotpassword.jade"',function(done){
	      var res={
	        render:function(jade,data){
	          expect(jade).to.be('scriptPages/forgotpassword.jade')
	          done()
	        }//end of render  
	      }//end of res
	      routes.getforgotpassword(req,res)
	    })//end of Page Should render "scriptPages/forgotpassword.jade"
	    it("Render Should only receive :  'title', 'EmalingMessage'",function(done){
	      var res={
	        render:function(jade,data){
	          expect(data).to.only.have.keys('title', 'EmalingMessage')
	          done()
	        }// end of render
	      }//end res
	      routes.getforgotpassword(req,res);
	    })//end of Only receive : 'title', 'EmalingMessage'
	})//end of describe getforgotpassword 
              

  /** ****************************************************************************
   *  this  DB functions
   * ****************************************************************************/







  /** ****************************************************************************
   *  this  socket functions
   * ****************************************************************************/












}); //end of this 