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



describe('adminUnassigned.test.js file:', function() {
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
   * adminUnassigned index request
   * ****************************************************************************/




  /** ****************************************************************************
   * adminUnassigned index router tests
   * ****************************************************************************/




   // describe('adminUnassignedPut: router: ', function(){

   //  it('should move the client to loan officer', function(done){



   //  });//end of it


   // });//end of desribe



  /** ****************************************************************************
   * adminUnassigned index DB functions
   * ****************************************************************************/



   describe('adminUnassigned: DB', function(){

    it('Verison 1: should return list of clients', function(done){
      dbFunctions.adminUnassigned({}, function(err, list){  
        expect(err).to.be(null);

        expect(list[0]).to.only.have.keys('client', 'userCreated', 'calculator', 'agentId', 'clientId', 'agent', 'assigned', '_id', '__v')
        done();
      });//end of db function
    });//end of it



    it.skip('version2: should return list of clients', function(done){ //incomplete
      dbFunctions.adminUnassigned2({}, function(err, list){  
        expect(err).to.be(null);
        done();
        // expect(list[0]).to.only.have.keys('client', 'userCreated', 'calculator', 'agentId', 'clientId', 'agent', 'assigned', '_id', '__v')

      });//end of db function
    });//end of it




   });//end of describe


   describe('updateDistributeAssignedStatus: DB', function(){

    it('should update the assigned vairable', function(done){
        var userdata = {
          clientId: '518bc494f6d3da79f0000004',
          loanOfficerId: '50471393a592d83c06000004'
        }

      dbFunctions.updateDistributeAssignedStatus(userdata, function(err){
        expect(err).to.be(null)
        done()
      });
    });//end of it
   });//end of describe




   describe.skip('cloneClientToLoanOfficer: DB: ', function(){

      it.skip('should move the client to loan officer', function(done){
        var userdata = {
          clientId: '518bc494f6d3da79f0000004',
          loanOfficerId: '50471393a592d83c06000004'
        }

        dbFunctions.cloneClientToLoanOfficer(userdata, function(err, result){

          expect(err).to.be(null);

        });//end of db function
      });//end of it
   });//end of desribe

















}); //end of adminUnassigned