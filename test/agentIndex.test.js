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



describe('agentIndex.test.js.test.js file:', function() {
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
   * agentIndex.test.js  request
   * ****************************************************************************/

  describe('agentIndex request:', function(){
    var Cookies;
    before( function(done){
      loginUser.anAgent(request, function(cookie){
        // console.log(cookie)
        Cookies = cookie;
        done();
      })
    });//end of before

    
    it('valid agentId -> page should render 200', function(done) {
      var req = request.get('/agent/504aff792f21b4a808000002');
      req.cookies = Cookies;
      req.set('Accept','application/json')
        .end(function(err, res) {
          expect(res.statusCode).to.be(200)
          done();
        });
    });//end of it

    it('INVALID agentId -> page should redirect 401', function(done) {
      var req = request.get('/agent/504aff792f2pb4a808000002');
      req.cookies = Cookies;
      req.set('Accept','application/json')
        .end(function(err, res) {
          expect(res.statusCode).to.be(401)
          done();
        });
    });//end of it


    it('valid agentId but not this agentID -> page should redirect 401', function(done) {
      var req = request.get('/agent/504aff792f2pb4a808000002');
      req.cookies = Cookies;
      req.set('Accept','application/json')
        .end(function(err, res) {
          expect(res.statusCode).to.be(401)
          done();
        });
    });//end of it

  });//end of request tests


  /** ****************************************************************************
   * agentIndex.test.js  router tests
   * ****************************************************************************/

  describe('agentIndex router:', function(){
      var req = {
        params: {
          agentId:'504aff792f21b4a808000002'
        },
        session: {
          totCommissions:'',
          userFirstName:'',
          userLastName:''
        }
      }// end of req
      it('valid agentId, page should render with agent/agentIndex.jade', function(done){
        var res = {
          render: function(jade, data){
            expect(jade).to.be('agent/agentIndex.jade')
            done();
          }
        };//end of res
        routes.agentIndex(req, res)
      })// end it of Page Should render with agent/agentIndex.jade
      it('valid agentId, page should render with data== title,totCommissions,agent,clients,currentClientId,inputErrors', function(done){
        var res = {
          render: function(jade, data){
            expect(data).to.only.have.keys('title','totCommissions','agent','clients','currentClientId','inputErrors')
            done();
          }// end of render
        };//end of res
        routes.agentIndex(req, res)
      })// end of it Page should render with data

      var reqINVALID = {
          params: {
            agentId:98798798798
          },
          session: {
            totCommissions:'',
            userFirstName:'',
            userLastName:''
          }
        }// end of req

      it("INVALID agentId as a number: redirect 400, to -> '/'",function(done){
        var res={
          redirect:function(code,back){
            expect(code).to.be(400)
            expect(back).to.be('/')
            done()
          }//redirect
        }//end of res
        routes.agentIndex(reqINVALID,res)
      })//end of If req.params.agentId is a number: redirect 400, to -> '/'


  })// end of describe agent Index              

  /** ****************************************************************************
   *  agentIndex.test.js  DB functions
   * ****************************************************************************/


  describe('agentIndex DB: getSelf',function(){
      it('valid agentId should return err == null',function(done){
        dbFunctions.getSelf('504aff792f21b4a808000002',function(err,results){
          expect(err).to.be(null);
          expect(results).to.be.an('object');         
          done();
        })//end of dbfunctions
      })//end of it should return err == null
      it('valid agentId should return result',function(done){
        dbFunctions.getSelf('504aff792f21b4a808000002',function(err,results){
          expect(err).to.be(null);
          expect(results).to.be.an('object');
          expect(results.clients).to.not.be.empty();
          done();
        })//end of dbfunctions
      })//end of it should return result
      it('valid agentId result.totComission should exist',function(done){
        dbFunctions.getSelf('504aff792f21b4a808000002',function(err,results){
          expect(err).to.be(null);
          expect(results).to.be.an('object');
          expect(results.totCommissions).to.not.be.empty();         
          done();
        })//end of dbfunctions
      })//end of it result.totComission should exist


      it('INVALID agentIdAgent does not exist: should return error',function(done){
        dbFunctions.getSelf('aaaaaaaa',function(err,results){
          expect(err).to.not.be.empty()
          done()
        })//end of dbfunctions
      })//end of it Agent does not exist: should return error

      it('INVALID agentIdAgent does not exist: result should be null',function(done){
        dbFunctions.getSelf('aaaaaaaa',function(err,results){
          expect(err).to.not.be.empty()
          expect(results).to.be(null)
          done()
        })//end of dbfunctions
      })//end of it Agent does not exist: result should be null

  });//end of DB: agentIndex




  /** ****************************************************************************
   *  agentIndex.test.js  socket functions
   * ****************************************************************************/












}); //end of agentIndex.test.js 