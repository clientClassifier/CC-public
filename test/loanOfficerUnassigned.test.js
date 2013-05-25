var request = require('supertest');
var expect = require('expect.js');
var mongoose = require('mongoose');
var io = require('socket.io-client');


var loginUser = require('./loginUsers.js');
var dbFunctions = require('../DBfunctions');
var routes = require('../routes');


request = request('https://localhost:2000');
var socketURL = 'https://localhost:2000';
var options ={
  transports: ["xhr-polling"],
  'polling duration':10,
  'log level': 1,
  'force new connection': true
};
mongoose.connection.on('error', function() {
    mongoose.connection.close();
});



describe('agentClient.test.js file:', function(){
  before(function(done){
    mongoose.connect('mongodb://localhost/ClientClass-RC1Test1');
    done()
  })

  after(function(done){
      mongoose.connection.close(function(err){
        done();
      });
  });// end after



 /** ****************************************************************************
 * loanOfficer unassigned request
 * ****************************************************************************/  
    

    describe('loanOfficerUnassigned: requests', function(){

      var Cookies;
      before( function(done){
        loginUser.xavier(request, function(cookie){
          // console.log(cookie)
          Cookies = cookie;
          done();
        })
      });//end of before

      it('Authorized should be 200', function(done){
      var req = request.get('/loanOfficer/50471393a592d83c06000004/unassigned');
        req.cookies = Cookies;
        req.set('Accept','application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.be(200)
            done();
          });   
      });//end of it


      it('lender(xavier) has privileges', function(done){
      var req = request.get('/loanOfficer/50471393a592d83c06000004/unassigned');
        req.cookies = Cookies;
        req.set('Accept','application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.be(200)
            done();
          });   
      });//end of it


      it('Authorized, but lenderId changed', function(done){
      var req = request.get('/loanOfficer/50471393a592d83c0600---0004/unassigned');
        req.cookies = Cookies;
        req.set('Accept','application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.be(401)
            done();
          });   
      });//end of it


      it('Unassigned page: passed auth, but changed params', function(done){
          var req = request.get('/loanOfficer/50471393a592d83c06000004/unassigned');
          req.cookies = Cookies;
          req.params =  {
              lenderId: '50471393a592d83c06000004---'  //this loan officer has privalegs == false (rasix)
            };
          req.session = {
              privileges : null,
              numUnassigned: ''
            }
        var res = {
            status: '',
            render: function(jade, data){
              // expect(to).to.be('/');
              expect(jade).to.be('404.jade')
              done();
            },
            set: function(code){
              this.code
            }
          };//end of res
          routes.unassigned(req, res)
      });//end of it
    });//end of lender unassisgned. 


 /** ****************************************************************************
 * loanOfficer unassigned router
 * ****************************************************************************/  

  describe('loanOfficerUnassigned: router' , function(){                     
      describe('params data valid: ', function(){

        it('lenderId: should render "loanofficer/loanOfficerIndex.jade"', function(done){
          var req = {
                params: {
              lenderId: '50471393a592d83c06000004'
            },
            session: {
              numUnassigned: ''
            }
          };//end of req
          var res = {
            render: function(jade, data){
              expect(jade).to.be('loanOfficer/loanOfficerUnassigned.jade')
              done();
            }
          };//end of res

          routes.unassigned(req, res)
        });//end of it

        it("Render with only:'title','message','unassigned','clients','allLO','numUnassigned','currentClientId','privileges'", function(done){
          var req = {
            params: {
              lenderId: '50471393a592d83c06000004'
            },
            session: {
              numUnassigned: ''
            }
          };//end of req
          var res = {
            render: function(jade, data){
              expect(data).to.only.have.keys('title', 'message', 'unassigned', 'clients', 'allLO', 'numUnassigned', 'currentClientId', 'privileges')
              done();
            }
          };//end of res

          routes.unassigned(req, res)
        });//end of it

        it("Render data.privaleges == true", function(done){
          var req = {
            params: {
              lenderId: '50471393a592d83c06000004'
            },
            session: {
              numUnassigned: ''
            }
          };//end of req
          var res = {
            render: function(jade, data){
              expect(data.privileges).to.be(1)
              done();
            }
          };//end of res

          routes.unassigned(req, res)
        });//end of it

        it("Render data.privaleges == false", function(done){
          var req = {
            params: {
              lenderId: '517d9fd0fae2a810ff00000e'  //this loan officer has privalegs == false (eric malfred)
            },
            session: {
              privileges : null,
              numUnassigned: ''
            }
          };//end of req
          var res = {
            render: function(jade, data){
              expect(data.privileges).to.be(0)
              done();
            }
          };//end of res

          routes.unassigned(req, res)
        });//end of it
      });//end of params valid describe

      describe('params data INVALID:', function(){

      it('req.params.lenderId is not ObjectId: should render 404.jade ', function(done){
          var req = {
            params: {
              lenderId: '50471393a592d83c06000004qqqqqqqqq'  //this loan officer has privalegs == false (rasix)
            },
            session: {
              privileges : null,
              numUnassigned: ''
            }
          };//end of req

          var res = {
            status: '',
            render: function(jade, data){
              // expect(to).to.be('/');
              expect(jade).to.be('404.jade')
              done();
            },
            set: function(code){
              this.code
            }
          };//end of res
          routes.unassigned(req, res)
      });//end of it


      it('req.params.lenderId is NOT objectId: title should be "404.jade"', function(done){
          var req = {
            params: {
              lenderId: '50471393a592d83c06000004qqqqqqqqq'  //this loan officer has privalegs == false (rasix)
            },
            session: {
              privileges : null,
              numUnassigned: ''
            }
          };//end of req

          var res = {
            status: '',
            render: function(jade, data){
              // expect(to).to.be('/');
              expect(jade).to.be('404.jade')
              done();
            },
            set: function(code){
              this.code
            }
          };//end of res
          routes.unassigned(req, res)
      });//end of it
     });//end of params INVALID
  });//end of unassaigned describe



 /** ****************************************************************************
 * loanOfficer unassigned DB
 * ****************************************************************************/  





})//end of loanOfficerSettings test file