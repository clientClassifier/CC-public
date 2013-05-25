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



describe('enter.test.js file:', function() {
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
   * enter  request
   * ****************************************************************************/
	describe('/enter', function(){
	    it('Page should render with status 200', function(done){
	      request
	        .get('/enter')
	        .end(function(err, res){
	          expect(res.status).to.be(200);
	          done();
	        })
	    });// end of page should return 200
	});//end of describe enter


  /** ****************************************************************************
   * enter  router tests
   * ****************************************************************************/
	describe('Enter',function(){
	    var req={
	      session:{errorsRegister:'',errorsLogIn :'',confirmEmail :''}
	    }
	    it('Should Render "scriptPages/enter.jade"',function(done){
	      var res={
	        render:function(jade,data){
	          expect(jade).to.be('scriptPages/enter.jade')
	          done()
	        }//end of render  
	      }//end of res
	      routes.enter(req,res)
	    })//end of  Should Render "scriptPages/enter.jade"
	    it('req.session.errorsRegister  should be equal to data.errorsRegister ',function(done){
	      var res={
	        render:function(jade,data){
	          expect(data.errorsRegister).to.be(req.session.errorsRegister);
	          done()
	        }//end of render
	      }//end of res
	      routes.enter(req,res);
	    })//end of req.session.errorsRegister  should be equal to data.errorsRegister 
	    it('req.session.errorsLogIn  should be equal to data.errorsLogIn ',function(done){
	      var res={
	        render:function(jade,data){
	          expect(data.errorsLogIn).to.be(req.session.errorsLogIn);
	          done()
	        }//end of render
	      }//end of res
	      routes.enter(req,res);
	    })//end of req.session.errorsLogIn  should be equal to data.errorsLogIn 
	    it('req.session.confirmEmail  should be equal to data.confirmEmail ',function(done){
	      var res={
	        render:function(jade,data){
	          expect(data.confirmEmail).to.be(req.session.confirmEmail);
	          done()
	        }//end of render
	      }//end of res
	      routes.enter(req,res);
	    })//end of req.session.confirmEmail  should be equal to data.confirmEmail 
	    it("Render Should only receive : 'title', 'errorsRegister', 'errorsLogIn', 'confirmEmail'",function(done){
	      var res={
	        render:function(jade,data){
	          expect(data).to.only.have.keys('title', 'errorsRegister', 'errorsLogIn', 'confirmEmail')
	          done()
	        }// end of render
	      }//end res
	      routes.enter(req,res);
	    })//end of only receive : 'title', 'errorsRegister', 'errorsLogIn', 'confirmEmail'
	})//end of describe Enter 
              

  /** ****************************************************************************
   *  enter  DB functions
   * ****************************************************************************/







  /** ****************************************************************************
   *  enter  socket functions
   * ****************************************************************************/












}); //end of enter 