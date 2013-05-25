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



describe('loanOfficerRegisterPost.test.js file:', function() {
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
   * loanOfficerRegisterPost request
   * ****************************************************************************/
	describe('loanOfficerRegisterPost: request', function(){
		describe('POST data INVALID',function(){
			it('If firstName is empty: redirect 400 & errorsRegister is not null',function(done){
				request.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong')
				.send({
					firstName: '',
					lastName: 'Rosales',
					email: 'mario@email.com',
					confirmEmail: 'mario22@email.com',
					password: 'mmmmm' ,
					cellPhone: '(323) 323-2345',
					NMLSID:'833343',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If firstName is empty: redirect 400 & errorsRegister is not null
			
			it('FIf firstName has special characters: redirect 400 & errorsRegister is not null',function(done){		
				request.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong')
				.send({
					firstName: '+++++###',
					lastName: 'Rosales',
					email: 'mario@email.com',
					confirmEmail: 'mario22@email.com',
					password: 'mmmmm' ,
					cellPhone: '(323) 323-2345',
					NMLSID:'833343',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If firstName has special characters: redirect 400 & errorsRegister is not null

			it('If lastName is empty: redirect 400 & errorsRegister is not null',function(done){
				request.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong')
				.send({
					firstName: 'mario',
					lastName: '',
					email: 'mario@email.com',
					confirmEmail: 'mario22@email.com',
					password: 'mmmmm' ,
					cellPhone: '(323) 323-2345',
					NMLSID:'833343',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If lastName is empty: redirect 400 & errorsRegister is not null
			
			it('If lastName special characters: redirect 400 & errorsRegister is not null',function(done){
				request.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong')
				.send({
					firstName: 'mario',
					lastName: '2222',
					email: 'mario@email.com',
					confirmEmail: 'mario22@email.com',
					password: 'mmmmm' ,
					cellPhone: '(323) 323-2345',
					NMLSID:'833343',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If lastName special characters: redirect 400 & errorsRegister is not null
			
			it('If email is not email: redirect 400 & errorsRegister is not null',function(done){
				request.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong')
				.send({
					firstName: 'mario',
					lastName: 'Rosales',
					email: 'marioemail.com',
					confirmEmail: 'mario22@email.com',
					password: 'mmmmm' ,
					cellPhone: '(323) 323-2345',
					NMLSID:'833343',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If email is not email: redirect 400 & errorsRegister is not null
			
			it('If confirmEmail is not email: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong')
				.send({
					firstName: 'mario',
					lastName: 'Rosales',
					email: 'mario@email.com',
					confirmEmail: 'mario22email.com',
					password: 'mmmmm' ,
					cellPhone: '(323) 323-2345',
					NMLSID:'833343',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If confirmEmail is not email: redirect 400 & errorsRegister is not null
			
			it('If password is empty: redirect 400 & errorsRegister is not null',function(done){
				request.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong')
				.send({
					firstName: 'mario',
					lastName: 'Rosales',
					email: 'mario@email.com',
					confirmEmail: 'mario22@email.com',
					password: '',
					cellPhone: '(323) 323-2345',
					NMLSID:'833343',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If password is empty: redirect 400 & errorsRegister is not null

			it('If cellPhone is not formated: redirect 400 & errorsRegister is not null',function(done){
				request.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong')
				.send({
					firstName: 'mario',
					lastName: 'Rosales',
					email: 'mario@email.com',
					confirmEmail: 'mario22@email.com',
					password: 'kkkkkkkkk',
					cellPhone: '¿¿¿¿¿¿¿',
					NMLSID:'833343',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If cellPhone is not formated: redirect 400 & errorsRegister is not null
			
			it('If NMLSID is empty: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong')
				.send({
					firstName: 'Mario',
					lastName: 'Rosales',
					email: 'jhonsy_72'+randstring+'@hotmail.com',
					confirmEmail: 'jhonsy_72'+randstring+'@hotmail.com',
					password: 'mmmmm',
					cellPhone: '(323) 323-2345',
					NMLSID:'',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If NMLSID is empty: redirect 400 & errorsRegister is not null
			
			it('If NMLSID is not an int: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong')
				.send({
					firstName: 'Mario',
					lastName: 'Rosales',
					email: 'jhonsy_72'+randstring+'@hotmail.com',
					confirmEmail: 'jhonsy_72'+randstring+'@hotmail.com',
					password: 'mmmmm',
					cellPhone: '(323) 323-2345',
					NMLSID:'dddddd',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If NMLSID is not an int: redirect 400 & errorsRegister is not null
			
			it('If NMLSID is less than 6 numbers: redirect 400 & errorsRegister is not null',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong')
				.send({
					firstName: 'Mario',
					lastName: 'Rosales',
					email: 'jhonsy_72'+randstring+'@hotmail.com',
					confirmEmail: 'jhonsy_72'+randstring+'@hotmail.com',
					password: 'xxxxxxxxx',
					cellPhone: '(323) 323-2345',
					NMLSID:'55',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it If NMLSID is less than 6 numbers: redirect 400 & errorsRegister is not null
		})//end of POST da Invalid
		describe('POST data valid',function(){
			it('req.session.confirmEmail should be true,redirect 200,redirect to /email',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong')
				.send({
					firstName: 'Mario',
					lastName: 'Rosales',
					email: 'jhonsy_72'+randstring+'@hotmail.com',
					confirmEmail: 'jhonsy_72'+randstring+'@hotmail.com',
					password: 'mmmmm' ,
					cellPhone: '(323) 323-2345',
					NMLSID:'833343',
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(200);
					expect(res.header.location).to.be('/enter')
					done();
				})
			})//Correct data should pass with 200
		})//end of POST data valid
	});// en of loanOfficerRegisterPost: request




  /** ****************************************************************************
   * loanOfficerRegisterPost router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  loanOfficerRegisterPost DB functions
   * ****************************************************************************/

	describe('registerNewLoanOfficer: DB',function(){
		describe('If userdata is valid:',function(){
			it('should return err = null && confirmCode',function(done){
				var randstring = Math.random().toString(36).substring(7);
				dbFunctions.registerNewLoanOfficer({
					email: 'jhon'+ randstring +'@hotmail.com',
					password: 'sabkdbsk',
					firstName: 'jhon',
					middleName:'marcos',
					lastName: 'romero',
					userType:'loanOfficer',			
					cellPhone: '(323) 323-2345',
					NMLSID: '123445'
					},function(err,results){
					expect(err).to.be(null);
					expect(results).to.not.be.empty();				
					done()			
				})//end of dbfunction
			})//end of it should return null and confirmcode
		});//If userdata is valid
	}); //DB: registerNewLoanOfficer






  /** ****************************************************************************
   *  loanOfficerRegisterPost socket functions
   * ****************************************************************************/












}); //end of loanOfficerRegisterPost