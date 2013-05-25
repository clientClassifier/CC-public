// var request = require('supertest');
// var expect = require('expect.js');
// var mongoose = require('mongoose');
// var io = require('socket.io-client');


// var loginUser = require('./loginUsers.js');
// var dbFunctions = require('../DBfunctions');
// var routes = require('../routes');


// request = request('https://localhost:2000');
// var socketURL = 'https://localhost:2000';
// var options = {
//   transports: ["xhr-polling"],
//   'polling duration': 10,
//   'log level': 1,
//   'force new connection': true
// };
// mongoose.connection.on('error', function() {
//   mongoose.connection.close();
// });



// describe('clientIndex.test.js file:', function() {
//   before(function(done) {
//     mongoose.connect('mongodb://localhost/ClientClass-RC1Test1');
//     done()
//   })

//   after(function(done) {
//     mongoose.connection.close(function(err) {
//       done();
//     });
//   }); // end after


//   /** ****************************************************************************
//    * clientIndex request
//    * ****************************************************************************/
//       describe.only('clientIndex: request',function(){ 

//         // var Cookies;
//         // before( function(done){
//         //   loginUser.aClient(request, function(cookie){
//         //     // console.log(cookie)
//         //     Cookies = cookie;
//         //     done();
//         //   })
//         // });//end of before

//           it.only('clientId is correct,  page should return 200', function(done){
//              var req = request.get('/client/517da4343a7b7a0000000004');
//               req.cookies = Cookies;
//               req.set('Accept','application/json')
//                 .end(function(err,res){
//                         expect(res.statusCode).to.be.equal(200)
//                         done();
//                 })                      
//           })//end of it clientId is correct, should have results
//           it('clientId is incorrect,  redirect with 401', function(done){
//               var req = request.get('/client/504713b9aa2d83c06000005');
//               req.cookies = Cookies;
//               req.set('Accept','application/json')
//                 .end(function(err,res){
//                         expect(res.statusCode).to.be.equal(401)
//                         done();
//                 })                      
//           })//end of it clientId is correct, should have results
          
//       }); // end of /consumerleads  --> consumerLeads



//   /** ****************************************************************************
//    * clientIndex router tests
//    * ****************************************************************************/

//       describe('clientIndex: router', function(){
//           describe('params data VALID',function(){
//               var req = {
//                       params: {
//                         clientId:'517da4343a7b7a0000000004'
//                       }
//               }// end of req
//                   it('Page should render with testviews/clientPage.jade', function(done){
//                           var res = {
//                                   render: function(jade, data){
//                                   expect(jade).to.be('testviews/clientPage.jade')
//                                   done();
//                                   }
//                           };//end of res
//                   routes.clientIndex(req, res)
//                   })// end it of Page Should render with testviews/clientPage.jade
      
//                   it('Page should render with data== title, user, happyness2', function(done){
//                   var res = {
//                     render: function(jade, data){
//                       expect(data).to.only.have.keys('title','user','happyness2')
//                       done();
//                     }// end of render
//                   };//end of res
//                       routes.clientIndex(req, res)
//                   })// end of it Page should render with data
//           })//end of describe params data VALID
//           describe('params data INVALID',function(){
//                     var req = {
//                               params: {
//                               clientId:2343434323323
//                               }                       
//                     }// end of req
//                   it("If req.params.clientId is a number: redirect 400, to -> '/'",function(done){
//                       var res={
//                         redirect:function(code,back){
//                           expect(code).to.be(400)
//                           expect(back).to.be('/')
//                           done()
//                         }//redirect
//                       }
//                       routes.clientIndex(req,res)
//                   })//end of If req.params.agentId is a number: redirect 400, to -> '/'
//           })//params data INVALID      
//       })// end of describe client Index



//   /** ****************************************************************************
//    *  clientIndex DB functions
//    * ****************************************************************************/
//       describe('clientIndex: DB:',function(){
//           it('if clientIndex is good, should  err == null',function(done){                        
//                   dbFunctions.clientIndex('517da4343a7b7a0000000004',function(err,results){
//                           expect(err).to.be(null);
//                           // expect(results[0]).to.only.have.keys('_id', 'clients')
//                           // expect(results).to.be.ok();                  
//                           expect(results).to.be.an('object');                             
//                           done()          
//                   })//end of dbFunctions          
//           })//end of it clientIndex is good, should  err == null
//           it('if clientIndex is bad, should return error',function(done){                 
//                   dbFunctions.clientIndex('304713b9a592d83c06000005',function(err,results){
//                           expect(err).to.not.be.empty();
//                           expect(results).to.be(null);
//                           done() 
//                   })//end of dbFunctions          
//           })//end of if clientIndex is bad, should return error
//       })//end of DB: clientIndex







//   /** ****************************************************************************
//    *  clientIndex socket functions
//    * ****************************************************************************/

//       describe('clientindex: Socket: updateHappyness',function(){

//           var client;
//           beforeEach(function(done){
//             client = io.connect(socketURL,options);
//             client.on('connect', function(data){
//               done()
//             })//end of ocnnect
//           })//end of before
//           it('Should update happyness',function(done){
//               var userdata={value: 30,comment:'Regular',clientId:'517da16cfae2a810ff00000f'}

//                   client.emit('updateHappyness', userdata)
//                   client.on('updateHappynessDEBUG',function(userdata){
//                           expect(userdata).not.to.be(null)
//                           client.disconnect()
//                           done()
//                   })
//           })//end of it 
//         })//end of describe updateHappyness










// }); //end of clientIndex