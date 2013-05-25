var request = require('supertest');
var expect = require('expect.js');
request = request('https://localhost:2000');

describe('joelRequests.js file', function(){
  // describe('/', function(){
  //   it('Page should render with status 200', function(done){
  //     request
  //       .get('/')
  //       .end(function(err, res){
  //         expect(res.status).to.be(200);
  //         done();
  //       })
  //   });// end of page should return 200
  // });//end of describe index

  // describe('/termsandconditions', function(){
  //   it('Page should render with status 200', function(done){
  //     request
  //       .get('/termsandconditions')
  //       .end(function(err, res){
  //         expect(res.status).to.be(200);
  //         // console.log(res.header)
  //         done();
  //       })
  //   });// end of page should return 200
  // });//end of describe termsandconditions

  // describe('/privacypolicy', function(){
  //   it('Page should render with status 200', function(done){
  //     request
  //       .get('/privacypolicy')
  //       .end(function(err, res){
  //         expect(res.status).to.be(200);
  //         done();
  //       })
  //   });// end of page should return 200
  // });// end of describe privacypolicy

  // describe('/ContactUs', function(){
  //   it('Page should render with status 200', function(done){
  //     request
  //       .get('/ContactUs')
  //       .end(function(err, res){
  //         expect(res.status).to.be(200);
  //         done();
  //       })
  //   });// end of page should return 200
  // });//end of describe ContactUs

  // describe('/faq', function(){
  //   it('Page should render with status 200', function(done){
  //     request
  //       .get('/faq')
  //       .end(function(err, res){
  //         expect(res.status).to.be(200);
  //         done();
  //       })
  //   });// end of page should return 200
  // });//end of describe faq

  // describe('/experimentalAnalysis', function(){
  //   it('Page should render with status 200', function(done){
  //     request
  //       .get('/experimentalAnalysis')
  //       .end(function(err, res){
  //         expect(res.status).to.be(200);
  //         done();
  //       })
  //   });// end of page should return 200
  // });//end of describe experimentalAnalysis

  // describe('/enter', function(){
  //   it('Page should render with status 200', function(done){
  //     request
  //       .get('/enter')
  //       .end(function(err, res){
  //         expect(res.status).to.be(200);
  //         done();
  //       })
  //   });// end of page should return 200
  // });//end of describe enter

  // describe('Form login good inputs', function(){
  //   it('LO: email and pass correct', function(done){
  //     request
  //       .post('/login')
  //       .send({
  //           "email" : 'x@email.com',
  //           "password" : 'xxxxxxxxx' 
  //       })
  //       .end(function(err, res){
  //         if (err) return done(err);
  //         expect(res.status).to.be.equal(302)
  //         done()
  //       });
  //   });//end of LO: email and pass correct
  //   it('LO: email correct with bad password', function(done){
  //     request
  //       .post('/login')
  //       .send({
  //           "email" : 'x@email.com',
  //           "password" : 'x' 
  //       })
  //       .end(function(err, res){
  //         if (err) return done(err);
  //         expect(res.status).to.be.equal(401)
  //         done()
  //       });
  //   });//end of LO: email correct with bad password
  //   it('Agent: email and pass correct', function(done){
  //     request
  //       .post('/login')
  //       .send({
  //           "email" : 'testing@email.com',
  //           "password" : 'ttttttttt' 
  //       })
  //       .end(function(err, res){
  //         if (err) return done(err);
  //         expect(res.status).to.be.equal(302)
  //         done()
  //       });
  //   });//end of Agent: email and pass correct
  //   it('Agent: email correct with bad password', function(done){
  //     request
  //       .post('/login')
  //       .send({
  //           "email" : 'testing@email.com',
  //           "password" : 't' 
  //       })
  //       .end(function(err, res){
  //         if (err) return done(err);
  //         expect(res.status).to.be.equal(401)
  //         done()
  //       });
  //   });//end of Agent: email correct with bad password
  // })//end of Describe form login good inputs

  // describe('Form validation login bad inputs', function(){
  //   it('email is empty', function(done){
  //     request
  //       .post('/login')
  //       .send({
  //           "email" : '',
  //           "password" : '2324324' 
  //       })
  //       .end(function(err, res){
  //         if (err) return done(err);
  //         expect(res.status).to.be.equal(422)
  //         done()
  //       });
  //   });//end of email is empty
  //   it('email is malformed', function(done){
  //     request
  //       .post('/login')
  //       .send({
  //           "email" : 'someemaillogin.com',
  //           "password" : '2324324' 
  //       })
  //       .end(function(err, res){
  //         if (err) return done(err);
  //         expect(res.status).to.be.equal(422);
  //         done()
  //       });
  //   });//end of email is malformed
  //   it('password is empty', function(done){
  //     request
  //       .post('/login')
  //       .send({
  //           "email" : 'someemail@login.com',
  //           "password" : '' 
  //       })
  //       .end(function(err, res){
  //         if (err) return done(err);
  //         expect(res.status).to.be.equal(422);
  //         done()
  //       });
  //   });//password is empty
  // });//end of Describe form validation login bad inputs

  // describe('/getforgotpassword', function(){
  //   it('Page should render with status 200', function(done){
  //     request
  //       .get('/forgotpassword')
  //       .end(function(err, res){
  //         expect(res.status).to.be(200);
  //         done();
  //       })
  //   });// end of page should return 200
  // });// end of describe getforgotpassword

  

 });

