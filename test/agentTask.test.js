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



describe('agentTask.test.js file:', function() {
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
   * agentTask  request
   * ****************************************************************************/

	describe('RequestTests',function(){
		var Cookies;
	    before(function(done) {
	      loginUser.anAgent(request, function(cookie) {
	        Cookies = cookie;
	        done();
	      })
	    }); //end of before
		// var request = require('supertest');
		// request = request('https://localhost:2000');
		describe('Request:task',function(){
				it('Page should render with status 200', function(done){
					var req = request.get('/agent/504aff792f21b4a808000002/tasks');	
					req.cookies = Cookies;
					req.set('Accept', 'application/json')
					.end(function(err, res) {
						expect(res.statusCode).to.be(200)
						done();
					});
				});// end of page should return 200
		})//end of Request : task
	})//end of describe RequestTests


  /** ****************************************************************************
   * agentTask  router tests
   * ****************************************************************************/

   	describe('RouterTests',function(){
		describe('Router: tasks',function(){
			var req={params:{agentId:'504aff792f21b4a808000002'},session:{}}
			it('Should Render "agent/tasks.jade"',function(done){
			var res={
				render:function(jade,data){
				expect(jade).to.be('agent/tasks.jade')
				done()
				}//end of render  
			}//end of res
			routes.tasks(req,res)
			})//end of Page Should render "agent/tasks.jade"
			it("Render Should only receive :  'title', 'tasksCompleted', 'tasks', 'agentId', 'totCommissions', 'agent', 'clients', 'currentClientId'",function(done){
			var res={
				render:function(jade,data){
				expect(data).to.only.have.keys( 'title','tasksCompleted',
				                          'tasks',
				                          'agentId',
				                          'totCommissions',
				                          'agent', 
				                          'clients',
				                          'currentClientId')
			    done()
			  	}// end of render
			}//end res
			routes.tasks(req,res);
			})//end of  Should only receive  'title', 'tasks'
		})//end of describe tasks
	})//end of describe RouterTests
              

  /** ****************************************************************************
   *  agentTask  DB functions
   * ****************************************************************************/







  /** ****************************************************************************
   *  agentTask  socket functions
   * ****************************************************************************/
    describe('SocketTests.', function() {
		describe('Socket: searchClient',function(){
			it('Should return list of tasks: params valid {valueSearch:"",idAgent:"504aff792f21b4a808000002"}',function(done){
				var client=io.connect(socketURL,options);
				client.once('connect',function(data){
					client.emit('searchClient','','504aff792f21b4a808000002')
					client.on('searchClient',function(value,tasksCompleted,tasks){
						expect(tasks).not.to.be(null)
						client.disconnect()
						done()
					})

				})
			})//end of Should return list of tasks

			it('Should return null idAgent Incorrect',function(done){
				var client=io.connect(socketURL,options)
				client.once('connect',function(data){
					client.emit('searchClient','','507aff792f21b4a808000002')
					client.on('searchClient',function(value,tasksCompleted,tasks){
						expect(tasks).to.be(null)
						client.disconnect()
						done()
					})
				})
			})//end of it Should return null


			it('Should return null params invalid',function(done){
				var client=io.connect(socketURL,options)
				client.once('connect',function(data){
					client.emit('searchClient','',809809808)
					client.on('searchClient',function(value,tasksCompleted,tasks){
						expect(tasks).to.be(null)
						client.disconnect()
						done()
					})
				})
			})//end of it Should return null
		})//End of Describe Socket: searchClient

		describe('Socket: updateTaskCompleted',function(){
			it('Should update tasks and  return list for tasks',function(done){
				var userdata={value:'',clientId:'517da16cfae2a810ff00000f',checkbox:true,agentId:'504aff792f21b4a808000002',taskId:'517da16cfae2a810ff000011'}
				 var client = io.connect(socketURL, options);
				// var client = require('socket.io-client')('https://localhost:2000');
				client.once('connect',function(data){
					client.emit('updateTaskCompleted',userdata);
					client.once('searchClient',function(value,tasksCompleted,tasks){
						expect(tasks).not.to.be(null)
						client.disconnect()
						done()
					})				
				});
			})//end of Should update return list for tasks

			it('Should update tasks and  return tasks null',function(done){
				// var userdata={value:'',clientId:'504bfa53bb86b59403000002',checkbox:true,agentId:'504aff792f21b4a808000002',taskId:'510dbacabff32b2012000003'}
				var userdata={} 
				var client = io.connect(socketURL, options);
				// var client = require('socket.io-client')('https://localhost:2000');
				client.once('connect',function(data){
					client.emit('updateTaskCompleted',userdata);
					client.once('searchClient',function(value,tasksCompleted,tasks){
						expect(tasks).to.be(null)
						client.disconnect()
						done()
					})
				});
			})//end of Should update: return tasks null

			it('Should update tasks and  return false',function(done){
				var userdata={value:'',clientId:'509bfa53bb86b59403000002',checkbox:true,agentId:'504aff792f21b4a808000002',taskId:'510dbacabff32b2012000003'}
				// var userdata={} 
				var client = io.connect(socketURL, options);
				// var client = require('socket.io-client')('https://localhost:2000');
				client.once('connect',function(data){
					client.emit('updateTaskCompleted',userdata);
					client.once('denyUpdateTaskCompleted',function(state,data){
						expect(state).to.be(false)
						client.disconnect()
						done()
					})
				});
			})//end of Should update: return false
		})//end of describe Socket: updateTasksCompleted
	})//end of SocketTests.
}); //end of agentTask 