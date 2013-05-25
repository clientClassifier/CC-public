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



describe('agentIndex.test.js file:', function() {
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
   * loanOfficer index request
   * ****************************************************************************/



  describe('loanOfficer Routes.', function() {

    var Cookies;
    before(function(done) {
      loginUser.xavier(request, function(cookie) {
        Cookies = cookie;
        done();
      })
    }); //end of before


    describe('loanOfficerIndex request', function() {

      it('LoanOfficer index page status should be 200', function(done) {
        var req = request.get('/loanOfficer/50471393a592d83c06000004');
        req.cookies = Cookies;
        req.set('Accept', 'application/json')
          .end(function(err, res) {
          expect(res.statusCode).to.be(200)
          done();
        });
      }); //end of it

      it('valid agentId but not current lenderID -> page should redirect 401', function(done) {
        var req = request.get('/loanOfficer/504ea0e129db6f590a000002'); //ratwo loanofficer
        req.cookies = Cookies;
        req.set('Accept', 'application/json')
          .end(function(err, res) {
          expect(res.statusCode).to.be(401)
          done();
        });
      }); //end of it

      it('INVALID lenderId -> page should redirect 401', function(done) {
        var req = request.get('/loanOfficer/50471393a592d83c06000004--');
        req.cookies = Cookies;
        req.set('Accept', 'application/json')
          .end(function(err, res) {
          expect(res.statusCode).to.be(401)
          done();
        });
      }); //end of it
    }); //end of loanofficer index page

  }); //end of loan officer requesets



  /** ****************************************************************************
   * loanOfficer index router tests
   * ****************************************************************************/


  describe('loanOfficerIndex', function() {
    describe('params data VALID', function() {
      var req = {
        params: {
          lenderId: '50471393a592d83c06000004'
        },
        session: {
          numUnassigned: ''
        }
      } //end of req
      it("lenderId user exists: should render 'loanofficer/loanOfficerIndex.jade'", function(done) {
        var res = {
          render: function(jade, data) {
            expect(jade).to.be('loanofficer/loanOfficerIndex.jade')
            done();
          } // end of render
        } // end of res
        routes.loanOfficerIndex(req, res);
      }); // end of lenderId user exists: should render 'loanofficer/loanOfficerIndex.jade'
      it('Page should render with data== title,message,clients,allLO,numUnassigned,currentClientId,privileges', function(done) {
        var res = {
          render: function(jade, data) {
            expect(data).to.only.have.keys('title', 'message', 'clients', 'allLO', 'numUnassigned', 'currentClientId', 'privileges')
            done();
          } // end of render
        } // end of res
        routes.loanOfficerIndex(req, res);
      }); // end of Page should render with data
      it('lenderId user exists: && officerId has privilages == 1, Render data.privaleges == 1', function(done) {
        var res = {
          render: function(jade, data) {
            expect(data.privileges).to.be(1)
            done()
          } //end of render
        } //end of response
        routes.loanOfficerIndex(req, res)
      }); //end of lenderId user exists: && officerId has privilages == true, Render data.privaleges == true 
    }); //end of describe params data VALID    

    describe('params data INVALID', function() {
      it('req.params.lenderId is number: should redirect "/" with code "400" ', function(done) {
        var req = {
          params: {
            lenderId: 5306000004
          },
          session: {
            numUnassigned: ''
          }
        } // end of req
        var res = {
          redirect: function(code, back) {
            expect(code).to.be(400);
            expect(back).to.be('/');
            done()
          } //end of render
        } // end of res
        routes.loanOfficerIndex(req, res);
      }) //end of req.params.lenderId is number: should redirect '/'  with code "400"
      it('req.params.lenderId has special characters: should redirect "/" with code "400" ', function(done) {
        var req = {
          params: {
            lenderId: '%+\'5306000004'
          },
          session: {
            numUnassigned: ''
          }
        } // end of req
        var res = {
          redirect: function(code, back) {
            expect(code).to.be(400);
            expect(back).to.be('/');
            done()
          } //end of render
        } // end of res
        routes.loanOfficerIndex(req, res);
      }) //end of req.params.lenderId has special characters: should redirect '/'  with code "400"
    }); //end of params data INVALID
  }); // end of describe loanOfficerIndex



  /** ****************************************************************************
   * loanOfficer index DB functions
   * ****************************************************************************/



  /*
   * newlyCreatedClients
   */
  describe('loanOfficerIndex: DB: newlyCreatedClients ', function() {
    it('should return without error', function(done) {
      dbFunctions.newlyCreatedClients(function(err, results) {
        expect(err).to.be(null)
        expect(results).not.to.have.length(0);
        done()
      })
    })
  }); //end of DB: newlyCreatedClients



  /*
   * GrabAllLO
   */
  describe('loanOfficerIndex: DB: GrabAllLO', function() {
    it('should return err == null', function(done) {
      dbFunctions.GrabAllLO(function(err, results) {
        expect(err).to.be(null);
        expect(results).not.to.have.length(0);
        done()
      }) //end of dbfunctions
    }) //end of it should return err == null
    it('should return results object', function(done) {
      dbFunctions.GrabAllLO(function(err, results) {
        expect(err).to.be(null);
        expect(results).to.be.an('object');
        expect(results).not.to.have.length(0);
        done()
      }) //end of dbfunctions
    }) //end of shoul return results object
    it.skip('should return results with only keys _id, firstName, lastName, middleName', function(done) {
      dbFunctions.GrabAllLO(function(err, results) {
        expect(err).to.be(null);
        expect(results[0]).to.have.property('_id', 'firstName', 'lastName');
        done()
      }) //end of dbfunctions
    }) // end of it should return results with only keys _id, firstName, lastName, middleName
  }); //end of DB: GrabAllLO



  /*
   * getLOClients
   */
  describe('loanOfficerIndex: DB:  getLOClients', function() {
    it.skip('loanOfficer Index exists, should have results', function(done) {
      dbFunctions.getLOClients('50471393a592d83c06000004', function(err, results) {
        expect(err).to.be(null);
        expect(results).to.be.an('object');
        expect(results.clients).to.not.be.empty();
        done();

      }) //end of dbfunctions
    })

    it('loanOfficer Index is wrong, should return error', function(done) {
      dbFunctions.getLOClients('', function(err, results) {
        expect(err).to.not.be.empty()
        expect(results).to.be(null)
        done()
      }) //end of dbfunctions
    })
  }); //end of DB: getLOClients



}); //end of loanOfficerIndex