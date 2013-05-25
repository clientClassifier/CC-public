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
 * loanOfficer index request
 * ****************************************************************************/  
    

  describe('loanOfficerClient requests', function(){
          var Cookies;
          before( function(done){
            loginUser.xavier(request, function(cookie){
              // console.log(cookie)
              Cookies = cookie;
              done();
            })
          });//end of before


      it('valid lenderID && valid client Id -> should render page 200', function(done) {
        var req = request.get('/loanOfficer/50471393a592d83c06000004/client/504713c3a592d83c06000006');
        req.cookies = Cookies;
        req.set('Accept','application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.be(200)
            done();
          });
      });//end of it

      it('valid lenderID && INVALID client Id -> should redirect with 302', function(done) {
        var req = request.get('/loanOfficer/50471393a592d83c06000004/client/5b4713c3a592d89c06000006');
        req.cookies = Cookies;
        req.set('Accept','application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.be(302)
            done();
          });
      });//end of it

      it('INVALID lenderID && valid clientId -> page should return 401', function(done) {
        var req = request.get('/loanOfficer/50471393a592d83c09000004/client/5b4713c3a592d89c06000006');
        req.cookies = Cookies;
        req.set('Accept','application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.be(401)
            done();
          });
      });//end of it


      it('INVALID lenderID && INVALID clientId -> page should return 401', function (done) {
        var req = request.get('/loanOfficer/50471393a592d83c09000004/client/5b4713c3a592d89c0d000006');
        req.cookies = Cookies;
        req.set('Accept','application/json')
          .end(function(err, res) {
            expect(res.statusCode).to.be(401)
            done();
          });
      });//end of it
  });//end of describe loan officer client



 /** ****************************************************************************
 * loanOfficer index router
 * ****************************************************************************/  



  describe('loanOfficerClient router',function(){
    describe('params data INVALID:',function(){
      it('req.params.lenderId is number: should redirect "/" with code "302" ',function(done){
        var req ={
          params:{lenderId:5306000004,
              clientId:'504bfa53bb86b59403000002'},
          session:{privileges:5}
        }// end of req
        var res={
          redirect:function(code,back){
            expect(code).to.be(302);
            expect(back).to.be('/');
            done()
          }//end of render
        }// end of res
        routes.loanOfficerClient(req,res);
      })//end of req.params.lenderId is number: should redirect '/'  with code "302"
      it('req.params.lenderId has special characters: should redirect "/" with code "302" ',function(done){
        var req ={
          params:{lenderId:'%+\'5306000004',
              clientId:'504bfa53bb86b59403000002'},
          session:{privileges:5}
        }// end of req
        var res={
          redirect:function(code,back){
            expect(code).to.be(302);
            expect(back).to.be('/');
            done()
          }//end of render
        }// end of res
        routes.loanOfficerClient(req,res);
      })//end of req.params.lenderId has special characters: should redirect '/'  with code "302"
      it('req.params.clientId is number: should redirect "/" with code "302" ',function(done){
        var req ={
          params:{lenderId:'50471393a592d83c06000004',
              clientId:00002},
          session:{privileges:5}
        }// end of req
        var res={
          redirect:function(code,back){
            expect(code).to.be(302);
            expect(back).to.be('/');
            done()
          }//end of render
        }// end of res
        routes.loanOfficerClient(req,res);
      })//end of req.params.clientId is number: should redirect '/'  with code "302"
      it('req.params.clientId has special characters: should redirect "/" with code "302" ',function(done){
        var req ={
          params:{lenderId:'50471393a592d83c06000004',
              clientId:'504b\'fa53b#b86b59403000002'},
          session:{privileges:5}
        }// end of req
        var res={
          redirect:function(code,back){
            expect(code).to.be(302);
            expect(back).to.be('/');
            done()
          }//end of render
        }// end of res
        routes.loanOfficerClient(req,res);
      })//end of req.params.clientId has special characters: should redirect '/'  with code "302"  
    });//end of describe params data INVALID      
    describe('params data VALID :',function(){
      var req ={
        params:{lenderId:'50471393a592d83c06000004',
                clientId:'504bfa53bb86b59403000002'},
        session:{privileges:5}
      }// end of req
      it('Page should render with status 200',function(done){
        var res={
          render:function(jade,data){
            expect(jade).to.be('loanOfficer/loanOfficerClient.jade')
            done();
          }//end of render
        }//end of res
        routes.loanOfficerClient(req,res);
      });// end of it status 200
      it('Page should render with data== title,clients,calcData,currentClientId,currentClient,privileges',function(done){
        var res={
          render:function(jade,data){
            expect(data).to.only.have.keys('title','clients','calcData','currentClientId','currentClient','privileges');
            done();
          }//end of render
        }// end of res
        routes.loanOfficerClient(req,res);  
      });//end of it: render with data
      it('lenderId && but client does not exist for this loanOfficer: should redirect "/" with code 400',function(done){
        var req ={
          params:{lenderId:'50471393a592d83c06000004',
          clientId:'504e74f6c4ab2d2506000002'},
          session:{privileges:5}
        }// end of request
        var res={
          redirect:function(code,back){
            //expect(code).to.be(400)
            //expect(back).to.be('/')
            done()
          }//end of redirect
        }//end of response
        routes.loanOfficerClient(req,res);
      });//end of lenderId && but client does not exist for this loanOfficer: should redirect '/' with code 400
    });//end of describe params data VALID  
  });// end of describe loanOfficerClient




 /** ****************************************************************************
 * loanOfficer index DB
 * ****************************************************************************/  



/*
 * getLoanOfficerClient
 */
  describe('loanOfficerClient: DB: getLoanOfficerClient',function(){
    describe('Correct lenderId && clientId',function(){
      it('should return err == null and return results',function(done){
        dbFunctions.getLoanOfficerClient({lenderId:'50471393a592d83c06000004',clientId:'504713c3a592d83c06000006'},function(err,results){
          expect(err).to.be(null);
          expect(results).to.be.ok()
          expect(results).to.be.an('object');
        
          done()
        })//end of dbfunctions
      })//end of it should return err == null and return results
    })//end of Correct lenderId && clientId
    
    it('Incorrect lenderId: should return err',function(done){
      dbFunctions.getLoanOfficerClient({lenderId:'aaaaaaaa',clientId:'504713c3a592d83c06000006' },function(err,results){
        expect(err).to.not.be.empty()
        expect(results).to.be(null)
        done()
      })//end of dbfunctions
    })//end of it Incorrect lenderId: should return err

    it('Incorrect clientId: should return err',function(done){
      dbFunctions.getLoanOfficerClient({lenderId:'50471393a592d83c06000004',clientId:'xxxxxxxxxxxxx' },function(err,results){
        expect(err).to.not.be.empty()
        expect(results).to.be(null)
        done()
      })//end of dbfunctions
    })//end of it Incorrect clientId: should return err
  });//end of DB: loanOfficerClient









  // describe('loanOfficer sendAlert')










})//end of loanOfficerClient test file