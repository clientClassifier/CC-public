/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');
var sendGridMail = require('./sendGridMail');


/** 
 * Model files
 */
var RealEstateAgent = require('./models/RealEstateAgent.js');
var Client = require('./models/client.js');
var allUsers = require('./models/allUsers.js');
var loanOfficer = require('./models/loanOfficer.js');
var brokerLeader = require('./models/brokerLeader.js');
var consumerLead = require('./models/consumerLead.js');
var forgotInfo = require('./models/forgotInfo.js');
var requestClient = require('./models/requestClients.js');
var bcrypt = require('bcrypt');
var moment = require('moment');
var Task = require('./models/task.js');
var Distribute = require('./models/distribute.js');

/*
 * ******************************************** Connect to DB ***************************
 */

exports.startup = function(dbToUse) {
  mongoose.connect(dbToUse);
  mongoose.connection.on('open', function() {
    console.log('DB: startup: We have connected to mongodb');
  });
}; //end of startup



/*
 * ******************************************** Passport Authentication ***************************
 */


//Passport Local Strategy for email authentication
passport.use(new LocalStrategy({
  usernameField: 'email'
}, function(email, password, done) {
  // asynchronous verification, for effect...
   // console.log('DB: passport: going to authenticate user now 1');
  process.nextTick(function() {
     // console.log('DB: passport: going to authenticate user now 2');
    var messageresult = null;
    allUsers.authenticateEmail(email, password, function(err, user, messageresult) { //before: 'user' was 'email'
       // console.log('DB: passport: returning to user');
      // console.log(messageresult); //this does return the right thing to console
      if(messageresult == 'incorrect user') {
        return done(null, false, {
          message: 'Unkown user'
        });
      } //left side is the output of the teacher users function, the right side is what is sent to the login page
      if(messageresult == 'wrong password') {
        return done(null, false, {
          message: 'Invalid password'
        });
      }
      return done(err, user); //i use to return 'email' not 'user'
    }); //end authenticate
  });
} //end username password done
));

//serialize user login
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//deserialize user on logout
passport.deserializeUser(function(id, done) {
  allUsers.findById(id, function(err, user) {
    done(err, user);
  });
});

/*
 * ******************************************** Functions to complete specific Tasks ***************************
 */




/**
 * compute totalCommisison
 */


function computeTotalCommission(user){//i realize this function is not statefull, but ill ignore taht for now. aka creating req.session or req.local variable

     var daysCommission = 0;
      var weeksCommission = 0;
      var monthsCommission = 0;

      
      for(var i = 0; i < user.clients.length; i++) {
        if(user.clients[i].calculator.grade == 'A+' || user.clients[i].calculator.grade == 'A') {
          daysCommission = daysCommission + user.clients[i].commission.twoFive;
        }
        if(user.clients[i].calculator.grade == 'B' || user.clients[i].calculator.grade == 'C') {
          weeksCommission = weeksCommission + user.clients[i].commission.twoFive;
        }
        if(user.clients[i].calculator.grade == 'D' || user.clients[i].calculator.grade == '') {
          monthsCommission = monthsCommission + user.clients[i].commission.twoFive;
        }

        var a = moment(user.clients[i].userCreat13ed);
        var b = moment(new Date());
        var c = b.diff(a, 'days');//time
        user.clients[i].timeAgo = c;
      } //end of for loop

      var totCommissions = {
        daysCommission: daysCommission,
        weeksCommission: weeksCommission,
        monthsCommission: monthsCommission
      };
      user.totCommissions = totCommissions;

      return user;

};//end of comptueTotalCommission



/**
 * updateAgentAndLoanOfficer
 */
function updateAgentAndLoanOfficer(agent, loanOfficerId, clientId, index, callback) {
  console.log('DB: updateAgentAndLoanOfficer: will update agent = "' + agent._id + '"');
  console.log('DB: updateAgentAndLoanOfficer: will update loan officer = "' + loanOfficerId + '"');

  if(typeof(loanOfficerId) == 'undefined') {
    return callback('updateAgentAndLoanOfficer: ERROR: Loan officer ID was undefined, hence do nothing.');
  }
  loanOfficer.findById(loanOfficerId, function(loErr, officer) {
    if(!loErr) {
      var index2 = 0;
      for(var i = 0; i < officer.clients.length; i++) {
        if(officer.clients[i]._id == clientId) {
          index2 = i;
          break;
        } //end of check for client i am looking for
      } //end of for loop
      console.log('DB: updateAgentAndLoanOfficer: found the loan officer');
      officer.clients[index2] = agent.clients[index];
      officer.markModified('clients');
      async.parallel([
          function(cb) { //save data client data to loanOfficer
            officer.save(function(savErr) {
              if(!savErr) { // officer){
                cb(null);
              } //end of !savErr
              else {
                console.log('DB: updateAgentAndLoanOfficer: didnt saved communication to loanOfficer');
                cb(savErr);
              } //end of !savErr
            }); //end of save
          }, //end of first async function
          function(cb) { //save data to real estate agent client
            agent.save(function(savErr) {
              if(!savErr) {
                cb(null, agent);
              } //end of !savErr
              else {
                console.log('DB: updateAgentAndLoanOfficer: didnt saved communication to agent');
                cb(savErr);
              } //end of !savErr
            }); //end of save
          } // end of second async function
        ], //end of all async functions
      function(allErr, allResults) {
        if(!allErr) {
          return callback(null, allResults);
        } //end of !allErr else
        else {
          return callback(allErr);
        } //end of allErr else
      }); //end of async function
    } //end of loErr
    else {
      console.log('DB: updateAgentAndLoanOfficer: failed to find loanofficer');
      callback(loErr);
    } //endof loErr else
  }); //end of findloanOfficer by id
} //end of updateAgentAndLoanOfficer function




/**
 * parallelUpdateLoanOfficerAndAgent
 */
function parallelUpdateLoanOfficerAndAgent(officerId, agentId, clientId, modified, functionError, callback) {
  async.parallel({
    one: function(cb) {
      loanOfficer.update({
        'clients._id': ObjectId(clientId)
      }, modified, {
        safe: {
          j: 1
        }
      }, function(err, num) {
        if(num === 0) {
          return cb('DB: parallelUpdateLoanOfficerAndAgent: LoanOfficer: UPDATE ERROR: ' + functionError + ' made no changes');
        }
        if(err) {
          return cb(err);
        }
        cb(null); //no errors
      });
    },
    //end of one object
    two: function(cb) {
      RealEstateAgent.update({
        _id: agentId,
        'clients._id': ObjectId(clientId)
      }, modified, {
        safe: {
          j: 1
        }
      }, function(err, num) {
        if(num === 0) {
          return cb('DB: parallelUpdateLoanOfficerAndAgent: AGENT:  UPDATE ERROR: ' + functionError + ' made no changes');
        }
        if(err) {
          return cb(err);
        }
        return cb(null);
      }); //end of update agent
    } //end of two object
  }, function(updateErr) {
    if(updateErr) {
      return callback(updateErr);
    }
    return callback(null);
  }); //end of async function
} //parallelUpdateLoanOfficerAndAgent




/**
 * checkStatus
 */
function checkStatus(name,checkbox,userType,state,nameClient){
  var body="";
  if(state){
  if(userType==='realEstateAgent'){
    switch(checkbox){
      //REMOVED
    }
  }else if(userType==='loanOfficer'){
    switch(checkbox){
    //REMOVED
    } 
  }
  }else{
    if(userType==='realEstateAgent'){
    }
    else if(userType==='loanOfficer'){
    }
  }

  return body;
};// end of checkStatus




/**




 * formatDateFun
 */
function formatDateFun() { //depreciate, i am using moments now
  var now = new Date();

  var month = now.getMonth() + 1;
  var day = now.getDate();
  var year = now.getFullYear();
  var hourRaw = (now.getHours());
  var minutes = now.getMinutes();
  if(hourRaw <= 11) {
    meridiem = 'AM';
  } else {
    meridiem = 'PM';
  }
  var hour = (hourRaw) % 12;
  if(hour < 12) {
    hour = '0' + hour;
  }
  if(minutes < 10) {
    minutes = '0' + minutes;
  }
  if(month == '1') {
    month = 'Jan';
  } else if(month == '2') {
    month = 'Feb';
  } else if(month == '3') {
    month = 'Mar';
  } else if(month == '4') {
    month = 'Apr';
  } else if(month == '5') {
    month = 'May';
  } else if(month == '6') {
    month = 'Jun';
  } else if(month == '7') {
    month = 'Jul';
  } else if(month == '8') {
    month = 'Aug';
  } else if(month == '9') {
    month = 'Sep';
  } else if(month == '10') {
    month = 'Oct';
  } else if(month == '11') {
    month = 'Nov';
  } else if(month == '12') {
    month = 'Dec';
  }
  return month + '-' + day + '-' + year.toString().substr(2, 4) + ' ' + hour + ':' + minutes + meridiem + ': ';
};//end of formatDateFun




/**
 * getSingleClient
 */
function getSingleClient(clients, id) {
  for(var i = 0; i < clients.length; i++) {
    // console.log('DB: getSingleClient: compare('+clients[i]._id +' , ' + id )
    if(clients[i]._id == id) {
      return i;
    } //end of check for client i am looking for
  } //end of for loop
  return null; //if nothing is found, return null
} //end of getSingleClient




/**
 * updateLoanOfficerAndAgent
 */
function updateLoanOfficerAndAgent(officer, agentId, clientId, index, callback) {

  RealEstateAgent.findById(agentId, function(loErr, agent) {
    if(!loErr) {
      var agentClientIndex = getSingleClient(agent.clients, clientId);
      if(agentClientIndex === null && agentClientIndex <= agent.clients.length) { //if null or the value is not within rage of the laon officer client array
        return callback('DB: updateLoanOfficerAndAgent ERROR: Client does not exist for this agent ');
      }
      if(agentClientIndex == null ){
        return callback('DB: updateLoanOfficerAndAgent : client does not exist inside of agent. NO update applied')
      }

      agent.clients[agentClientIndex] = officer.clients[index];
      agent.markModified('clients');

      async.parallel([

          function(cb) { //save data client data to loanOfficer
            // console.log('DB: updateLoanOfficerAndAgent laon officer added to client = ' + results.loanOfficer);
            officer.save(function(savErr) {
              if(!savErr) {
                // console.log('DB: updateLoanOfficerAndAgent: saved  to loanOfficer');
                cb(null);
              } //end of !savErr
              else {
                console.log('DB: updateLoanOfficerAndAgent: didnt saved  to loanOfficer');
                cb(savErr);
              } //end of !savErr
            }); //end of save
          }, //end of first async function


          function(cb) { //save data to real estate agent client
            agent.save(function(savErr) {
              if(!savErr) {
                // console.log('DB: updateLoanOfficerAndAgent: saved  to agent');
                cb(null);
              } //end of !savErr
              else {
                console.log('DB: updateLoanOfficerAndAgent: didnt saved  to agent');
                cb(savErr);
              } //end of !savErr
            }); //end of save
          } // end of second async function
        ], //end of all async functions
      function(allErr) {
        if(!allErr) {
          return callback(null);
        } //end of !allErr else
        else {
          return callback(allErr);
        } //end of allErr else
      }); //end of async function
    } //end !loErr if
    else {
      return callback(loErr);
    } //end of !loErr eles
  }); //end of loanOffice
} //end of updateLoanOfficerAndAgent




/**
 * updateCount
 */
function updateCount(userData, disputeCounts){
    
  if(userData.type == 'requestNewLO'){
    disputeCounts.type.requestNewLO++;
  }
  else if(userData.type == 'requestDeleteClient'){
    disputeCounts.type.requestDeleteClient++;
  }
  else{
    return null;
  }

  if(userData.client == true){//then update dispute.client
    disputeCounts.client++;
  }
  else if(userData.loanOfficer == true){
    disputeCounts.loanOfficer++;
  }
  else if(userData.agent == true){
    disputeCounts.agent++;
  }
  else if(userData.other == true){
    disputeCounts.other++;
  }
  else{
    return null;
  }
  return disputeCounts;
}//end of updateCount

/**
 * create TempPassword
 */
function createTempPassword()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 9; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

/**
 * doesValueExistInArray
 */

function doesValueExistInArray(oArray, oKey,oValue) {
  // console.log(oArray[2][oKey])
  // console.log(oValue)
  var i=0
  for(i = 0; i < oArray.length; i++) {
    if(oArray[i][oKey] == oValue) {
      return i;
    } //end of check for client i am looking for
  } //end of for loop
  if(i==oArray.length){  
  return null; //if nothing is found, return null
  }
} //end of doesValueExistInArray

/*
 * ******************************************** ENTERING ALL DB calls!!!! ***************************
 */



exports.agentCreateClientAccount=function(email,params, callback){ 
console.log('params '+ JSON.stringify(params))
   RealEstateAgent.findById(params.agentId,'clients _id', function(err, result){
    if(!err){      
      var index = getSingleClient(result.clients, params.clientId)
      if(index == null){
        return callback('DB: agentCreateClient: no client in this agent',null)
      }
      var pass = createTempPassword();
      console.log('password = ' + pass) 
      // console.log('result '+ JSON.stringify(result.clients[index]))
      // console.log('client id inside array = '+ result.clients[index]._id)
      // console.log('client id params = '+ params.clientId)
      var ob = ObjectId(params.clientId)
      var newClient = new allUsers({
        _id: ob,
        agentId: params.agentId,
        clientId: params.clientId,
        firstName: result.clients[index].firstName,
        lastName: result.clients[index].lastName,
        middleName: result.clients[index].middlename,
        confirmed: true,
        userType: 'client',
        email: email,
        password: pass,
        confirmCode :'null'
      })
      // newClient._id = ObjectId(params.clientId);
      // newClient.markModified('_id');
      result.clients[index].registered = true;
      result.markModified('clients');
      async.parallel({
      one: function(cb){
           newClient.save(function(savErr){
              if(!savErr){
                return callback(null,{email: email, password: pass, agentFirstName: result.clients[index].agent.firstName , agentLastName: result.clients[index].agent.lastName})
              }
              else{
                return callback('DB: agentCreateClientAccount: saving client information failed' + savErr,null)
              }
            })
      },
      two: function(cb){
        result.save(function(savErr){
          if(!savErr){
            return cb(null)
          }
          else{
            return cb('DB: agentCreateClientAccount: saving client information to agent failed' + savErr,null)
          }
        })
        }
      },
      function(allErr, allResults) {
          // allResults is now equals to: {one: {email: email, pas...}, two: 2}
          if(!allErr){
            return callback(null, allResults.one)
          }
          else{
            return callback('DB:',null)
          }
      });//end of async
    }//end of if no error
    else{      
      callback(err,null)
    };//end of esle error on query
  });//end of find agent by id
}


/**
 *  registerNewAgent
 */
exports.registerNewAgent = function(userdata, callback) { //register version 2
  var Agent = new RealEstateAgent({
    firstName: userdata.firstName,
    middleName: userdata.middleName,
    lastName: userdata.lastName,
    TOS: userdata.TOS,
    userType: 'realEstateAgent',
    email: userdata.email,
    cellPhone: userdata.cellPhone,
    password: userdata.password,
    brokerCompany: userdata.companyName,
    companyPhone: userdata.companyPhone
  }); //end of var agent

  Agent.save(function(err) {
    if(!err) {
      var confirmCode = bcrypt.hashSync(userdata.email, bcrypt.genSaltSync(10));
      console.log('confirmCode = ' + confirmCode);
      var newUser = new allUsers({
        _id: Agent.id,
        email: Agent.email,
        // salt: Agent.salt,
        hash: Agent.hash,
        firstName: userdata.firstName,
        middleName: userdata.middleName,
        lastName: userdata.lastName,
        userType: Agent.userType,
        userCreated: Agent.userCreated,
        confirmCode: confirmCode
      }); //endo f newUser Object
      newUser.save(function(newUserErr) {
        if(!newUserErr) {
          callback(null, confirmCode);
        } //end of !newUserErr if
        else {
          console.log('DB: registerRealEstateAgent: saved agent but didnt update user collection');
          callback(newUserErr, null);
        } //end of newUserErr else
      }); //end of newuser save
    } //endof !err
    else {
      console.log('DB: registerRealEstateAgent: failed save user = ' + Agent.email);
      callback(err, null);
    } //end of !err else
  }); //end of Agent.save
}; //end of registerRealEstateAgent





/*
 * confirmNewUser
 */
exports.confirmNewUser = function(userdata, callback) {
//REMOVED
}; //confirmNewUser




/*
 * forgotPassword
 */
exports.forgotPassword = function(userData, callback) {
//REMOVED
}; //end of forgotPassword

/*
* findEmail
*/

exports.findEmail =function(userData,callback){
  //REMOVED

}

/*
 * getChangePassword
 */

exports.getChangePassword = function(confirmCode, callback) {
  //REMOVED
}; // end of getChangePassword



/*
 * SaveChangedPassword
 */
exports.SaveChangedPassword = function(userdata, confirmCode, callback) {
 //REMOVED
}; //end of SaveChangedPassword





/*
 *  registerNewLoanOfficer
 */
//this function is identical to registrRealEstateAgent 'here simply because it may be temporary, i want to create a script for this action'
exports.registerNewLoanOfficer = function(userdata, callback) { //register registerNewLoanOfficer
  var newLO = new loanOfficer({
    email: userdata.email,
    password: userdata.password,
    firstName: userdata.firstName,
    middleName: userdata.middleName,
    lastName: userdata.lastName,
    userType: 'loanOfficer',
    cellPhone: userdata.cellPhone,
    nmlsId: userdata.NMLSID
  }); //end of var agent

  newLO.save(function(err) {
    if(!err) {
      // console.log('DB: registerNewLoanOfficer: resaved user = ' + newLO.email);
      var confirmCode = bcrypt.hashSync(userdata.email, bcrypt.genSaltSync(10));
      // console.log('DB: registerNewLoanOfficer: LO confirmCode = ' + confirmCode);
      var newUser = new allUsers({
        _id: newLO.id,
        email: newLO.email,
        // salt: newLO.salt,
        hash: newLO.hash,
        firstName: userdata.firstName,
        middleName: userdata.middleName,
        lastName: userdata.lastName,
        userType: newLO.userType,
        userCreated: newLO.userCreated,
        confirmCode: confirmCode
      }); //endo f newUser Object
      newUser.save(function(newUserErr) {
        if(!newUserErr) {
          callback(null, confirmCode);
        } //end of !newUserErr if
        else {
          console.log('registerNewLoanOfficer: ERROR: saved agent but didnt update user collection');
          callback(newUserErr, null);
        } //end of newUserErr else
      }); //end of newuser save
    } //endof !err
    else {
      console.log('registerNewLoanOfficer: ERROR: failed save new LO user = ' + newLO.email);
      callback(err, null);
    } //end of !err else
  }); //end of loanOfficer.save
}; //end of registerNewLoanOfficer




/*
 * ******************************************** AGENT DB calls!!!! ***************************
 */






/*
 *  getSelf 
 */
exports.getSelf = function(userdata, callback) {

  RealEstateAgent.findById(userdata, 'clients firstName lastName', {lean: true}, function(finderr, result) {
    if(!finderr) {
      // console.log(result.clients)
      result = computeTotalCommission(result);//statefull call //dont like this

      callback(null, result);
    } //end of !finderr if
    else {
      callback(finderr, null);
    } //end of !finderr else
  }); //end of findbyID
}; //end of getSelf



/*
 *  getOnlyClientNames
 */
exports.getOnlyClientNames = function(userdata, callback) { //todo: change name of function
  
  RealEstateAgent.findById(userdata.agentId, 'clients', function(finderr, result) {
    if(!finderr) {
      var index = getSingleClient(result.clients, userdata.clientId);
      if(index === null && index <= result.clients.length) { //if null or the value is not within rage of the laon officer client array
        return callback('DB: getOnlyClientNames: ERROR: Client does not exist for this agent ', null);
      }

      result = computeTotalCommission(result);//statefull call

      var numCompleted = 0;
      for(var i = 0; i < result.clients[index].instructions.length; i++) {
        if(result.clients[index].instructions[i].completed == true) { //if current clientId = the one i am looking for
          numCompleted++;
        } //end of check for client i am looking for
      } //end of for loop

      if(numCompleted == result.clients[index].instructions.length) {
        result.clients[index].allInstructionsCompleted = 1;
      } else {
        result.clients[index].allInstructionsCompleted = 0;
      }

      result.index = index;
      callback(null, result);
    } //end of !finderr if
    else {
      callback(finderr, null);
    } //end of !finderr else
  }); //end of findbyID
}; //end of getOnlyClientNames


/*
 *  addNewClient
 */
exports.addNewClient = function(userdata, callback) {
//REMOVED
}; //end of addnewClient





/*
 *  updateClientCalculator
 */
exports.updateClientCalculatorGetCM = function(userdata, callback) {
  //userdata is the id of client inside of the realestateagents collection
  RealEstateAgent.findById(userdata.agentId, 'clients', function(finderr, result) {
    if(!finderr) {
      var index = getSingleClient(result.clients, userdata.clientId);
      if(index === null && index <= result.clients.length) { //if null or the value is not within rage of the laon officer client array
        return callback('DB: updateClientCalculatorGetCM: ERROR: Client does not exist for this loan officer ', null);
      }

      result.clients[index].calculator.housePrice = userdata.inputData.housePrice;
      result.clients[index].calculator.downPaymentPercent = userdata.inputData.downPaymentPercent;
      result.clients[index].calculator.desiredInterestRate = userdata.RIR;
      result.clients[index].calculator.loanAmount = userdata.LA;
      result.clients[index].calculator.loanPercent = userdata.LP;
      result.clients[index].calculator.downPayment = userdata.inputData.downPayment;
      result.clients[index].calculator.monthlyPayment = userdata.MP;

      result.clients[index].commission.twoFive = userdata.twoFive;
      result.clients[index].commission.threeFive = userdata.threeFive;
      result.clients[index].commission.threeEven = userdata.threeEven;

      result.markModified('clients');
      result.save(function(saverr) { //TODO: change to update
        if(!saverr) {
              console.log('CM: userdata.clientId = ' + userdata.clientId)
              Distribute.update({clientId: new ObjectId(userdata.clientId)}, { 'calculator': result.clients[index].calculator})
                        .exec(function(err, num){

                        console.log(num)
                        callback(null, result);
              })
        } //end of iff
        else {
          console.log('DB: updateClientCalculatorGetCM: ERROR: didnt save item');
          callback(saverr, null);
        } //end of else
      }); //end of save function
    } //end of !err if
    else {
      console.log('DB: updateClientCalculatorGetCM: ERROR: failed to find = ' + userdata.agentId);
      callback(finderr, null);
    } //end of !err else
  }); //end find by ID
}; //end of updateClientCalculator





/**
 *  updateClientCalculatorIncNeed
 */
exports.updateClientCalculatorIncNeed = function(userdata, callback) {
    //REMOVED 
}; //end of updateClientCalculatorIncNeed



/*
 *  getCalculatorInfo
 */
exports.getCalculatorInfo = function(agentId, clientId, callback) {
  //REMOVED
}; //end of getCalculatorInfo




/*
 * ******************************************** Loan Officer DB calls!!!! ***************************
 */



/*
 * newlyCreatedClients (return only the clients with loanOfficer.exists == false)
 */
exports.newlyCreatedClients = function(callback) {  
  //REMOVED
}; //end of newlyCreatedClients



/*
 * putClientPhoneNumbers
 */
  exports.putClientPhoneNumbers = function(userdata, callback) {
    // console.log(userdata)
  RealEstateAgent.findOne({
    'clients._id': new ObjectId(userdata.clientId)
  }, function(err, agent) {

      if(!err) {
      // console.log(agent.clients.length)
      var index = getSingleClient(agent.clients, userdata.clientId);
      if(index === null && index <= agent.clients.length) { //if null or the value is not within rage of the laon officer client array
        return callback('DB: putClientPhoneNumbers ERROR: Client does not exist for this loan officer ', null);
      }
      // console.log('length - ' + (agent.clients[index].middleName).length)
      // var clientName=((agent.clients[index].middleName).length>0)?agent.clients[index].middleName:(agent.clients[index].firstName+' '+agent.clients[index].lastName);
        
      if(agent.clients[index].middleName == undefined){
        var clientName = agent.clients[index].firstName+' '+agent.clients[index].lastName
      }
      else{
        var clientName = agent.clients[index].firstName+' '+  agent.clients[index].middleName  +' ' +agent.clients[index].lastName       
      }


      //REMOVED

      agent.clients[index].clientConfirmation = true;
      agent.markModified('clients');

      if(agent.clients[index].loanOfficer.exists == true) {
        updateAgentAndLoanOfficer(agent, agent.clients[index].loanOfficer._id, userdata.clientId, index, function(saveErr) {
          if(!saveErr) {
            return callback(null, agent.clients[index]);
          } //end of !saveErr if
          else {
            return callback(saveErr, null);
          } //end of !saveErr else
        }); //end of  updateAgentAndLoanOfficer
      } //end of if loan officer exists
      else {
        console.log('i should save to agent and update disribute')
        agent.save(function(savErr) {
          if(!savErr) {
              Distribute.update({clientId: new ObjectId(userdata.clientId)}, { 'client.cellPhone': userdata.clientCellPhone})
                        .exec(function(err, num){
                        console.log('putClientPhone num: num upated : ' + num)
                        return callback(null, agent.clients[index]);
              })
          } //end of !savErr
          else {
            console.log('DB: putClientPhoneNumbers: ERROR: didnt saved client phones to agent');
            return callback(savErr, null);
          } //end of !savErr
        }); //end of save
      }
    } //end of !err if
    else {
      return callback(err);
    } //end of !err else
  }); //end of find real estate agent with specific client objectID
}; //end of putClientPhoneNumbers





/*
 * getLoanOfficerClient
 */
exports.getLoanOfficerClient = function(userdata, callback) {
  loanOfficer.findById(userdata.lenderId, function(err, officer) { //NOT: uses dispute
    if(!err) {
    var index = getSingleClient(officer.clients, userdata.clientId);
    if(index === null && index <= officer.clients.length) { //if null or the value is not within rage of the laon officer client array
      return callback('DB: getLoanOfficerClient ERROR: Client does not exist for this loan officer ', null);
    }  
      officer.index = index;
      callback(null, officer);
    } //end of !err if
    else {
      console.log('DB: getLoanOfficerClient: ERROR finding loan officer =' + userdata.lenderId);
      callback(err, null);
    } //end of !err else
  }); //end of loanOfficer.findById
}; //end of getLoanOfficerClient




/*
 * getLOClients
 */
exports.getLOClients = function(loanOfficerId, callback) {
  //REMOVED
}; //end of getLOClients




/*
 * GrabAllLO
 */
exports.GrabAllLO = function(callback) {
//REMOVED
}; //end of GrabAllLO




/*
 * cloneClientToLoanOfficer
 */
exports.cloneClientToLoanOfficer = function(userdata, callback) {
  RealEstateAgent.find({
    'clients._id': ObjectId(userdata.clientId)
  }, function(err, results) {
    if(!err) {
      console.log(results[0])

    var index = getSingleClient(results[0].clients, userdata.clientId);
      if(index === null && index <= officer.clients.length) { //if null or the value is not within rage of the laon officer client array
        return callback('DB: cloneClientToLoanOfficer ERROR: Client does not exist for this loan officer ', null);
    }  

      loanOfficer.findById(userdata.loanOfficerId, function(loErr, officer) {
        if(!loErr) {
          //put data into loan officer
          officer.clients.push(results[0].clients[index]);
          officer.markModified('clients');

          //put data into agent
          results[0].clients[index].loanOfficer = {
            _id: officer._id,
            exists: true,
            firstName: officer.firstName,
            middleName: officer.middleName,
            lastName: officer.lastName,
            cellPhone: officer.cellPhone,
            email: officer.email,
            companyFax: officer.companyFax,
            brokerCompany: officer.brokerCompany,
            companyPhone: officer.companyPhone
          };
          results[0].markModified('clients');
          // console.log('DB: cloneClientToLoanOfficer: Agent:Client:LoanOfficer: id  = ' + results[0].clients[index].loanOfficer._id);
          // console.log('DB: cloneClientToLoanOfficer: Agent:Client:agent: id  = ' + results[0].clients[index].agent._id);
          async.parallel([
                  function(cb) { //save data client data to loanOfficer
                    officer.save(function(savErr) {
                      if(!savErr) {
                        cb(null);
                      } //end of !savErr
                      else {
                        console.log('DB: cloneClientToLoanOfficer: ERROR: failed to save to loan officer');
                        cb(savErr);
                      } //end of !savErr
                    }); //end of save
                  }, //end of first async function

                  function(cb) { //save data to real estate agent client
                    results[0].save(function(savErr) {
                      if(!savErr) {
                        cb(null);
                      } //end of !savErr
                      else {
                        console.log('DB: cloneClientToLoanOfficer: ERROR: failed to save to rea estate agent');
                        cb(savErr);
                      } //end of !savErr
                    }); //end of save
                  } // end of second async function
              ], 
              function(allErr) {
                if(!allErr) {
                  console.log('cloning completed')
                  callback(null);
                } else {
                  callback(allErr);
                }
          }); //end of async function
        } //end of !loErr if
        else {
          callback(loErr);
        } //end of !loErr else
      }); //end of find specific loan officerloanofficer
    } //end of !err if
    else {
      callback(err);
    } //end of !err else
  }); //end of find client with specific id
}; //end of cloneClientToLoanOfficer


/*
 * updateDocuments
 */
exports.updateDocuments = function(data, callback) { //this can be simplified. look at sendAlert or updateSetting
  var modified = {
    $set: {}
  };
    
  modified.$set['clients.$.documentation.' + data.checkbox] = data.state;
  if(data.userType === 'loanOfficer') {
    loanOfficer.findById(data.userId, function(err, result) {
      if(err) {
        return callback(err);
      }
      var currentClientIndex = getSingleClient(result.clients, data.clientId);
      if(currentClientIndex === null && currentClientIndex <= result.clients.length) { //if null or the value is not within rage of the laon officer client array
        return callback('DB: updateDocuments ERROR: Client does not exist for this loan officer ');
      }

      if(result.clients[currentClientIndex].dispute._id != null){//.agentRequest == 1 ||result.clients[currentClientIndex].removeRequest.clientRequest == 1 || result.clients[currentClientIndex].removeRequest.loanOfficerRequest == 1 ){
        return callback('DB: updateDocuments: ERROR: This client has a remove request (LO)')
      }

      var agentId = result.clients[currentClientIndex].agent._id;

      data.otherUserId = agentId;
      var emailAgent =  result.clients[currentClientIndex].agent.email;
      var nameClient=(result.clients[currentClientIndex].firstName+' '+result.clients[currentClientIndex].lastName);
      var emailData = {
          // to:emailAgent ,
          to: 'sogoiii@gmail.com',
          locals:{
            state:data.state,
            checkbox:data.checkbox,
            body:checkStatus(result.firstName+ ' ' +result.lastName,data.checkbox,data.userType,data.state,nameClient),
            nameFL:result.firstName+ ' ' +result.lastName,
            nameClient:nameClient
          }
         };

      parallelUpdateLoanOfficerAndAgent(data.userId, agentId, data.clientId, modified, 'Updating Document Err', function(updatingErr) {
        if(!err){
           return callback(null, emailData);
        } else {
           return callback(updatingErr);
        }
       
      }); //end of LoanOfficerAndAgentUpdates
    }); //end of find loanofficer by Id
  } //end of update document on loan officer
  else if(data.userType === 'realEstateAgent') {
    RealEstateAgent.findById(data.userId, function(err, result) {
      if(err) {
        return callback(err);
      }

      var currentClientIndex = getSingleClient(result.clients, data.clientId);
      if(currentClientIndex === null && currentClientIndex <= result.clients.length) { //if null or the value is not within rage of the laon officer client array
        return callback('DB: updateDocuments ERROR: Client does not exist for this loan officer ');
      }
      if(result.clients[currentClientIndex].dispute._id != undefined){//.agentRequest == 1 ||result.clients[currentClientIndex].removeRequest.clientRequest == 1 || result.clients[currentClientIndex].removeRequest.loanOfficerRequest == 1 ){
        return callback('DB: updateDocuments: ERROR: This client has a remove request (Agent)')
      }


      var loanOfficerId = result.clients[currentClientIndex].loanOfficer._id;
      data.otherUserId = loanOfficerId;
      var emailLoanOfficer =  result.clients[currentClientIndex].loanOfficer.email;
      var nameClient=(result.clients[currentClientIndex].firstName+' '+result.clients[currentClientIndex].lastName);
      var emailData = {
          // to:emailLoanOfficer,
           to: 'sogoiii@gmail.com',
          locals:{
            state:data.state,
            checkbox:data.checkbox,
            body:checkStatus(result.firstName+ ' ' +result.lastName,data.checkbox,data.userType,data.state,nameClient),
            userType:data.userType,
            nameFL:result.firstName+ ' ' +result.lastName,
            nameClient:nameClient
          }
         };
      parallelUpdateLoanOfficerAndAgent(loanOfficerId, data.userId, data.clientId, modified, 'Updating Document Err', function(updatingErr) {
        if(!err){
           return callback(null, emailData);
        } else {
           return callback(updatingErr);
        }
      }); //end of LoanOfficerAndAgentUpdates
    }); //end of find loanofficer by Id
  } //end of update realEstate Agent
  else {
    return callback('DB: updateDocuments ERROR: do not recognize userType');
  } //end of no userType recongized
}; //end of updateDocuments





/*
 *
 */

 exports.sendAlert = function(userData, callback){

  if(userData.state == false){
    return callback(null, false);
  }

  if(userData.userType == 'realEstateAgent'){
    var scheme = loanOfficer;
  }
  else if(userData.userType == 'loanOfficer'){
    var scheme = RealEstateAgent;
  } else{
      console.log('DB: sendAlert: userType is invalid');
  }
 
  scheme.findById(userData.otherUserId,'subscribedEvents', {lean:  true}, function(err,result){
    
    console.log(result)
    if(!err && result != null){
      if(result.subscribedEvents.doc.email[userData.checkbox] == true){
        return callback(null, true)
      } else {
        return callback(null, false)
      }
    } else {
      return callback(err, null)
    };//end of else
  });
 };//end of sendAlert






/*
 * updateCommunication
 */
exports.updateCommunication = function(data, callback) { //can be simplied look at sendAlert
  console.log(data);
  var formatDate = formatDateFun();
  var newcommunication = {
    date: Date(),
    formatDate: formatDate,
    text: data.message,
    userId: data.userId,
    userType: data.userType,
    viewedByLO: false,
    viewedByAgent: false,
    userName: ''
  };

  var modified = {
    $push: {},
    $inc: {}
  };
  modified.$push['clients.$.communication'] = newcommunication;

  if(data.userType === 'loanOfficer') {
    modified.$push['clients.$.communication'].viewedByLO = true;
    modified.$inc['clients.$.agentUnseenCommunication'] = 1;
    loanOfficer.findById(data.userId, 'clients firstName lastName', function(err, result) {
      if(err) {
        return callback(err);
      }

      var currentClientIndex = getSingleClient(result.clients, data.clientId);
      if(currentClientIndex === null && currentClientIndex <= result.clients.length) { //if null or the value is not within rage of the laon officer client array
        return callback('DB: updateCommunication: ERROR: Client does not exist for this loan officer ');
      }
      //check if the anyone has requested the client to be removed
      if(result.clients[currentClientIndex].dispute._id != null){//.agentRequest == 1 ||result.clients[currentClientIndex].removeRequest.clientRequest == 1 || result.clients[currentClientIndex].removeRequest.loanOfficerRequest == 1 ){
        return callback('DB: updateCommunication: ERROR: This client has a remove request (LO)')
      }

      modified.$push['clients.$.communication'].userName = result.firstName + ' ' + result.lastName;

      var agentId = result.clients[currentClientIndex].agent._id;
      parallelUpdateLoanOfficerAndAgent(data.userId, agentId, data.clientId, modified, 'Updating Communication Err', function(updatingErr) {
        if(updatingErr) {
          return callback(updatingErr);
        } //end of if err
        return callback(null);
      }); //end of LoanOfficerAndAgentUpdates
    }); //end of find loanofficer by Id
  } //end of update communication on loan officer
  else if(data.userType === 'realEstateAgent') {
    modified.$push['clients.$.communication'].viewedByAgent = true;
    modified.$inc['clients.$.loanOfficerUnseenCommunication'] = 1;
    RealEstateAgent.findById(data.userId, function(err, result) {
      if(err) {
        return callback(err);
      }
      var currentClientIndex = getSingleClient(result.clients, data.clientId);
      if(currentClientIndex === null && currentClientIndex <= result.clients.length) { //if null or the value is not within rage of the laon officer client array
        return callback('DB: updateCommunication: ERROR: Client does not exist for this Agent ');
      }
      if(result.clients[currentClientIndex].dispute._id != null){//.agentRequest == 1 ||result.clients[currentClientIndex].removeRequest.clientRequest == 1 || result.clients[currentClientIndex].removeRequest.loanOfficerRequest == 1 ){
        return callback('DB: updateCommunication: ERROR: This client has a remove request (Agent)')
      }

      modified.$push['clients.$.communication'].userName = result.firstName + ' ' + result.lastName;
      var loanOfficerId = result.clients[currentClientIndex].loanOfficer._id;
      parallelUpdateLoanOfficerAndAgent(loanOfficerId, data.userId, data.clientId, modified, 'Updating Communication Err', function(updatingErr) {
        if(updatingErr) {
          return callback(updatingErr);
        } //end of if err
        return callback(null);
      }); //end of LoanOfficerAndAgentUpdates
    }); //end of find loanofficer by Id
  } //end of update realEstate Agent
  else {
    return callback('DB: updateCommunication: ERROR: do not recognize userType :: ');
  } //end of no userType recongized
}; //end of updateCommunication




/*
 * removeCommunicationNotification
 */
exports.removeCommunicationNotification = function(data, callback) {
 //REMOVED
}; //end of removeCommunicationNotification



/*
 * updateInstructionsMessage
 */
exports.updateInstructionsMessage = function(data, callback) {
  var starttime = (new Date()).getTime();

  loanOfficer.findById(data.userId, 'clients', function(err, officer) {
    if(!err) {
      var index = getSingleClient(officer.clients, data.clientId);
      if(index === null) {
        return callback('DB: updateInstructionsMessage: ERROR: id of client does not exist in loan officer document');
      }
      console.log('DB: updateInstructionsMessage: loanOfficerClient index = ' + index)
      if(officer.clients[index].dispute._id != null){//.agentRequest == 1 ||result.clients[currentClientIndex].removeRequest.clientRequest == 1 || result.clients[currentClientIndex].removeRequest.loanOfficerRequest == 1 ){
        return callback('DB: updateInstructionsMessage: ERROR: This client has a remove request (LO)')
      }

      if(data.step <= officer.clients[index].instructions.length) { //update existting array
        officer.clients[index].instructions[(data.step - 1)].text = data.instruction;
      } else { //is a new array element hence push
        var formatDate = formatDateFun();
        var newInstruction = {
          date: Date(),
          formatDate: formatDate,
          text: data.instruction,
          userId: data.userId,
          userType: "loanOfficer",
          completed: false,
          completedDate: ''
        };
        officer.clients[index].instructions.push(newInstruction);
      }

      officer.markModified('clients');
      updateLoanOfficerAndAgent(officer, officer.clients[index].agent._id, data.clientId, index, function(upErr) {
        if(!upErr) {
          callback(null);
        } else {
          console.log('DB: updateInstructionsMessage: ERROR: Failed to save new instruction');
          callback(upErr);
        }
      }); //end updateLoanOfficerAndAgent
    } //end of !err if
    else {
      console.log('DB: updateInstructionsMessage ERROR: ' + err);
      callback(err);
    } //end of !err else
  }); //end of findById loan officer
}; //end of updateInstructionsMessage




/*
 * updateInstructionComplete
 */
exports.updateInstructionComplete = function(data, callback) {
  //REMOVED
}; //end of updateInstructionCompletes





/*
 * requestconsultation
 */
exports.requestconsultation = function(userdata, callback) {
//REMOVED
}; //end of requestconsultation




/*
 * getConsumerLeads
 */
exports.getConsumerLeads = function(userData, callback) { //TODO: change 3 to 15//create more data

  var query = consumerLead.find({'handled' : false}).sort({userCreated: 1}).skip((userData.index-1)*3).limit(3);
  query.exec(function(err, consumers) {
    if(!err) {
      console.log('DB: getConsumerLeads: length: ' + consumers.length)
      for(var i = 0; i < consumers.length; i++) {
        var stringGraphdata = JSON.stringify(consumers[i].graphData);
        consumers[i].stringGraphdata = stringGraphdata;
      }
      return callback(null, consumers);
    } //end of if error
    else {
      console.log('DB: getConsumerLeads: ERROR: ' + err)
      return callback(err, null);
    } //end of if eror
  });
}; //end of getConsumerLeads

  


/*
 * consumerLeadsHandle
 */ 

exports.consumerLeadsHandle = function(clientId, callback){
  var modified = {
    $set: {
      'handled': true,
      'handledDate': new Date()
    }
  };
  consumerLead.update({'_id' : clientId}, modified, function(err, num){
    console.log(num)
    callback(null)
  });//end of db call

};//end of cancel consumerLeadsHandle






/*
 * grabAllBrokerLOs
 */
exports.grabAllBrokerLOs = function(callback){
  loanOfficer.find({
    'privileges': 1
  }, '_id firstName lastName', {lean: true}, function(err, results) {
    if(!err) {
      return callback(null, results);
    } //end of !err if
    else {  
      console.log('DB: grabAllBrokerLOs: ERROR: ' + err);
      return callback(err, null);
    } //end of !err else
  }); //end of findall loan officers
}; //end of grabAllBrokerLOs




/*
 * delClientFromAgent
 */
exports.delClientFromAgent = function(userData, callback){
  //REMOVED
}//end of delClientFromAgent





exports.delClientFromLO = function(userData, callback){
//REMOVED
};//end of delClientFromLO




/**
 * requestNewLoanOfficer
 */
exports.requestNewLoanOfficer = function(userData, callback){
  //remove from loan officer (if he exists)
  // console.log(DB: requestNewLoanOfficer: ' + userData); //object from form

  var reqClient = new requestClient({
    comment: userData.comment,
    type: {
      requestDeleteClient : false,
      requestNewLO: true
    },
    source: {
      client: userData.client,
      agent: userData.agent,
      loanOfficer: userData.loanOfficer,
      other: userData.other,
    },
    requester: {
      id: userData.agentId,
      userType: 'realEstateAgent', //missing name and company, that will be filled out below //also change this if lo or client
    },
    data:{
      otherReason: userData.otherReason,
      comment: userData.comment
    }
  });

  RealEstateAgent.findById(userData.agentId, 'clients disputeIds disputeCounts' ,function(reaErr, agent) {    
    if(!reaErr){
      agentClientIndex = getSingleClient(agent.clients, userData.clientId)

      //fil in reqClient
      reqClient.requester.firstName = agent.clients[agentClientIndex].agent.firstName;
      reqClient.requester.middleName = agent.clients[agentClientIndex].agent.middleName;
      reqClient.requester.lastName = agent.clients[agentClientIndex].agent.lastName;
      reqClient.requester.brokerCompany = agent.clients[agentClientIndex].agent.brokerCompany;//if agent put this line, if loan officer put loan officer. if client, put client
      reqClient.requester.cellPhone = agent.clients[agentClientIndex].agent.cellPhone
      
      if(agent.clients[agentClientIndex].loanOfficer.exists == false ){//if loan officer does not exist (hence only exists in agents page) [this should do nothing because if client has no assoicated lo, nothing should happen. the button is disabled via javascript]
        return callback(null,null);
      }//end of if loan officer does not exist or LO requsted that he remove himself from the client transaction
      
      else if(agent.clients[agentClientIndex].dispute._id != null){//if a dispute exists and the agent wants an LO, this function is called. (bascially make a request for new LO)
        //loan officer has removed the client, and now the agent requests a new LO.
          
          agent.clients[agentClientIndex].loanOfficer.exists = false;
          agent.markModified('clients');
          agent.save(function(savErrAgent) {
            if(!savErrAgent) {
              // console.log('DB: requestNewLoanOfficer: SUCCESS: Correctly saved to agent');
              return callback('emailForNewLO', agent.clients[agentClientIndex])
            } //end of !savErrAgent
            else {
              console.log('DB: requestNewLoanOfficer: ERROR: didnt save to agent:: ' + savErrAgent);
               return callback(savErrAgent, null)
            } //end of !savErrAgent
          }); //end of save  
      }//end of if clietn has a dispute already and are requesting a new LO
      else if(agent.clients[agentClientIndex].loanOfficer.exists == true){ //loan officer does exist and needs to be informed to stats update
          loanOfficer.findById(agent.clients[agentClientIndex].loanOfficer._id, 'clients disputeIds disputeCounts', function(loErr, LO){
            if(!loErr){
              var loanOfficerClientIndex = getSingleClient(LO.clients, userData.clientId)
              console.log('DB: requestNewLoanOfficer: loan officer index = ' + loanOfficerClientIndex );

              var clientDisputeObject  = {
                _id : reqClient._id,
                type:{
                  requestNewLO : reqClient.type.requestNewLO,
                  requestDeleteClient: reqClient.type.requestDeleteClient
                }
              };
              LO.clients[loanOfficerClientIndex].dispute = clientDisputeObject
              LO.disputeIds.push(reqClient._id);

              console.log('DB: requestNewLoanOfficer: -------- LO CLIENT DISPUTE')
              console.log('DB: requestNewLoanOfficer: ' +LO.clients[loanOfficerClientIndex].dispute.type)
              LO.markModified('clients');
              LO.markModified('disputeIds');
              LO.markModified('disputeCounts');
              // return callback(null); //debug line 


              //now add to agent data. Add to counts of disputes data not this dispute data
              // agent.clients[agentClientIndex].dispute = reqClient; //put the same reqClient into agent as in loan officer
              agent.clients[agentClientIndex].dispute = clientDisputeObject
              agent.clients[agentClientIndex].loanOfficer.exists = false; //need to have the state of the client change on the agent page
              agent.disputeIds.push(reqClient._id);
              var disputeCount = updateCount(userData, agent.disputeCounts); 
              if(disputeCount == null,null){ //if doen variable is null that means an error occured
                return callback('DB: requestNewLoanOfficer: ERROR: AGENT: failed to update disputeCount')
              }
              agent.disputeCounts = disputeCount;
              agent.markModified('clients');
              agent.markModified('disputeIds');
              agent.markModified('disputeCounts');

              console.log('DB: requestNewLoanOfficer: -------- AGENT CLIENT DISPUTE');
              console.log('DB: requestNewLoanOfficer: ' + agent.clients[agentClientIndex].dispute.type);// simply cannot have this here, it gives an error of "node_modules/mongoose/lib/utils.js:434 throw err; RangeError: Maximum call stack size exceeded" -- REMOVE

              reqClient.client = agent.clients[agentClientIndex];
              //save loan officer and agent and updated deleted clients page
                async.parallel({
                    one: function(cb){
                      agent.save(function(savErrAgent) {
                        if(!savErrAgent) {
                          // console.log('DB: requestNewLoanOfficer: SUCCESS: Correctly saved to agent');
                          cb(null);
                        } //end of !savErrAgent
                        else {
                          console.log('DB: requestNewLoanOfficer: ERROR: didnt save to agent:: ' + savErrAgent);
                           cb(savErrAgent);
                        } //end of !savErrAgent
                      }); //end of save
                    },//end of async function 1
                    two: function(cb){
                      LO.save(function(savErrLO) {
                        if(!savErrLO) {
                          // console.log('DB: requestNewLoanOfficer: SUCCESS: Correctly saved to loan officer');
                           cb(null);
                        } //end of !savErrLO
                        else {
                          console.log('DB: requestNewLoanOfficer: ERROR: didnt save to loan officer:: ' + savErrLO);
                           cb(savErrLO);
                        } //end of !savErrLO
                      }); //end of save
                    }, //end of async function 2
                    three: function(cb){
                      reqClient.save(function(requestClientErr){
                        if(!requestClientErr){
                          // console.log('DB: requestNewLoanOfficer: SUCCESS: Correctly saved client to deleted table')
                          cb(null)
                        }//end of !requestClientErr
                        else{
                          console.log('DB: requestNewLoanOfficer: ERROR: didnt save to deleted table')
                          cb(requestClientErr);
                        }//end of else requestClientErr
                      });//end of save to deletedClientlist
                    },//end of async function 3
                },//end of async functions
                function(allErr) {
                    // results is now equals to: {one: 1, two: 2}
                      if(!allErr) {
                        // console.log('DB: requestNewLoanOfficer: SUCCESS: Async function closed')
                        return callback(null, null);
                      } else {
                        console.log('DB: requestNewLoanOfficer: ERROR: Async function error')
                        return callback(allErr,null);
                      }
                });//end of asycn.parallel
            }//end of if no error
            else{
              console.log('DB: requestNewLoanOfficer: ERROR: failed to find loan officer. ')
              return callback(loErr)
            }//end if if error
          });//end of loan officer find by id
      }//end of if loan officer does exist
      else{ //unhandled possibility 
        console.log('DB: requestNewLoanOfficer: DB: ERROR : Unhanlded possibility' )
      }
    }//if no error finding agent
    else{
      console.log('DB: requestNewLoanOfficer: failed to find real estate agent. ')
      return callback(reaErr);//debug line
    }//else if error
  });//end of search realEstate agent
}; //end of requestNewLoanOfficer


/**
 * loanOfficerSetting
 */
exports.userSetting = function(userId,userType, callback) {
  var scheme =(userType=='RealEstateAgent')?RealEstateAgent:loanOfficer;
  scheme.findById(userId, "subscribedEvents privileges leaderId officeEmployees firstName lastName cellPhone email" , function(finderr, result) {
    if(!finderr) {
      callback(null, result);
    } //end of !finderr if
    else {
      callback(finderr, null);
    } //end of !finderr else
  }); //end of findbyID
}; //end of loanOfficerSetting

/**
 * updateSetting
 */
exports.updateSetting= function(userdata, cb){
  var scheme =(userdata.userType=='realEstateAgent')?RealEstateAgent:loanOfficer;
  var modified = {
  $set: {}
  };
  modified.$set['subscribedEvents.doc.' +userdata.eventType+'.'+ userdata.checkbox] = userdata.state;
 
 scheme.update({
        _id: new ObjectId(userdata.userId) 
      }, modified, {
        safe: {
          j: 1
        }
      }, function(err, num) {
        if(num === 0) {
          return cb('DB: updateSetting : ERROR: '+userdata.userType+' made no changes');
        }
        if(err) {
          return cb(err);
        }
        return cb(null);
      }); //end of update agent
}; // end of updateSetting


exports.clientIndex = function(clientId, callback){
//REMOVED
}//end of clientIndex



exports.existsClientAgent = function(userdata,callback){
//REMOVED
}//end of clientIndex



exports.updateClientHappyness = function(userData, callback){

  var happyness = {    
    value: userData.value,
    time: new Date(),
    comment: userData.comment
  }
  var modified = {
    $push: {}
  };
  modified.$push['clients.$.happyness'] = happyness;
  RealEstateAgent.update({'clients._id':ObjectId(userData.clientId)}, modified, function(err, num, algo){
  if(!err){
    if(num == 1){      
      return callback(null)
    }
    else{      
      return callback('no function....')
    }

  }else{
    return callback(err)
  }

  })

};// end of updateClientHappyness



exports.newBrokerLeader=function(data,callback){

//REMOVED
}//end of function new Broker Leader 








exports.addUserToGroup=function(data,callback){
//REMOVED
}//end of addUserToGroup

/*
 * todo 5165d1c90bec03ee2ece3e0f
 */
exports.getTasks = function(data,callback) {
  
  if(!data.clientName.match(new RegExp("[a-zA-Z]*")))
    callback('DB: getTasks: ERROR: clientName invalid',null)

  var exp=new RegExp("[a-zA-Z]*"+data.clientName+"[a-zA-Z]*");
  
  RealEstateAgent.find({'_id':data.agentId},{'clients':{'$elemMatch':{'tasks.clientName':{ $regex: exp, $options: 'i' }}}},function(err, results) {

    if(!err && results != null) {//&& results!=null && results.length!=0
        if(results[0].clients.length != 0){

          var newResults=[];
          for(var i=0;i<results.length;i++){
             newResults.push(results[0].clients[i]);
            }

         callback(null, results[0].clients);
        }else{
          callback('DB: getTasks: ERROR: results[0].clients possibly length 0',null)
        }
    }else {
      // console.log('DB: todo: ERROR: found no data');
      callback('DB: getTasks: ERROR: results possibly null', null);
    } //end of !err else
  }); //end of find tasks
}; //end of todo


exports.getAllTasks = function(data,callback) {
//REMOVED
}; //end of todo


/**
 * updateTask
 */


exports.updateTask= function(userdata, cb){
//REMOVED
}; // end of updateTaskS




exports.adminUnassigned = function(userData, callback){
//REMOVED
};//end of adminUnassigned



exports.updateDistributeAssignedStatus = function(userData, callback){
//REMOVED
};//end updateDistributeAssignedStatus



exports.adminUnassigned2 = function(userData, callback){
//REMOVED
};//end of adminUnassigned2

