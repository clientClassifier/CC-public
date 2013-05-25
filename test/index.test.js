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



describe('index.test.js file:', function() {
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
   * index  request
   * ****************************************************************************/

  describe('/', function(){
    it('Page should render with status 200', function(done){
      request
        .get('/')
        .end(function(err, res){
          expect(res.status).to.be(200);
          done();
        })
    });// end of page should return 200
  });//end of describe index


  /** ****************************************************************************
   * index  router tests
   * ****************************************************************************/
  describe('/',function(){
    var req={
    }
    it('Should Render "index.jade"',function(done){
      var res={
        render:function(jade,data){
          expect(jade).to.be('index.jade')
          done()
        }//end of render  
      }//end of res
      routes.index(req,res)
    })//end of Page Should render "index.jade"
    it('Render Should only receive : "title"',function(done){
      var res={
        render:function(jade,data){
          expect(data).to.only.have.keys('title')
          done()
        }// end of render
      }//end res
      routes.index(req,res);
    })//end of title
  })//end of describe /
              

  /** ****************************************************************************
   *  index  DB functions
   * ****************************************************************************/







  /** ****************************************************************************
   *  index  socket functions
   * ****************************************************************************/












}); //end of index 