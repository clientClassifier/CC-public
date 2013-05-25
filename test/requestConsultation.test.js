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



describe.skip('requestConsultation.test.js file:', function() {
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
   * requestConsultation request
   * ****************************************************************************/
	describe('requestconsultation: request',function(){		
		describe('POST data Invalid',function(){
			it('formGraphData has no length: redirect 400 & errorsRequestConsultation object',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/requestconsultation')
				.send({
					firstName:'Manuel',
					lastName:'Rodriguez',
					cellPhone: '(748) 907-1243',
					consumerEmail: 'Manuel' + randstring + '@mail.com',
					hasAgent: 'No', 
					wantsUs: 'Yes',
					formIncome: '1083.33', 
					formDebt:  '0',
					formInterest: '5',
					formGraphData:'',	
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of it formGraphData has no length: redirect 400 & errorsRequestConsultation object
			
			it('formGraphData is undefined: redirect 400 & errorsRequestConsultation object',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/requestconsultation')
				.send({
					firstName:'Manuel',
					lastName:'Rodriguez',
					cellPhone: '(748) 907-1243',
					consumerEmail: 'Manuel' + randstring + '@mail.com',
					hasAgent: 'No', 
					wantsUs: 'Yes',
					formIncome: '1083.33', 
					formDebt:  '0',
					formInterest: '5',
					formGraphData: '',	
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of It formGraphData is undefined: redirect 400 & errorsRequestConsultation object
		
			it.skip('formGraphData is Bad: req.session.errorsRequestConsultation will have length',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/requestconsultation')
				.send({
					firstName:'Manuel',
					lastName:'Rodriguez',
					cellPhone: '(748) 907-1243',
					consumerEmail: 'Manuel' + randstring + '@mail.com',
					hasAgent: 'No', 
					wantsUs: 'Yes',
					formIncome: '1083.33', 
					formDebt:  '0',
					formInterest: '5',
					formGraphData: '[yfgvbhjnk]',	
				})
				.end(function(req,res){
					console.log(res)
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of It formgraphdata is Bad: req.session.errorsRequestConsultation will have length
			
			it('formIncome is null: redirect 400 & errorsRequestConsultation object',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/requestconsultation')
				.send({
					firstName:'Manuel',
					lastName:'Rodriguez',
					cellPhone: '(748) 907-1243',
					consumerEmail: 'Manuel' + randstring + '@mail.com',
					hasAgent: 'No', 
					wantsUs: 'Yes',
					formIncome: null, 
					formDebt:  '0',
					formInterest: '5',
					formGraphData: '[{\"monthlyPayment\":336,\"housePrice\":45767,\"color\":\"#468847\",\"grade\":\"A+\"},{\"monthlyPayment\":390,\"housePrice\":53149,\"color\":\"#468847\",\"grade\":\"A\"},{\"monthlyPayment\":444,\"housePrice\":60531,\"color\":\"#c09853\",\"grade\":\"B\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":574,\"housePrice\":78247,\"color\":\"#000000\",\"grade\":\"D\"}]',	
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of It formIncome is null: redirect 400 & errorsRequestConsultation object
		

			it('formDebt is null: redirect 400 & errorsRequestConsultation object',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/requestconsultation')
				.send({
					firstName:'Manuel',
					lastName:'Rodriguez',
					cellPhone: '(748) 907-1243',
					consumerEmail: 'Manuel' + randstring + '@mail.com',
					hasAgent: 'No', 
					wantsUs: 'Yes',
					formIncome: '1083.33', 
					formDebt:  null,
					formInterest: '5',
					formGraphData: '[{\"monthlyPayment\":336,\"housePrice\":45767,\"color\":\"#468847\",\"grade\":\"A+\"},{\"monthlyPayment\":390,\"housePrice\":53149,\"color\":\"#468847\",\"grade\":\"A\"},{\"monthlyPayment\":444,\"housePrice\":60531,\"color\":\"#c09853\",\"grade\":\"B\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":574,\"housePrice\":78247,\"color\":\"#000000\",\"grade\":\"D\"}]',	
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of It formDebt is null: redirect 400 & errorsRequestConsultation object
			
			it('formInterest is null: redirect 400 & errorsRequestConsultation object',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/requestconsultation')
				.send({
					firstName:'Manuel',
					lastName:'Rodriguez',
					cellPhone: '(748) 907-1243',
					consumerEmail: 'Manuel' + randstring + '@mail.com',
					hasAgent: 'No', 
					wantsUs: 'Yes',
					formIncome: '1083.33', 
					formDebt:  '0',
					formInterest: null,
					formGraphData: '[{\"monthlyPayment\":336,\"housePrice\":45767,\"color\":\"#468847\",\"grade\":\"A+\"},{\"monthlyPayment\":390,\"housePrice\":53149,\"color\":\"#468847\",\"grade\":\"A\"},{\"monthlyPayment\":444,\"housePrice\":60531,\"color\":\"#c09853\",\"grade\":\"B\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":574,\"housePrice\":78247,\"color\":\"#000000\",\"grade\":\"D\"}]',	
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of It formInterest is null: redirect 400 & errorsRequestConsultation object
			
			it('hasAgent is null: redirect 400 & errorsRequestConsultation object',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/requestconsultation')
				.send({
					firstName:'Manuel',
					lastName:'Rodriguez',
					cellPhone: '(748) 907-1243',
					consumerEmail: 'Manuel' + randstring + '@mail.com',
					hasAgent: null, 
					wantsUs: 'Yes',
					formIncome: '1083.33', 
					formDebt:  '0',
					formInterest: '5',
					formGraphData: '[{\"monthlyPayment\":336,\"housePrice\":45767,\"color\":\"#468847\",\"grade\":\"A+\"},{\"monthlyPayment\":390,\"housePrice\":53149,\"color\":\"#468847\",\"grade\":\"A\"},{\"monthlyPayment\":444,\"housePrice\":60531,\"color\":\"#c09853\",\"grade\":\"B\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":574,\"housePrice\":78247,\"color\":\"#000000\",\"grade\":\"D\"}]',	
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of It hasAgent is null: redirect 400 & errorsRequestConsultation object
			
			it('wantsUs is null: redirect 400 & errorsRequestConsultation object',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/requestconsultation')
				.send({
					firstName:'Manuel',
					lastName:'Rodriguez',
					cellPhone: '(748) 907-1243',
					consumerEmail: 'Manuel' + randstring + '@mail.com',
					hasAgent: 'No', 
					wantsUs: null,
					formIncome: '1083.33', 
					formDebt:  '0',
					formInterest: '5',
					formGraphData: '[{\"monthlyPayment\":336,\"housePrice\":45767,\"color\":\"#468847\",\"grade\":\"A+\"},{\"monthlyPayment\":390,\"housePrice\":53149,\"color\":\"#468847\",\"grade\":\"A\"},{\"monthlyPayment\":444,\"housePrice\":60531,\"color\":\"#c09853\",\"grade\":\"B\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":574,\"housePrice\":78247,\"color\":\"#000000\",\"grade\":\"D\"}]',	
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of It wantsUs is null: redirect 400 & errorsRequestConsultation object
			
			it('firstName has numbers or special characters: redirect 400 & errorsRequestConsultation object',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/requestconsultation')
				.send({
					firstName:'73474843##',
					lastName:'Rodriguez',
					cellPhone: '(748) 907-1243',
					consumerEmail: 'Manuel' + randstring + '@mail.com',
					hasAgent: 'No', 
					wantsUs: 'Yes',
					formIncome: '1083.33', 
					formDebt:  '0',
					formInterest: '5',
					formGraphData: '[{\"monthlyPayment\":336,\"housePrice\":45767,\"color\":\"#468847\",\"grade\":\"A+\"},{\"monthlyPayment\":390,\"housePrice\":53149,\"color\":\"#468847\",\"grade\":\"A\"},{\"monthlyPayment\":444,\"housePrice\":60531,\"color\":\"#c09853\",\"grade\":\"B\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":574,\"housePrice\":78247,\"color\":\"#000000\",\"grade\":\"D\"}]',	
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of It firstName has numbers or special characters: redirect 400 & errorsRequestConsultation object
			
			it('lastName ahs numbers or special characters: redirect 400 & errorsRequestConsultation object',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/requestconsultation')
				.send({
					firstName:'Manuel',
					lastName:'#4455554',
					cellPhone: '(748) 907-1243',
					consumerEmail: 'Manuel' + randstring + '@mail.com',
					hasAgent: 'No', 
					wantsUs: 'Yes',
					formIncome: '1083.33', 
					formDebt:  '0',
					formInterest: '5',
					formGraphData: '[{\"monthlyPayment\":336,\"housePrice\":45767,\"color\":\"#468847\",\"grade\":\"A+\"},{\"monthlyPayment\":390,\"housePrice\":53149,\"color\":\"#468847\",\"grade\":\"A\"},{\"monthlyPayment\":444,\"housePrice\":60531,\"color\":\"#c09853\",\"grade\":\"B\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":574,\"housePrice\":78247,\"color\":\"#000000\",\"grade\":\"D\"}]',	
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of It lastName ahs numbers or special characters: redirect 400 & errorsRequestConsultation object
			
			it('cellPhone is not properly formated: redirect 400 & errorsRequestConsultation object',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/requestconsultation')
				.send({
					firstName:'Manuel',
					lastName:'Rodriguez',
					cellPhone: '++++###',
					consumerEmail: 'Manuel' + randstring + '@mail.com',
					hasAgent: 'No', 
					wantsUs: 'Yes',
					formIncome: '1083.33', 
					formDebt:  '0',
					formInterest: '5',
					formGraphData: '[{\"monthlyPayment\":336,\"housePrice\":45767,\"color\":\"#468847\",\"grade\":\"A+\"},{\"monthlyPayment\":390,\"housePrice\":53149,\"color\":\"#468847\",\"grade\":\"A\"},{\"monthlyPayment\":444,\"housePrice\":60531,\"color\":\"#c09853\",\"grade\":\"B\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":574,\"housePrice\":78247,\"color\":\"#000000\",\"grade\":\"D\"}]',	
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of It cellPhone is not properly formated: redirect 400 & errorsRequestConsultation object
			
			it('consumerEmail is not an email: redirect 400 & errorsRequestConsultation object',function(done){
				request.post('/requestconsultation')
				.send({
					firstName:'Manuel',
					lastName:'Rodriguez',
					cellPhone: '(748) 907-1243',
					consumerEmail: 'Manuelail.com',
					hasAgent: 'No', 
					wantsUs: 'Yes',
					formIncome: '1083.33', 
					formDebt:  '0',
					formInterest: '5',
					formGraphData: '[{\"monthlyPayment\":336,\"housePrice\":45767,\"color\":\"#468847\",\"grade\":\"A+\"},{\"monthlyPayment\":390,\"housePrice\":53149,\"color\":\"#468847\",\"grade\":\"A\"},{\"monthlyPayment\":444,\"housePrice\":60531,\"color\":\"#c09853\",\"grade\":\"B\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":574,\"housePrice\":78247,\"color\":\"#000000\",\"grade\":\"D\"}]',	
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(400);
					done();
				})
			})//end of It consumerEmail is not an email: redirect 400 & errorsRequestConsultation object
		})//end of POST data Invalid
		describe('POST data valid:',function(){
			it('Page should redirect with status 302, rediret to -> /experimentalAnalysis',function(done){
				var randstring = Math.random().toString(36).substring(7);
				request.post('/requestconsultation')
				.send({
					firstName:'Manuel',
					lastName:'Rodriguez',
					cellPhone: '(748) 907-1243',
					consumerEmail: 'Manuel' + randstring + '@mail.com',
					hasAgent: 'No', 
					wantsUs: 'Yes',
					formIncome: '1083.33', 
					formDebt:  '0',
					formInterest: '5',
					formGraphData: '[{\"monthlyPayment\":336,\"housePrice\":45767,\"color\":\"#468847\",\"grade\":\"A+\"},{\"monthlyPayment\":390,\"housePrice\":53149,\"color\":\"#468847\",\"grade\":\"A\"},{\"monthlyPayment\":444,\"housePrice\":60531,\"color\":\"#c09853\",\"grade\":\"B\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":574,\"housePrice\":78247,\"color\":\"#000000\",\"grade\":\"D\"}]',	
				})
				.end(function(req,res){
					expect(res.status).to.be.equal(302);
					expect(res.header.location).to.be('/experimentalAnalysis')
					done();
				})
			})//end of It Page should redirect with status 302, rediret to -> /experimentalAnalysis
		})//end of POST data valid
	})//end of /requestconsultation --> POST



  /** ****************************************************************************
   * requestConsultation router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  requestConsultation DB functions
   * ****************************************************************************/
	describe('DB: requestconsultation',function(){
		it('if properly formatted data, Should return err == null',function(done){
			var randstring = Math.random().toString(36).substring(7);
			dbFunctions.requestconsultation({
				firstName:'Manuel',
				lastName:'Rodriguez',
				cellPhone: '(748) 907-1243',
				consumerEmail: 'dfdddd' + randstring + '@mail.com',
				hasAgent: 'No', 
				wantsUs: 'Yes',
				formIncome: '1083.33', 
				formDebt:  '0',
				formInterest: '5',
				formGraphDataObj:'[{\"monthlyPayment\":336,\"housePrice\":45767,\"color\":\"#468847\",\"grade\":\"A+\"},{\"monthlyPayment\":390,\"housePrice\":53149,\"color\":\"#468847\",\"grade\":\"A\"},{\"monthlyPayment\":444,\"housePrice\":60531,\"color\":\"#c09853\",\"grade\":\"B\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":487,\"housePrice\":66436,\"color\":\"#b94a48\",\"grade\":\"C\"},{\"monthlyPayment\":574,\"housePrice\":78247,\"color\":\"#000000\",\"grade\":\"D\"}]',
			},function(err,results){
				expect(err).to.be(null);			
				expect(results).to.not.be.empty();	
				done()
			})//end of dbfunctions 
		})//end of it if properly formatted data, Should return err == null'			
	});// end of DB: requestconsultation







  /** ****************************************************************************
   *  requestConsultation socket functions
   * ****************************************************************************/












}); //end of requestConsultation