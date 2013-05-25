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



describe('consumerLeads.test.js file:', function() {
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
   * consumerLeads  request
   * ****************************************************************************/




  /** ****************************************************************************
   * consumerLeads  router tests
   * ****************************************************************************/

	describe('consumerLeads',function(){
	    describe('params data VALID',function(){
	      var req={
	        params:{index:1}
	      }//end of request
	      it('Page should render "admin/consumerLeads.jade"',function(done){
	        var res={
	          render:function(jade,data){
	            expect(jade).to.be('admin/consumerLeads.jade')
	            done()
	          }//end of render
	        }//end of response
	        routes.consumerLeads(req,res);
	      })//end of Page should render 'admin/consumerLeads.jade'
	      it("Render should only receieve: 'title', 'allLO', 'previous', 'next'",function(done){
	        var res={
	          render:function(jade,data){
	            expect(data).to.only.have.keys('title', 'allLO','consumers', 'previous', 'next')
	            done()
	          }//end of render
	        }//end response
	        routes.consumerLeads(req,res)
	      })//end of Render should only receieve: 'title', 'allLO', 'previous', 'next' 
	    })//end of params data VALID
	    describe('params data INVALID',function(){
	      var req={
	        params:{index:"zzz"}
	      }//end of request
	      it('If req.params.index == string: redirect 302',function(done){
	        var res={
	          redirect:function(code,back){
	            expect(code).to.be(302)
	            done()
	          }
	        }
	        routes.consumerLeads(req,res)
	      })//end of If req.params.index == string: redirect 302
	      it("If req.params.index == string: redirect to - > '/consumerleads/1'",function(done){
	        var res={
	          redirect:function(code,back){
	            expect(back).to.be('/consumerLeads/1')
	            done()
	          }
	        }
	        routes.consumerLeads(req,res)
	      })//If req.params.index == string: redirect to - > '/consumerleads/1'
	    })//end of params data INVALID
	})//end of describe consumerLeds        

  /** ****************************************************************************
   *  consumerLeads  DB functions
   * ****************************************************************************/







  /** ****************************************************************************
   *  consumerLeads  socket functions
   * ****************************************************************************/












}); //end of consumerLeads 