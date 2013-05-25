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



describe('agentClient.test.js file:', function() {
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
   * agentClient  request
   * ****************************************************************************/

  describe('agentClient request', function(){
    
    var Cookies;
    before( function(done){
      loginUser.anAgent(request, function(cookie){
        Cookies = cookie;
        done();
      })
    });//end of before

        it('valid agentId && valid clientId -> page should render 200', function(done) {
          var req = request.get('/agent/504aff792f21b4a808000002/calculator/517da4343a7b7a0000000004');
          req.cookies = Cookies;
          req.set('Accept','application/json')
            .end(function(err, res) {
              expect(res.statusCode).to.be(200)
              done();
            });
        });//end of it


        it('valid agentId && INVALID clientId -> page should redirect 302', function(done) {
          var req = request.get('/agent/504aff792f21b4a808000002/calculator/517da4343a7b7a0000000004---');
          req.cookies = Cookies;
          req.set('Accept','application/json')
            .end(function(err, res) {
              expect(res.statusCode).to.be(302)
              done();
            });
        });//end of it


        it('INVALID agentId && valid clientId -> page should return 401', function(done) {
          var req = request.get('/agent/504aff792f21b4a808000002---/calculator/517da4343a7b7a0000000004');
          req.cookies = Cookies;
          req.set('Accept','application/json')
            .end(function(err, res) {
              expect(res.statusCode).to.be(401)
              done();
            });
        });//end of it

        it('INVALID agentId && INVALID clientId -> page should return 401', function(done) {
          var req = request.get('/agent/504aff792f21b4a808000002---/calculator/517da4343a7b7a0000000004---');
          req.cookies = Cookies;
          req.set('Accept','application/json')
            .end(function(err, res) {
              expect(res.statusCode).to.be(401)
              done();
            });
        });//end of it
  });//end of agent client describe 


  /** ****************************************************************************
   * agentClient  router tests
   * ****************************************************************************/

  describe('agentClient',function(){
    describe('params data VALID: ', function(){
      var req={
        params:{
          agentId:'504aff792f21b4a808000002',
          clientId:'517da4343a7b7a0000000004'},
        session:{ClientPhoneErrors:'hdhd',isNewClient:''}
      }// end of req
      it('Page should render "agent/agentClient.jade"',function(done){
        var res={
          render:function(jade,date){
            expect(jade).to.be('agent/agentClient.jade')
            done();
          }//end of render
        }//end of res
        routes.agentClient(req,res);
      });// end of Page should render 'agent/agentClient.jade' 
      it('Page should render with data == title,clients,calcData,currentClientId,currentClient,clientPhoneErrors', function(done){
        var res = {
          render: function(jade, data){
            expect(data).to.only.have.keys('title','clients','calcData','currentClientId','currentClient','clientPhoneErrors','contactErrors','confirmEmailClient','confirmEmailClienError','totCommissions')
            done();
          }//end of render
        };//end of res
        routes.agentClient(req, res)
      })// end of Page should render with data
      it('req.session.ClientPhoneErrors  should be equal to data.ClientPhoneErrors ',function(done){
        var req={
          params:{
            agentId:'504aff792f21b4a808000002',
            clientId:'517da4343a7b7a0000000004'},
          session:{ClientPhoneErrors:'',isNewClient:''}
        }// end of req
        var res={
          render:function(jade,data){
            expect(data.clientPhoneErrors).to.be(req.session.ClientPhoneErrors);
            done()
          }//end of render
        }//end of res
        routes.agentClient(req,res);
      })//end of req.session.ClientPhoneErrors  should be equal to data.ClientPhoneErrors 
    })//end of params data valid
    describe('params data INVALID:',function(){
        it("agentId is 'null' : should redirect '/' with 302",function(done){
          var req={
            params:{
              agentId:null,
              clientId:'517da4343a7b7a0000000004'
            },
            session:{ClientPhoneErrors:'hdhd',isNewClient:''}
          }//end of request
          var res={
            redirect:function(code,back){
              expect(code).to.be(302)
              done()
            }//end of redirect
          }//end of response
          routes.agentClient(req,res)
        })//enf of agentId is  'undefined' : should redirect '/' with 302
        it("agentId is  'undefined' : should redirect '/' with 302",function(done){
          var req={
            params:{
              clientId:'517da4343a7b7a0000000004'
            },
            session:{ClientPhoneErrors:'hdhd',isNewClient:''}
          }//end of request
          var res={
            redirect:function(code,back){
              expect(code).to.be(302)
              done()
            }//end of redirect
          }//end of response
          routes.agentClient(req,res)
        })//enf of agentId is  'undefined' : should redirect '/' with 302
        it("agentId is  'number' : should redirect '/' with 302",function(done){
          var req={
            params:{
              agentId:97897808980,
              clientId:'517da4343a7b7a0000000004'
            },
            session:{ClientPhoneErrors:'hdhd',isNewClient:''}
          }//end of request
          var res={
            redirect:function(code,back){
              expect(code).to.be(302)
              done()
            }//end of redirect
          }//end of response
          routes.agentClient(req,res)
        })//enf of agentId is  'number' : should redirect '/' with 302
        it("clientId is 'null' : should redirect '/' with 302",function(done){
          var req={
            params:{
              agentId:'504aff792f21b4a808000002',
              clientId:null},
            session:{ClientPhoneErrors:'hdhd',isNewClient:''}
          }//end of request
          var res={
            redirect:function(code,back){
              expect(code).to.be(302)
              done()
            }//end of redirect
          }//end of response
          routes.agentClient(req,res)
        })//enf of agentId is  'undefined' : should redirect '/' with 302
        it("clientId is  'undefined' : should redirect '/' with 302",function(done){
          var req={
            params:{
              agentId:'504aff792f21b4a808000002'},
            session:{ClientPhoneErrors:'hdhd',isNewClient:''}
          }//end of request
          var res={
            redirect:function(code,back){
              expect(code).to.be(302)
              done()
            }//end of redirect
          }//end of response
          routes.agentClient(req,res)
        })//enf of agentId is  'undefined' : should redirect '/' with 302
        it("clientId is  'number' : should redirect '/' with 302",function(done){
          var req={
            params:{
              agentId:'504aff792f21b4a808000002',
              clientId:354354356756},
            session:{ClientPhoneErrors:'hdhd',isNewClient:''}
          }//end of request
          var res={
            redirect:function(code,back){
              expect(code).to.be(302)
              done()
            }//end of redirect
          }//end of response
          routes.agentClient(req,res)
        })//enf of agentId is  'number' : should redirect '/' with 400
    })//end of describe params data INVALID:
  })// end of describe agent client
              

  /** ****************************************************************************
   *  agentClient  DB functions
   * ****************************************************************************/


  describe('agentClient DB: getOnlyClientNames',function(){
    describe('If valid userdata',function(){
      it('should return err == null and  should return result',function(done){
        dbFunctions.getOnlyClientNames({agentId: '504aff792f21b4a808000002', clientId:'517da4343a7b7a0000000004'} ,function(err,results){
          expect(err).to.be(null);
          expect(results).to.be.ok()
          expect(results).to.be.an('object');         
          done()
        })//end of dbfunctions
      })
    })//If valid userdata
    describe('If userdata INVALID',function(){
      it('userdata.clientID does not exist for agentId, should return err',function(done){
        dbFunctions.getOnlyClientNames({agentId: '504aff792f21b4a808000002', clientId:'517da4343a7b7a0000000004xxx'} ,function(err,results){
          expect(err).to.not.be.empty()
          expect(results).to.be(null)
          done()
        })//end of dbfunctions
      })

      it('userdata.agentId is malformed, should return err',function(done){
        dbFunctions.getOnlyClientNames({agentId: '504aff7sssss92f21b4a808000002', clientId:'517da4343a7b7a0000000004'} ,function(err,results){
          expect(err).to.not.be.empty()
          expect(results).to.be(null)
          done()
        })//end of dbfunctions
      })
    })//If userdata INVALID 
  });//end of DB: getOnlyClientNames




  /** ****************************************************************************
   *  agentClient  socket functions
   * ****************************************************************************/












}); //end of agentClient 