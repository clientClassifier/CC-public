// var request = require('supertest'),
// request = request('https://localhost:2000');


exports.xavier =  function(request, callback){ 
		request
	      .post('/login')
	      .set('Accept','application/json')
	      .send({"email": "x@email.com", "password": "xxxxxxxxx"})
	      .expect('Content-Type', /json/)
	      .expect(200)
	      .end(function (err, res) {
	        var Cookies = res.headers['set-cookie'].pop().split(';')[0];
	        return callback(Cookies)
	      });
};//end of export xavier



exports.anAgent = function(request, callback){
		request
	      .post('/login')
	      .set('Accept','application/json')
	      .send({"email": "testing@email.com", "password": "ttttttttt"})
	      .expect('Content-Type', /json/)
	      .expect(200)
	      .end(function (err, res) {
	        var Cookies = res.headers['set-cookie'].pop().split(';')[0];
	        return callback(Cookies)
	      });
};//end of agent -- realEstateAgent


exports.aClient = function(request, callback){
		request
	      .post('/login')
	      .set('Accept','application/json')
	      .send({"email": "jhonsy_72@hotmail.com", "password": "zcMVr7Min"})
	      .expect('Content-Type', /json/)
	      .expect(200)
	      .end(function (err, res) {
	        var Cookies = res.headers['set-cookie'].pop().split(';')[0];
	        return callback(Cookies)
	      });
};//end of agent -- realEstateAgent





// var superagent = require('superagent');
// var agent = superagent.agent();
// var theAccount = {
//   "email": "x@email.com",
//   "password": "xxxxxxxxx"
// };

// exports.xavier = function (request, agent) {
//   request
//     .post('https://localhost:2000/login')
//     .send(theAccount)
//     .end(function (err, res) {
//       if (err) {
//         throw err;
//       }
//       agent.saveCookies(res);
//       // done(agent);
//       // done()



//     });

// };