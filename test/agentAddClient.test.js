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



describe('agentAddClient.test.js file:', function() {
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
   * agentAddClient  request
   * ****************************************************************************/

    describe('agent addClient request', function(){

      var Cookies;
      before( function(done){
        loginUser.anAgent(request, function(cookie){
          // console.log(cookie)
          Cookies = cookie;
          done();
        })
      });//end of before


      describe('INVALID parmas. ', function(){

          it('firstName has numbers: should redirect back with 302', function(done) {
            var req = request.post('/agent/504aff792f21b4a808000002/addClient');
            req.cookies = Cookies;
            req.set('Accept','application/json')
            req.send({firstName: 'sammy232', lastName: 'potato', middleName: ''})
              .end(function(err, res) {
                expect(res.statusCode).to.be(302)
                expect(res.header.location).to.be('/agent/504aff792f21b4a808000002')
                done();
              });
          });//end of it

          it('firstName has special characters: should redirect back with 302', function(done) {
            var req = request.post('/agent/504aff792f21b4a808000002/addClient');
            req.cookies = Cookies;
            req.set('Accept','application/json')
              .send({firstName: 'hey&^*(', lastName: 'potato', middleName: ''})
              .end(function(err, res) {
                expect(res.statusCode).to.be(302)
                expect(res.header.location).to.be('/agent/504aff792f21b4a808000002')
                done();
              });
          });//end of it


          it('lastName has numbers: should redirect back with 302', function(done) {
            var req = request.post('/agent/504aff792f21b4a808000002/addClient');
            req.cookies = Cookies;
            req.set('Accept','application/json')
              .send({firstName: 'sammy', lastName: 'potato123', middleName: ''})
              .end(function(err, res) {
                expect(res.statusCode).to.be(302)
                expect(res.header.location).to.be('/agent/504aff792f21b4a808000002')
                done();
              });
          });//end of it

          it('lastName has special characters: should redirect back with 302', function(done) {
            var req = request.post('/agent/504aff792f21b4a808000002/addClient');
            req.cookies = Cookies;
            req.set('Accept','application/json')
              .send({firstName: 'sammy', lastName: 'potato%^&', middleName: ''})
              .end(function(err, res) {
                expect(res.statusCode).to.be(302)
                expect(res.header.location).to.be('/agent/504aff792f21b4a808000002')
                done();
              });
          });//end of it


          it('lastName has numbers: should redirect back with 302', function(done) {
            var req = request.post('/agent/504aff792f21b4a808000002/addClient');
            req.cookies = Cookies;
            req.set('Accept','application/json')
              .send({firstName: 'sammy', lastName: 'potato', middleName: 'mid234'})
              .end(function(err, res) {
                expect(res.statusCode).to.be(302)
                expect(res.header.location).to.be('/agent/504aff792f21b4a808000002')
                done();
              });
          });//end of it

          it('lastName has special characters: should redirect back with 302', function(done) {
            var req = request.post('/agent/504aff792f21b4a808000002/addClient');
            req.cookies = Cookies;
            req.set('Accept','application/json')
              .send({firstName: 'sammy', lastName: 'potato', middleName: 'mid&**&'})
              .end(function(err, res) {
                expect(res.statusCode).to.be(302)
                expect(res.header.location).to.be('/agent/504aff792f21b4a808000002')
                done();
              });
          });//end of it



          it('INVALID agentId -> page should redirect 401 to /', function(done) {
            var req = request.post('/agent/504aff792f21b4a808000002----/addClient');
            req.cookies = Cookies;
            req.set('Accept','application/json')
              .send({firstName: 'sammy', lastName: 'potato', middleName: 'mid&**&'})
              .end(function(err, res) {
                expect(res.statusCode).to.be(401)
                expect(res.header.location).to.be('/')
                done();
              });
          });//end of it

          it('INVALID agentId -> page should redirect 401 to /', function(done) {
            var req = request.post('/agent/504aff792f21b4a808000002----/addClient');
            req.cookies = Cookies;
            req.set('Accept','application/json')
              .send({firstName: 'sammy', lastName: 'potato', middleName: 'mid&**&'})
              .end(function(err, res) {
                expect(res.statusCode).to.be(401)
                expect(res.header.location).to.be('/')
                done();
              });
          });//end of it
      });//end of INVALID 

      describe('valid params.', function(){

        it('Current agentId-> should redirect 302 to agentClient Page', function(done) {
            var req = request.post('/agent/504aff792f21b4a808000002/addClient');
            req.cookies = Cookies;
            req.set('Accept','application/json')
              .send({firstName: 'sammy', lastName: 'potato', middleName: 'mid'})
              .end(function(err, res) {
                expect(res.statusCode).to.be(302)
            var params = res.header.location.split('/');
                expect(res.header.location).to.be('/agent/504aff792f21b4a808000002/calculator/' + params[4])
                done();
              });
          });//end of it

        it('valid agentId but not current agentID -> page should redirect 401', function(done) {
            var req = request.post('/agent/5047136ba592d83c06000003/addClient'); //that is agent bruno
            req.cookies = Cookies;
            req.set('Accept','application/json')
              .send({firstName: 'sammy', lastName: 'potato', middleName: 'mid'})
              .end(function(err, res) {
                expect(res.statusCode).to.be(401)
                expect(res.header.location).to.be('/')
                done();
              });
          });//end of it



      });//end of valid params
    });//end of agent AddClient


  /** ****************************************************************************
   * agentAddClient  router tests
   * ****************************************************************************/

              

  /** ****************************************************************************
   *  agentAddClient  DB functions
   * ****************************************************************************/

  describe('agent addClient: DB: addNewClient',function(){ /* BUG trailing object ID is added to clients */ // oh i have to add the proper object, else it fails
    describe('If valid userdata',function(){
      it('should return err === null and should return id',function(done){
        dbFunctions.addNewClient({
          agentId:'504aff792f21b4a808000002',
          firstName:'mario',
          middleName:'jorge',
          lastName:'Rosales'

        },function(err,results){
          expect(err).to.be(null);
          expect(results).not.to.have.length(0);
          expect(results[0]).to.not.be.empty();
          done()
        })//end of dbfunctions
      })//end of it should return null and id
    })//end of if valid userdata

    describe('If INVALID userdata',function(){
      it('agentId does not exist, should return err and should return null result',function(done){
        dbFunctions.addNewClient({
          agentId:'504aff792f21b4a808000002----',
          firstName:'mario',
          middleName:'jorge',
          lastName:'Rosales'
        },function(err,results){
          expect(err).to.not.be.empty();
          expect(results).to.be(null);
          done()
        })//end of dbfunctions
      })// end of it agentId does not exist
    })//If INVALID userdata 
  });//end of DB: addNewClient





  /** ****************************************************************************
   *  agentAddClient  socket functions
   * ****************************************************************************/












}); //end of agentAddClient 