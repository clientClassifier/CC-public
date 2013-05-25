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



describe('experimentalAnalysis.test.js file:', function() {
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
   * experimentalAnalysis  request
   * ****************************************************************************/

	describe('/experimentalAnalysis', function(){
	    it('Page should render with status 200', function(done){
	      request
	        .get('/experimentalAnalysis')
	        .end(function(err, res){
	          expect(res.status).to.be(200);
	          done();
	        })
	    });// end of page should return 200
	});//end of describe experimentalAnalysis


  /** ****************************************************************************
   * experimentalAnalysis  router tests
   * ****************************************************************************/

	describe('experimentalAnalysis',function(){
	    var req={
	      session:{errorsRequestConsultation :''}
	    }
	    it('Page Shoul title "Experimental"',function(done){
	      var res={
	        render:function(jade,data){
	          expect(data.title).to.be('Experimental')
	          done()
	        }//render
	      }//end of res
	      routes.experimentalAnalysis(req,res)
	    });//end of Page Should title "Experimental"
	    it('Should Render "directClientAnalysis.jade"',function(done){
	      var res={
	        render:function(jade,data){
	          expect(jade).to.be('directClientAnalysis.jade')
	          done()
	        }//end of render  
	      }//end of res
	      routes.experimentalAnalysis(req,res)
	    })//end of  Should Render "directClientAnalysis.jade"
	    it('req.session.errorsRequestConsultation  should be equal to data.errorsRequestConsultation ',function(done){
	      var res={
	        render:function(jade,data){
	          expect(data.errorsRequestConsultation ).to.be(req.session.errorsRequestConsultation );
	          done()
	        }//end of render
	      }//end of res
	      routes.experimentalAnalysis(req,res);
	    })//end of req.session.errorsRequestConsultation should be equal to data.errorsRequestConsultation
	    it("Render Should only receive : 'title' , 'errorsRequestConsultation' , 'imageBackground' , 'congrats'",function(done){
	      var res={
	        render:function(jade,data){
	          expect(data).to.only.have.keys('title' , 'errorsRequestConsultation' , 'imageBackground' , 'congrats')
	          done()
	        }// end of render
	      }//end res
	      routes.experimentalAnalysis(req,res);
	    })//end of title, contactErrors
	})//end of describe experimentalAnalysis           

  /** ****************************************************************************
   *  experimentalAnalysis  DB functions
   * ****************************************************************************/







  /** ****************************************************************************
   *  experimentalAnalysis  socket functions
   * ****************************************************************************/












}); //end of experimentalAnalysis 