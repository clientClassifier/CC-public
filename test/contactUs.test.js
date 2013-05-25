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



describe('contactUs.test.js file:', function() {
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
   * contactUs request
   * ****************************************************************************/

describe('contactUs: request', function(){
		describe('POST data valid:',function(){
			it('Page should redirect with status 302',function(done){
				request.post('/contactUs')
					.send({
						subject: 'testing subject' ,
						email: 'email001@email.com',
						body: 'lets do this',
					})
					.end(function(err, res){
						expect(res.status).to.be.equal(302)
						done();
				})		
			})//end of it Page should redirect with status 302 
		})//end of POST data valid
		describe('POST data invalid',function(){
			it('if email is not email: Page should redirect 302 to /contactus', function(done){
				request.post('/contactUs')
					.send({
						subject: 'testing subject' ,
						email: 'email001email.com',
						body: 'lets do this',
					})
					.end(function(err, res){
						expect(res.status).to.be.equal(302)
						done();
					})
			})//end of it if email is not email: Page should redirect 302 to /contactus

			it('if email is empty: Page should redirect 302 to -> /contactus', function(done){
				request.post('/contactUs')
					.send({
						subject: 'testing subject' ,
						email: '',
						body: 'lets do this',
					})
					.end(function(err, res){
						expect(res.status).to.be.equal(302)
						done();
					})
			})//end of it if email is empty: Page should redirect 302 to -> /
			
			it('if body is empty: Page should redirect 302 to /contactus', function(done){
				request.post('/contactUs')
					.send({
						subject: 'testing subject' ,
						email: 'email001@email.com',
						body: '',
					})
					.end(function(err, res){
						expect(res.status).to.be.equal(302)
						done();
					})
			})//end of it if body is empty: Page should redirect 302 to '/contactus'

			it('if body has special characters: Page should redirect 302 to /contactus', function(done){
				request.post('/contactUs')
					.send({
						subject: 'testing subject' ,
						email: 'email001@email.com',
						body: '########',
					})
					.end(function(err, res){
						expect(res.status).to.be.equal(302)
						done();
					})
			})//end of it if body has special characters: Page should redirect 302 to /contactus

			it('if subject is empty: Page should redirect 302 to /contactus', function(done){
				request.post('/contactUs')
					.send({
						subject: '' ,
						email: 'email001@email.com',
						body: 'lets do this',
					})
					.end(function(err, res){
						expect(res.status).to.be.equal(302)
						done();
					})
			})//end of it if subject is empty: Page should redirect 302 to /contactus

			it('if subject has special characters: Page should redirect 302 to /contactus', function(done){
				request.post('/contactUs')
					.send({
						subject: '##################' ,
						email: 'email001@email.com',
						body: 'lets do this',
					})
					.end(function(err, res){
						expect(res.status).to.be.equal(302)
						done();
					})
			})//end of it if subject has special characters: Page should redirect 302 to '/contactus'
		})//end of POST data invalid		
	});// end of /contactUs  --> contactUsPost



  /** ****************************************************************************
   * contactUs router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  contactUs DB functions
   * ****************************************************************************/








  /** ****************************************************************************
   *  contactUs socket functions
   * ****************************************************************************/












}); //end of contactUs