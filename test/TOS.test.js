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



describe('TOS.test.js file:', function() {
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
   * TOS  request
   * ****************************************************************************/

  describe('/termsandconditions', function(){
    it('Page should render with status 200', function(done){
      request
        .get('/termsandconditions')
        .end(function(err, res){
          expect(res.status).to.be(200);
          // console.log(res.header)
          done();
        })
    });// end of page should return 200
  });//end of describe termsandconditions


  /** ****************************************************************************
   * TOS  router tests
   * ****************************************************************************/

  describe('TOS',function(){
    var req={
    };//end of req
    it('Page Should have title "Terms and Conditions"',function(done){
      var res={
        render:function(jade,data){
          expect(data.title).to.be('Terms and Conditions');
          done();
        }//end of render
      }//end of res
      routes.TOS(req,res);
    });//end of Page Should have title "Termn and Conditions"
    it('Should Render "static/TOS.jade"',function(done){
      var res=
      {
        render:function(jade,data){
          expect(jade).to.be('static/TOS.jade')
          done();
        }//end of render
      }//end of res
      routes.TOS(req,res);
    });//end of Should render "static/TOS.jade"
    it('render should only receive: "title"',function(done){
      var res={
        render:function(jade,data){
          expect(data).to.only.have.keys('title');
          done();
        }//end render
      }//end res 
      routes.TOS(req,res);
    });//end of Page Should only receive: 'title'
  });//end of function TOS        

  /** ****************************************************************************
   *  TOS  DB functions
   * ****************************************************************************/







  /** ****************************************************************************
   *  TOS  socket functions
   * ****************************************************************************/












}); //end of TOS 