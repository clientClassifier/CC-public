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

describe('agentPutClientPhoneNumber.test.js file:', function() {
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
   * agentPutClientPhoneNumber.test.js  request
   * ****************************************************************************/

  describe('agent addClient request', function(){

      var Cookies;
      before( function(done){
        loginUser.anAgent(request, function(cookie){
          Cookies = cookie;
          done();
        })
      });//end of before

      it('valid cellPhone & clientPermission, should return with 302', function(done){
        var req = request.put('/agent/504aff792f21b4a808000002/calculator/517da4343a7b7a0000000004');//client = pietro
        req.cookies = Cookies;
        req.set('Accept','application/json')
        req.send({clientCellPhone: '(818) 357-9761', clientConfirm: 'on', clientHomePhone: '', clientId: '517da4343a7b7a0000000004'})
          .end(function(err, res) {
            expect(res.statusCode).to.be(302)
            done();
        });//end of req        
      });//end of it

      it('vallid cellPhone & INVALID clientPermission, should return 400', function(done){
        var req = request.put('/agent/504aff792f21b4a808000002/calculator/517da4343a7b7a0000000004');//client = pietro
        req.cookies = Cookies;
        req.set('Accept','application/json')
        req.send({clientCellPhone: '(818) 357-9761', clientConfirm: 'off', clientHomePhone: '', clientId: '517da4343a7b7a0000000004'})
          .end(function(err, res) {
            expect(res.statusCode).to.be(400)
            done();
        });//end of req        
      });//end of it

      it('INVALID cellPhone & valid clientPermission, should return 400', function(done){
        var req = request.put('/agent/504aff792f21b4a808000002/calculator/517da4343a7b7a0000000004');//client = pietro
        req.cookies = Cookies;
        req.set('Accept','application/json')
        req.send({clientCellPhone: '(818) 357-9761***', clientConfirm: 'on', clientHomePhone: '', clientId: '517da4343a7b7a0000000004'})
          .end(function(err, res) {
            expect(res.statusCode).to.be(400)
            done();
        });//end of req        
      });//end of it

      it('INVALID cellPhone & INVALID clientPermission, should return 400', function(done){
        var req = request.put('/agent/504aff792f21b4a808000002/calculator/517da4343a7b7a0000000004');//client = pietro
        req.cookies = Cookies;
        req.set('Accept','application/json')
        req.send({clientCellPhone: '(818) 357-9761*', clientConfirm: 'off', clientHomePhone: '', clientId: '517da4343a7b7a0000000004'})
          .end(function(err, res) {
            expect(res.statusCode).to.be(400)
            done();
        });//end of req        
      });//end of it      

  });//end of describe


  /** ****************************************************************************
   * agentPutClientPhoneNumber.test.js  router tests
   * ****************************************************************************/

              

  /** ****************************************************************************
   *  agentPutClientPhoneNumber.test.js  DB functions
   * ****************************************************************************/


  describe('putClientPhoneNumbers DB: ',function(){
    it('valid clientId with well formed data, should return WITHOUT error',function(done){
      dbFunctions.putClientPhoneNumbers({
        clientId:'517da4343a7b7a0000000004',
        clientCellPhone:'(748) 907-1243',
        clientHomePHone:'',
        clientConfirmation:'on'
      },function(err,results){
        expect(err).to.be(null);      
        expect(results).to.not.be.empty();  
        done()
      })//end of dbfunctions
    })  

    // it.only('valid clientId with and data is bad should return WITH error',function(done){
    //   dbFunctions.putClientPhoneNumbers({
    //     clientId:'517da4343a7b7a0000000004',
    //     clientCellPhone:'(748) 907-5555',
    //     clientHomePHone:'(333) 907-5555',
    //     clientConfirmation:'off' //THIS IS THE PART WITH BAD DATA
    //   },function(err,results){
    //     // expect(err).to.not.be.empty();
    //     expect(results).to.be(null);        
    //     done()
    //   })//end of dbfunctions
    // });//end of it
  })// end of DB: putClientPhoneNumbers





  /** ****************************************************************************
   *  agentPutClientPhoneNumber.test.js  socket functions
   * ****************************************************************************/












}); //end of agentPutClientPhoneNumber.test.js 