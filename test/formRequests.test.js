var request = require('supertest');
var routes = require('../routes');
var expect = require('expect.js');


request = request('https://localhost:2000');


describe('formRequests.js file', function(){

  // after(function(done){
  //     mongoose.connection.close();
  //     console.log('closed dbfunction connection')
  //     done();
  // });


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
    })
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
    })

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
    })

  });//end of first describe





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
    })

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
    })


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
    })

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
    })

  })

})

