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



describe('computedNumbers.test.js file:', function() {
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
   * computedNumbers request
   * ****************************************************************************/




  /** ****************************************************************************
   * computedNumbers router tests
   * ****************************************************************************/





  /** ****************************************************************************
   *  computedNumbers DB functions
   * ****************************************************************************/
	describe('computedNumbers: DB: updateClientCalculatorIncNeed',function(){		
			describe('if valid userdata',function(){
				describe('specific client; loanOfficer.exist is true',function(){
					it('agentId && clientId, should return err == null and should return result',function(done){
						dbFunctions.updateClientCalculatorIncNeed(
							{ 
								MP: '1834.47',
							  MCP: '0',
							  TMI: 2000,
							  RI: 0,
							  inputData: 
							   { housePrice: '250000',
							     downPayment: '8750.00',
							     monthlyDebtPayments: '0',
							     rentalIncome: 0,
							     downPaymentPercent: '3.5',
							     monthlyPayment: '1834.47',
							     grade: 'D',
							     borrower1: '2000',
							     borrower2: '0',
							     borrower3: '0',
							     needCoborrower: 'REQUIRED',
							     loanPaperGrade: '' },
							  agentId: '504aff792f21b4a808000002',
							  clientId: '517da4343a7b7a0000000004',
							  userType: 'realEstateAgent',
							  inc47: 4485.256723716382,
							  incneeded: '2485.26',
							  BR2: 0.917235,
							  frontDTI: 91.7235,
							  backDTI: 91.7235,
							  grade: 'D' 
					},function(err,results){
							expect(err).to.be(null);			
							expect(results).to.not.be.empty();	
							done()
						})//end of dbfunctions
					})//end of it should return null and return results
				})//end of specific client; loanOfficer.exist is true	
				describe('specific client; loanOfficer.exist is false',function(){
					it('agentId && clientId, should return err == null and should return result',function(done){
						dbFunctions.updateClientCalculatorIncNeed(
							{ 
								MP: '1834.47',
							  MCP: '0',
							  TMI: 2000,
							  RI: 0,
							  inputData: 
							   { housePrice: '250000',
							     downPayment: '8750.00',
							     monthlyDebtPayments: '0',
							     rentalIncome: 0,
							     downPaymentPercent: '3.5',
							     monthlyPayment: '1834.47',
							     grade: 'D',
							     borrower1: '2000',
							     borrower2: '0',
							     borrower3: '0',
							     needCoborrower: 'REQUIRED',
							     loanPaperGrade: '' },
							  agentId: '504aff792f21b4a808000002',
							  clientId: '517da4343a7b7a0000000004',
							  userType: 'realEstateAgent',
							  inc47: 4485.256723716382,
							  incneeded: '2485.26',
							  BR2: 0.917235,
							  frontDTI: 91.7235,
							  backDTI: 91.7235,
							  grade: 'D' 
					} ,function(err,results){
							expect(err).to.be(null);			
							expect(results).to.not.be.empty();	
							done()
						})//end of dbfunctions
					})
				})//specific client; loanOfficer.exist is false	
			})// if valid userdata

			describe('If invalid userdata',function(){
				it('valid agent but invalid client, should return err',function(done){
					dbFunctions.updateClientCalculatorIncNeed(
							{ 
								MP: '1834.47',
							  MCP: '0',
							  TMI: 2000,
							  RI: 0,
							  inputData: 
							   { housePrice: '250000',
							     downPayment: '8750.00',
							     monthlyDebtPayments: '0',
							     rentalIncome: 0,
							     downPaymentPercent: '3.5',
							     monthlyPayment: '1834.47',
							     grade: 'D',
							     borrower1: '2000',
							     borrower2: '0',
							     borrower3: '0',
							     needCoborrower: 'REQUIRED',
							     loanPaperGrade: '' },
							  agentId: '504aff792f21b4a808000002',
							  clientId: '504e728db00d27ad04000002-------',
							  userType: 'realEstateAgent',
							  inc47: 4485.256723716382,
							  incneeded: '2485.26',
							  BR2: 0.917235,
							  frontDTI: 91.7235,
							  backDTI: 91.7235,
							  grade: 'D' 
					} ,function(err,results){
							expect(err).to.not.be.empty();
							expect(results).to.be(null)	;		
							done()
					})//end of dbfunctions
				})//end of it valid agent but invalid client, should return err
				it('invalid agent,should return err',function(done){
					dbFunctions.updateClientCalculatorIncNeed(
							{ 
								MP: '1834.47',
							  MCP: '0',
							  TMI: 2000,
							  RI: 0,
							  inputData: 
							   { housePrice: '250000',
							     downPayment: '8750.00',
							     monthlyDebtPayments: '0',
							     rentalIncome: 0,
							     downPaymentPercent: '3.5',
							     monthlyPayment: '1834.47',
							     grade: 'D',
							     borrower1: '2000',
							     borrower2: '0',
							     borrower3: '0',
							     needCoborrower: 'REQUIRED',
							     loanPaperGrade: '' },
							  agentId: '504aff792f21b4a808000002------',
							  clientId: '504e728db00d27ad04000002',
							  userType: 'realEstateAgent',
							  inc47: 4485.256723716382,
							  incneeded: '2485.26',
							  BR2: 0.917235,
							  frontDTI: 91.7235,
							  backDTI: 91.7235,
							  grade: 'D' 
					},function(err,results){
							expect(err).to.not.be.empty();
							expect(results).to.be(null)	;		
							done()
					})//end of dbfunctions
				})//end of it invalid agent,should return err
			})//end if if invalid userdata				
	});//end of DB: updateClientCalculatorIncNeed

	describe('computedNumbers: DB: updateClientCalculatorGetCM',function(){
	 /* if userdata is incomple, it still will work, deciding where to put the validations*/
		describe('If valid userdata',function(){
			it('should return err == null and should return results',function(done){
				dbFunctions.updateClientCalculatorGetCM(
					{ LA: 241250,
					  IR: '5',
					  LP: 96.5,
					  agentId: '504aff792f21b4a808000002',
					  clientId: '517da4343a7b7a0000000004',
					  inputData: 
					   { housePrice: '250000',
					     downPayment: 8750,
					     monthlyDebtPayments: '0',
					     rentalIncome: 0,
					     downPaymentPercent: '3.5',
					     monthlyPayment: '1560.41',
					     grade: 'D',
					     borrower1: '2000',
					     borrower2: '0',
					     borrower3: '0',
					     needCoborrower: 'REQUIRED',
					     loanPaperGrade: '' },
					  userType: 'realEstateAgent',
					  twoFive: 6250,
					  threeEven: 7500,
					  MP: '1834.47',
					  RIR: 5 
				} ,function(err,results){
					expect(err).to.be(null);			
					expect(results).to.not.be.empty();	
					done()
				})//end of dbfunctions
			})//end of it should return null and return results
		})//end of if valid userdata
		
		describe.skip('If invalid userdata',function(){
			it('should return err',function(done){
				dbFunctions.updateClientCalculatorGetCM(
					{ LA: 241250,
					  IR: '5',
					  LP: 96.5,
					  agentId: '504aff792f21b4a808000002',
					  clientId: '517da4343a7b7a0000000004',
					  inputData: 
					   { housePrice: '250000',
					     downPayment: 8750,
					     monthlyDebtPayments: '0',
					     rentalIncome: 0,
					     downPaymentPercent: '3.5',
					     monthlyPayment: '1560.41',
					     grade: 'D',
					     borrower1: '2000',
					     borrower2: '0',
					     borrower3: '0',
					     needCoborrower: 'REQUIRED',
					     loanPaperGrade: '' },
					  userType: 'realEstateAgent',
					  twoFive: 6250,
					  threeEven: 7500,
					  MP: '1834.47',
					  RIR: 5 
				} ,function(err,results){
					expect(err).to.not.be.empty();		
					expect(results).to.be(null);		
					done()
				})//end of dbfunctions
			})//end of it should return err
		})//end of if invalid userdata		
	});// end of DB: updateClientCalculatorGetCM






  /** ****************************************************************************
   *  computedNumbers socket functions
   * ****************************************************************************/












}); //end of computedNumbers