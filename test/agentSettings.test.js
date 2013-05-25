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



describe('agentSettings.test.js file:', function() {
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
   * agentSettings  request
   * ****************************************************************************/

  describe('agentSettings request', function(){
        var Cookies;
        before( function(done){
          loginUser.anAgent(request, function(cookie){
            // console.log(cookie)
            Cookies = cookie;
            done();
          })
        });//end of before

        it('valid current agentId-> page should return 200', function(done) {
          var req = request.get('/agent/504aff792f21b4a808000002/setting');
          req.cookies = Cookies;
          req.set('Accept','application/json')
            .end(function(err, res) {
              expect(res.statusCode).to.be(200)
              done();
            });
        });//end of it

        it('valid agentId but not current agentID -> page should redirect 401', function(done) {
          var req = request.get('/agent/504aff792f21b4a808000009/setting');
          req.cookies = Cookies;
          req.set('Accept','application/json')
            .end(function(err, res) {
              expect(res.statusCode).to.be(401)
              done();
            });
        });//end of it

        it('INVALID agentId -> page should redirect 401', function(done) {
          var req = request.get('/agent/504aff792f21b4a808000002----/setting');
          req.cookies = Cookies;
          req.set('Accept','application/json')
            .end(function(err, res) {
              expect(res.statusCode).to.be(401)
              done();
            });
        });//end of it
  })//end of agent settings describe


  /** ****************************************************************************
   * agentSettings  router tests
   * ****************************************************************************/
  describe('agentSettings router',function(){
    describe('params VALID',function(){
      var req={
        session:{inputErrors:''},
        params:{agentId:'504aff792f21b4a808000002'}
      }
      it('Should Render "Blocks/settings.jade"',function(done){
        var res={
          render:function(jade,data){
            expect(jade).to.be('Blocks/settings.jade')
            done()
          }//end of render  
        }//end of res
        routes.agentSetting(req,res)
      })//end of Page Should render "Blocks/settings.jade"
      it("Render Should only receive :  'title', 'privileges','agentBroker', 'subscribedEvents', 'OfficeEmployees'",function(done){
        var res={
          render:function(jade,data){
            expect(data).to.only.have.keys( 'title','privileges','agentBroker', 'subscribedEvents','OfficeEmployees')
            done()
          }// end of render
        }//end res
        routes.agentSetting(req,res);
      })//end of  Should only receive:  'title', 'privileges','agentBroker', 'subscribedEvents', 'OfficeEmployees'
    })//end of params VALID
    describe('params INVALID',function(){
      var req={
        session:{inputErrors:''},
        params:{agentId:83094850}
      }
      it('req.params.agentId is  number: should redirect "/" with code "400" ',function(done){
        var res={
          redirect:function(code,back){
            expect(code).to.be(400);
            expect(back).to.be('/');
            done()
          }//end of render
        }// end of res
        routes.agentSetting(req,res);
      })//end of req.params.lenderId is number: should redirect '/'  with code "400"
    })//end of prams INVALID
  })//end of describe agentSettings 
              

  /** ****************************************************************************
   *  agentSettings  DB functions
   * ****************************************************************************/

  describe('agentSettings: DB: realEstateAgent', function(){
    
    describe('userSetting params VALID',function(){
      it('should return only subscribed Events',function(done){
        dbFunctions.userSetting('504aff792f21b4a808000002','RealEstateAgent', function(err, results){
          expect(err).to.be(null);
          expect(results).to.not.be(null);
          expect(results.subscribedEvents).to.be.an('object')
          done();
        })// end of function
      });//end of should return only subscribed Events
    })//end of params VALID 
    
    describe('getAgents: DB: params VALID',function(){
      it('Should return err null and result email :: email does not exist',function(done){
        data={email:'testingzzz@email.com',agentId:'50471352a592d83c06000002'}
        dbFunctions.getAgents(data,function(err,result){
          expect(err).to.be(null);
          expect(result).to.be(data.email);
          
          // console.log("---err:")
          // console.log(err)
          // console.log("---result:")
          // console.log(result)
          done()
        })//end of function getAgents
      })
    })//

    describe('newBrokerLeader: params INVALID',function(){
      it('Shoul return error null and result null ',function(done){
        data={
              userId:'50471352a592d83c06000002',
              groupName:'ssystem xd',
              companyName:'sxd Cia.',
              securityMessage:'xd xd xddd'
              }
        dbFunctions.newBrokerLeader(data,function(err,result){
          expect(err).to.be(null)
          expect(result).to.be(null)
          // console.log("err")
          // console.log(err)
          // console.log("result")
          // console.log(result)
          done()
        })//end of  dbFunctions newBrokerLeader
      })//end of it should return error null and result true
      
    })// end of describe newBrokerLeader: params VALID

    describe('userSetting params INVALID',function(){
      it('should fail if id is bad',function(done){
        dbFunctions.userSetting('504aff792sdsdsfsfsff21b4a808000002','RealEstateAgent', function(err, results){
          expect(err).to.not.be(null);
          expect(results).to.be(null);
          done();
        })// end of function
      });//should fail if id agent is bad
    })//end of params INVALID 
  })//end of Describe agentSetting


  /** ****************************************************************************
   *  agentSettings  socket functions
   * ****************************************************************************/

  describe('Socket: changePrivileges',function(){
    var client;
    beforeEach(function(done){
      client=io.connect(socketURL,options)
      client.on('connect',function(data){
        done()
      })//end of client.on('connect')
    })//end of function beforeEach
    describe('return Success',function(){
      it.skip('should return "Your input company name does not match. Please the correct name of the company"',function(done){
        var data={userId:'50471352a592d83c06000002',
                  groupName:'Cclie cia',
                  companyName:'Clie',
                  securityMessage:'cccc ccc ccc'}
        client.emit('changePrivileges',data)
        // client.on('changePrivileges',function(result){
        //   console.log(result)
        //   done()
        // })//end of changePrivileges Success

        client.on('errorChangePrivileges',function(err){
          expect(err).to.be('Your input company name does not match. Please the correct name of the company')
        
          // console.log(err)
          done()
        })//end of errorChangePrivileges
      })//end of it return company name incorrect
      
      it('should return error DB',function(done){
        var data={userId:'50471352a592d83c06000002',
                  groupName:'Cclie cia',
                  companyName:'realtors',
                  securityMessage:'cccc ccc ccc'}
        client.emit('changePrivileges',data)
    
        client.on('errorChangePrivileges',function(err){
          expect(err).to.be('Could not complete the operation try again later.')
          // console.log(err)
          done()
        })//end of errorChangePrivileges
      })//end of it
    
    })// end of describe: return success


  })// end of funtion Socket: changePrivileges

  describe('agentSettings: SOCKET', function(){
    var allDocs= [{ userType: 'realEstateAgent',
                  userId:   '504aff792f21b4a808000002',
                  eventType: 'email',
                  checkbox:  'taxes',
                  state: true
                  },
                  { userType: 'realEstateAgent',
                    userId:   '504aff792f21b4a808000002',
                    eventType: 'email',
                    checkbox:  'W2',
                    state: true
                  },
                  { userType: 'realEstateAgent',
                    userId:   '504aff792f21b4a808000002',
                    eventType: 'email',
                    checkbox:  'payStub',
                    state: true
                  }]
    var client;
    beforeEach(function(done){
      client = io.connect(socketURL,options);
      client.on('connect', function(data){
        done()
      })//end of connect
    })//end of before

    allDocs.forEach(function(doc) {
        it('should update the agents settings: ' + doc.checkbox , function(done){
            client.emit('changeUserSettings', doc);//end of client emit
            client.on('changeUserSettingSuccess',function(){
              client.disconnect()
              done();
            })//end of on
        });//end of it
    });//end of forEach allDoc test
  });//end of agent settings socket



}); //end of agentSettings 