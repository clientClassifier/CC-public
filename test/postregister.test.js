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



describe.skip('postregister.test.js file:', function() {
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
   * postregister request
   * ****************************************************************************/
   describe('postRegister: request', function(){
		describe('POST data valid:',function(){
			it('If POST data is formatted correcty: redirect with 302',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/register')
				.send({
					firstName: 'Roberto',
					lastName: 'romero',
					email: 'roberto'+ randstring +'@email.com',
					confirmEmail: 'roberto'+ randstring +'@email.com',
					password: 'jjjjjjjjj',
					cellPhone: '(323) 323-2345',
					companyName:  'burgers',
					companyPhone: '(323) 323-2323',
					TOS: 'on',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(302);
					expect(res.header.location).to.be('/enter')
					done();
				})
			})//end of it If POST data is formatted correclty: redirect with 302
		})//end of POST data valid
		
		describe('POST data INVALID',function(){
			it('If firstName has numbers or special characters: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/register')
				.send({
					firstName: 'jhon989898',
					lastName: 'romero',
					email: 'jhon6'+ randstring +'@email.com',
					confirmEmail: 'jhon6'+ randstring +'@email.com',
					password: 'jjjjjjjjj' ,
					cellPhone: '(323) 323-2345',
					companyName:  'burgers',
					companyPhone: '(323) 323-2323',
					TOS: 'on',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of If firstName has numbers or special characters: redirect 400 & errorsRegister is not null

			it('If lastName has numbers or special characters: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/register')
				.send({
					firstName: 'jhon',
					lastName: '3romero',
					email: 'jhon'+ randstring +'@email.com',
					confirmEmail: 'jhon'+ randstring +'@email.com',
					password: 'jjjjjjjjj' ,
					cellPhone: '(323) 323-2345',
					companyName:  'burgers',
					companyPhone: '(323) 323-2323',
					TOS: 'on',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If lastName has numbers or special characters: redirect 400 & errorsRegister is not null

			it('If email is not email: redirect 400 & errorsRegister is not null',function(done){
				request.post('/register')
				.send({
					firstName: 'jhon',
					lastName: 'romero',
					email: 'jhon6email.com',
					confirmEmail: 'jhoanmoces6@mail.com',
					password: 'jjjjjjjjj' ,
					cellPhone: '(323) 323-2345',
					companyName:  'burgers',
					companyPhone: '(323) 323-2323',
					TOS: 'on',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of If email is not email: redirect 400 & errorsRegister is not null

			it('If confirmEmail is not email: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/register')
				.send({
					firstName: 'jhon',
					lastName: 'romero',
					email: 'jhon6'+ randstring +'@email.com',
					confirmEmail: 'jhon6email.com',
					password: 'jjjjjjjjj' ,
					cellPhone: '(323) 323-2345',
					companyName:  'burgers',
					companyPhone: '(323) 323-2323',
					TOS: 'on',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If confirmEmail is not email: redirect 400 & errorsRegister is not null
		
			it('If password is empty: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/register')
				.send({
					firstName: 'jhon',
					lastName: 'romero',
					email: 'jhon6'+ randstring +'@email.com',
					confirmEmail: 'jhon6'+ randstring +'@email.com',
					password: '',
					cellPhone: '(323) 323-2345',
					companyName:  'burgers',
					companyPhone: '(323) 323-2323',
					TOS: 'on',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of If password is empty: redirect 400 & errorsRegister is not null

			it('If cellPhone is not formated correctly: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/register')
				.send({
					firstName: 'jhon',
					lastName: 'romero',
					email: 'jhon6'+ randstring +'@email.com',
					confirmEmail: 'jhon6'+ randstring +'@email.com',
					password: 'aaaaaaaaa',
					cellPhone: '++++++}+',
					companyName:  'burgers',
					companyPhone: '(323) 323-2323',
					TOS: 'on',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If cellPhone is not formated correctly: redirect 400 & errorsRegister is not null

			it('If companyName is not empty: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/register')
				.send({
					firstName: 'jhon',
					lastName: 'romero',
					email: 'jhon6'+ randstring +'@email.com',
					confirmEmail: 'jhon6'+ randstring +'@email.com',
					password: 'jjjjjjjjjj',
					cellPhone: '(323) 323-2329',
					companyName: '',
					companyPhone: '(323) 323-2323',
					TOS: 'on',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If companyName is not empty: redirect 400 & errorsRegister is not null

			it('If companyName has nums or special characters: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/register')
				.send({
					firstName: 'jhon',
					lastName: 'romero',
					email: 'jhon6'+ randstring +'@email.com',
					confirmEmail: 'jhon6'+ randstring +'@email.com',
					password: 'jjjjjjjjjj',
					cellPhone: '(323) 323-2329',
					companyName: '++++++++++',
					companyPhone: '(323) 323-2323',
					TOS: 'on',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If companyName has nums or special characters: redirect 400 & errorsRegister is not null

			it('If companyPhone is empty: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/register')
				.send({
					firstName: 'jhon',
					lastName: 'romero',
					email: 'jhon'+ randstring +'@email.com',
					confirmEmail: 'jhon'+ randstring +'@email.com',
					password: 'asas',
					cellPhone: '(323) 323-2329',
					companyName: 'burgers',
					companyPhone: '',
					TOS: 'on',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If companyPhone is empty: redirect 400 & errorsRegister is not null
		
			it('If companyPhone has numbers or special characters: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/register')
				.send({
					firstName: 'jhon',
					lastName: 'romero',
					email: 'jhon'+ randstring +'@email.com',
					confirmEmail: 'jhon'+ randstring +'@email.com',
					password: 'aaaaaaaaaa',
					cellPhone: '(323) 323-2329',
					companyName: 'burgers',
					companyPhone: '+++###',
					TOS: 'on',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If companyPhone has numbers or special characters: redirect 400 & errorsRegister is not null

			it('If TOS is not on: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/register')
				.send({
					firstName: 'jhon',
					lastName: 'romero',
					email: 'jhon6'+ randstring +'@email.com',
					confirmEmail: 'jhon6'+ randstring +'@email.com',
					password: 'ssssssss',
					cellPhone: '(323) 323-2329',
					companyName:  'burgers',
					companyPhone: '(323) 323-2326',
					TOS: 'off',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//TOS is empty, should return 400		
		})//end of POST data INVALID
			
			it('If user email exists in DB: should redirect with 400',function(done){
				request.post('/register')
				.send({
					firstName: 'jhon',
					lastName: 'romero',
					email: 'jhon6@email.com',
					confirmEmail: 'jhon6@email.com',
					password: 'jjjjjjjjj',
					cellPhone: '(323) 323-2345',
					companyName: 'burgers',
					companyPhone: '(323) 323-2323',
					TOS: 'on', 
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of If user email exists in DB: should redirect with 400					
	});// end of /register --> postRegister



  /** ****************************************************************************
   * postregister router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  postregister DB functions
   * ****************************************************************************/
   describe('postregister: DB: registerNewAgent', function(){
		describe('If userdata is valid:',function(){
			it('should return err = null && confirmCode',function(done){
				var randstring = Math.random().toString(36).substring(7);
				dbFunctions.registerNewAgent({firstName: 'jhon',
					middleName:'marcos',
					lastName: 'romero',
					TOS: 'on',
					userType:'realEstateAgent',
					email: 'jhons'+ randstring +'@hotmail.com',
					password: 'sabkdbsk',
					cellPhone: '(323) 323-2345',
					companyName:  'burgers',
					companyPhone: '(323) 323-2323'
					},function(err,results){
					expect(err).to.be(null);
					expect(results).to.not.be.empty();				
					done()
					
				});//end of dbfunction
			});//end of it should return null and confirmcode
		});//If userdata is valid
	});//end of DB: registerNewAgent







  /** ****************************************************************************
   *  postregister socket functions
   * ****************************************************************************/












}); //end of postregister