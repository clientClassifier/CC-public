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



describe('this.test.js file:', function() {
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

	describe('/privacypolicy', function(){
	    it('Page should render with status 200', function(done){
	      request
	        .get('/privacypolicy')
	        .end(function(err, res){
	          expect(res.status).to.be(200);
	          done();
	        })
	    });// end of page should return 200
	});// end of describe privacypolicy


  /** ****************************************************************************
   * this  router tests
   * ****************************************************************************/

	describe('PrivacyPolicy',function(){
		var req={
		}//end of req
		it('Page Should title "Privacy Policy"',function(done){
		  var res={
		    render:function(jade,data){
		      expect(data.title).to.be('Privacy Policy');
		      done();
		    }            
		  }//end of render
		  routes.privacyPolicy(req,res);
		})//end of Page should title "Privacity Policy"
		it('Should Render "static/privacyPolicy.jade"',function(done){
		  var res={
		    render:function(jade,data){
		      expect(jade).to.be('static/privacyPolicy.jade')
		      done()
		    } //end render
		  }//end of res
		  routes.privacyPolicy(req,res);
		})//enf of Should Render "static/privacyPolicy.jade"
		it('Render Should only receive: "title"',function(done){
		  var res={
		    render:function(jade,data){
		      expect(data).to.only.have.keys('title');
		      done()
		    }//end of render
		  }//end of res
		  routes.privacyPolicy(req,res);
		})//end of Render Should only receive: "title"
	})//end of describe PrivacyPolicy           

  /** ****************************************************************************
   *  this  DB functions
   * ****************************************************************************/







  /** ****************************************************************************
   *  this  socket functions
   * ****************************************************************************/












}); //end of this 