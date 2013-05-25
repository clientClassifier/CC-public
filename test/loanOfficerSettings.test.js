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
 * loanOfficer Settings request
 * ****************************************************************************/  
    

  describe('loanOfficerSettings requests', function(){
          var Cookies;
          before( function(done){
            loginUser.xavier(request, function(cookie){
              // console.log(cookie)
              Cookies = cookie;
              done();
            })
          });//end of before

    it('valid lenderId -> page shold render 200', function(done) {
      var req = request.get('/loanOfficer/50471393a592d83c06000004/setting');
      req.cookies = Cookies;
      req.set('Accept','application/json')
        .end(function(err, res) {
          expect(res.statusCode).to.be(200)
          done();
        });
    });//end of it

    it('INVALID lenderId -> page shold redirect 401', function(done) {
      var req = request.get('/loanOfficer/50471393a592dR3c86000004/setting');
      req.cookies = Cookies;
      req.set('Accept','application/json')
        .end(function(err, res) {
          expect(res.statusCode).to.be(401)
          done();
        });
    });//end of it
     
  });//end of describe loan officer settings



 /** ****************************************************************************
 * loanOfficer Settings router
 * ****************************************************************************/  




  describe('loanOfficerSetting router',function(){
    describe('params INVALID',function(){
      var req={
        session:{inputErrors:''},
        params:{lenderId:7897979}
      }
      it('req.params.lenderId is number: should redirect "/" with code "400" ',function(done){
        var res={
          redirect:function(code,back){
            expect(code).to.be(400);
            expect(back).to.be('/');
            done()
          }//end of render
        }// end of res
        routes.loanOfficerSetting(req,res);
      })//end of req.params.lenderId is number: should redirect '/'  with code "400"
    })//end of params INVALID
    describe('params VALID',function(){
      var req={
        session:{inputErrors:''},
        params:{lenderId:'50471393a592d83c06000004'}
      }   
      it('Should Render "Blocks/settings.jade"',function(done){
        var res={
          render:function(jade,data){
            expect(jade).to.be('Blocks/settings.jade')
            done()
          }//end of render  
        }//end of res
        routes.loanOfficerSetting(req,res)
      })//end of Page Should render "Blocks/settings.jade"
      it("Render Should only receive :  'title', 'subscribedEvents'",function(done){
        var res={
          render:function(jade,data){
            expect(data).to.only.have.keys( 'title', 'subscribedEvents')
            done()
          }// end of render
        }//end res
        routes.loanOfficerSetting(req,res);
      })//end of  Should only receive  'title', 'subscribedEvents'
    })//end of params VALID
  })//end of describe loanOfficerSetting 




 /** ****************************************************************************
 * loanOfficer Settings DB
 * ****************************************************************************/  


  describe('loanOfficerSettings: DB: userSetting ', function(){
    describe('params VALID',function(){
      it('should return only subscribed Events',function(done){
        dbFunctions.userSetting('50471393a592d83c06000004','loanOfficer', function(err, results){
          expect(err).to.be(null);
          expect(results).to.not.be(null);
          expect(results.subscribedEvents).to.be.an('object')
          done();
        })//enf of function
      });//end of should return only subscribed Events
    })//end of params VALID 
    describe('params INVALID',function(){
      it('should fail if id is bad',function(done){
        dbFunctions.userSetting('50471393a592d83ckkkk06000004','loanOfficer', function(err, results){
          expect(err).to.not.be(null);
          expect(results).to.be(null);
          done();
        })//end of function
      });// end of Should fail if loanOfficer id is bad
    })//end of params INVALID
  })//end of Describe loanOfficerSetting



})//end of loanOfficerSettings test file