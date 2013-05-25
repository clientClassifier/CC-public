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



describe('postlogin.test.js file:', function() {
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
   * postlogin  request
   * ****************************************************************************/
	describe('Form login good inputs', function(){
	    it('LO: email and pass correct', function(done){
	      request
	        .post('/login')
	        .send({
	            "email" : 'x@email.com',
	            "password" : 'xxxxxxxxx' 
	        })
	        .end(function(err, res){
	          if (err) return done(err);
	          expect(res.status).to.be.equal(302)
	          done()
	        });
	    });//end of LO: email and pass correct
	    it('LO: email correct with bad password', function(done){
	      request
	        .post('/login')
	        .send({
	            "email" : 'x@email.com',
	            "password" : 'x' 
	        })
	        .end(function(err, res){
	          if (err) return done(err);
	          expect(res.status).to.be.equal(401)
	          done()
	        });
	    });//end of LO: email correct with bad password
	    it('Agent: email and pass correct', function(done){
	      request
	        .post('/login')
	        .send({
	            "email" : 'testing@email.com',
	            "password" : 'ttttttttt' 
	        })
	        .end(function(err, res){
	          if (err) return done(err);
	          expect(res.status).to.be.equal(302)
	          done()
	        });
	    });//end of Agent: email and pass correct
	    it('Agent: email correct with bad password', function(done){
	      request
	        .post('/login')
	        .send({
	            "email" : 'testing@email.com',
	            "password" : 't' 
	        })
	        .end(function(err, res){
	          if (err) return done(err);
	          expect(res.status).to.be.equal(401)
	          done()
	        });
	    });//end of Agent: email correct with bad password
	})//end of Describe form login good inputs

	describe('Form validation login bad inputs', function(){
	    it('email is empty', function(done){
	      request
	        .post('/login')
	        .send({
	            "email" : '',
	            "password" : '2324324' 
	        })
	        .end(function(err, res){
	          if (err) return done(err);
	          expect(res.status).to.be.equal(422)
	          done()
	        });
	    });//end of email is empty
	    it('email is malformed', function(done){
	      request
	        .post('/login')
	        .send({
	            "email" : 'someemaillogin.com',
	            "password" : '2324324' 
	        })
	        .end(function(err, res){
	          if (err) return done(err);
	          expect(res.status).to.be.equal(422);
	          done()
	        });
	    });//end of email is malformed
	    it('password is empty', function(done){
	      request
	        .post('/login')
	        .send({
	            "email" : 'someemail@login.com',
	            "password" : '' 
	        })
	        .end(function(err, res){
	          if (err) return done(err);
	          expect(res.status).to.be.equal(422);
	          done()
	        });
	    });//password is empty
	});//end of Describe form validation login bad inputs


  /** ****************************************************************************
   * postlogin  router tests
   * ****************************************************************************/

              

  /** ****************************************************************************
   *  postlogin  DB functions
   * ****************************************************************************/







  /** ****************************************************************************
   *  postlogin  socket functions
   * ****************************************************************************/












}); //end of postlogin 