/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http'),
  path = require('path')

  var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var mongoStore = require('session-mongoose');
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose);
var moment = require('moment');
var expressValidator = require('express-validator');
var check = require('validator').check;
var sanitize = require('validator').sanitize;
var Validator = require('validator').Validator;
Validator.prototype.error = function(msg) {
  this._errors.push(msg);
  return this;
}
Validator.prototype.getErrors = function() {
  return this._errors;
}

var parseCookie = require('connect').utils.parseCookie;

/** 
 * external files
 */
var routes = require('./routes')
var dbFun = require('./DBfunctions'); //access to the DB and other functions
var extFun = require('./extFunctions')
var CompNum = require("./ComputedNumbers");
var sendGridMail = require('./sendGridMail');



/*
 * ******************************************** Functions !!!! ***************************
 */


/**
 * grabSessionInfo
 */

function grabSessionInfo(req, res, next) {
//REMOVED
  next();
};



/**
 * ensureAuthenticated
 */

function ensureAuthenticated(req, res, next) {
//REMOVED
} //end of ensureAuthenticated



/**
 * RestirctAccess
 */

function RestirctAccess(req, res, next) {
//REMOVED
} //end of RestirctAccess


/**
 * ensureSec
 */

function ensureSec(req, res, next) {

  if (req.headers['x-forwarded-proto'] == 'https' || typeof(req.connection.encrypted) != 'undefined') {
    return next();
  } else {

    return res.redirect('https://' + req.headers.host + req.path);
  }
}



/*
 * ******************************************** SETUP !!!! ***************************
 */



/**
 * SETUP of Node application
 */


var port = process.env.PORT || 4000;
var app = express();
var server = http.createServer(app).listen(port);



// production only
if ('production' == app.get('env')) {
  console.log('APP: in production')
  var mongooseSessionStore = new mongoStore({
    url: //REMOVED
    interval: 3600000
  });
  var dbloc = //REMOVED
  var io = require('socket.io').listen(server);
}; //end of if production


if ('development' == app.get('env')) {
  console.log('APP: in development');
  var mongooseSessionStore = new mongoStore({
    url: "mongodb://localhost/ClientClassSessions",
    interval: 3600000
  });
  var dbloc = 'mongodb://localhost/ClientClass-RC1Test1'; //testing one

  //setting up https 
  var https = require('https');
  var fs = require('fs')
  var options = {
    key: fs.readFileSync('privatekey.pem'),//File REMOVED
    cert: fs.readFileSync('certificate.pem'),//File REMOVED
    ca: fs.readFileSync('ca-bundle.crt')//File REMOVED
  };

  var sslServer = https.createServer(options, app).listen(2000, function() {
    return console.log("APP: https server listening on port %d in %s mode", server.address().port, app.settings.env);
  });

  var ioSecure = require('socket.io').listen(sslServer);
}; //end of if development



app.configure(function() {
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  if ('production' == app.get('env')) {
    app.use(express.logger('tiny'));
  }
  if ('development' == app.get('env')) {
    app.use(express.logger('dev'));
  }
  app.use(express.cookieParser('this is not the original secret'));
  app.use(express.bodyParser());
  app.use(expressValidator);
  app.use(express.methodOverride());
  app.use(express.session({
    cookie: {
      maxAge: 3600000
    },
    store: mongooseSessionStore,
    secret: "Secret Client Class",
    key: 'connect.sid'
  }));
  // app.use(express.session({ cookie: {maxAge: 3600}, secret: "keysomyfather" }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(grabSessionInfo);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  // app.use(express.static(__dirname + '/public'));
  // app.use(gzippo.staticGzip(__dirname + '/public'));
  app.use(function(req, res) {
    res.render('404.jade', {
      title: '404 page'
    });
  });
}); //end of configure

var db = new dbFun.startup(dbloc);



/*
 * ******************************************** ROUTES !!!! ***************************
 */


/*
 * Static roues
 */

app.get('/', ensureSec, routes.index);
app.get('/termsandconditions', ensureSec, routes.TOS);
app.get('/privacypolicy', ensureSec, routes.privacyPolicy);
app.get('/contactUs', ensureSec, routes.contactUs);
app.post('/contactUs', ensureSec, routes.contactUsPost);
app.get('/faq', ensureSec, routes.faq);


app.get('/experimentalAnalysis', ensureSec, routes.experimentalAnalysis);
app.post('/requestconsultation', ensureSec, routes.requestConsultation);



/*
 * Register, Login , Logout,
 */
app.get('/enter', ensureSec, routes.enter);
app.post('/register', ensureSec, routes.postregister, passport.authenticate('local', {
  failureRedirect: '/enter'
}), routes.postregister2);
app.get('/confirmnewuser/:confirmCode', ensureSec, routes.confirmNewUser);

app.post('/login', ensureSec, routes.postloginCLEAN, passport.authenticate('local'), routes.postlogin);
app.get('/logout', ensureSec, routes.getlogout);

app.get('/forgotpassword', ensureSec, routes.getforgotpassword);
app.post('/forgotpassword', ensureSec, routes.postforgotpassword);
app.get('/forgotpassword/:confirmCode', ensureSec, routes.getChangePassword);
app.post('/forgotpassword/:confirmCode', ensureSec, routes.postChangePassword);

app.get('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong', ensureSec, routes.loanOfficerRegister); //temporary
app.post('/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong', ensureSec, routes.loanOfficerRegisterPost); //temporary

/**
 * Agent routes
 */


app.get('/agent/:agentId', ensureSec, ensureAuthenticated, RestirctAccess, routes.agentIndex);
app.post('/agent/:agentId/addClient', ensureSec, ensureAuthenticated, RestirctAccess, routes.addClient);
app.get('/agent/:agentId/calculator/:clientId', ensureSec, ensureAuthenticated, RestirctAccess, routes.agentClient);
app.put('/agent/:agentId/calculator/:clientId', ensureSec, ensureAuthenticated, RestirctAccess, routes.putClientPhoneNumbers);
app.del('/agent/:agentId/calculator/:clientId', ensureSec, ensureAuthenticated, RestirctAccess, routes.delClientFromAgent)
app.del('/agent/:agentId/calculator/:clientId/requestNewLoanOfficer', ensureSec, ensureAuthenticated, RestirctAccess, routes.requestNewLoanOfficer)
app.get('/agent/:agentId/setting', ensureSec, ensureAuthenticated, RestirctAccess, routes.agentSetting);
app.post('/agent/:agentId/calculator/:clientId', ensureSec, routes.agentCreateClientAccount);
app.get('/agent/:agentId/tasks', ensureSec, ensureAuthenticated, RestirctAccess, routes.tasks);
app.get('/agent/:agentId/analytics', ensureSec, ensureAuthenticated, RestirctAccess, routes.agentAnalytics)


/**
 * Loan Officer routes
 */

app.get('/loanofficer/:lenderId', ensureSec, ensureAuthenticated, RestirctAccess, routes.loanOfficerIndex);
app.get('/loanofficer/:lenderId/unassigned', ensureSec, ensureAuthenticated, RestirctAccess, routes.unassigned);
app.put('/loanofficer/:lenderId/unassigned', ensureSec, ensureAuthenticated, RestirctAccess, routes.putUnassigned);
app.get('/loanofficer/:lenderId/client/:clientId', ensureSec, ensureAuthenticated, RestirctAccess, routes.loanOfficerClient);
app.del('/loanofficer/:lenderId/client/:clientId', ensureSec, ensureAuthenticated, RestirctAccess, routes.delClientFromLO);
app.get('/loanofficer/:lenderId/setting', ensureSec, ensureAuthenticated, RestirctAccess, routes.loanOfficerSetting);

/*
 * Client routes
 */
app.get('/client/:clientId', ensureAuthenticated, RestirctAccess, routes.clientIndex);


/**
 * Admin
 */

app.get('/admin/:adminId/consumerleads/:index', ensureSec, ensureAuthenticated, RestirctAccess, routes.consumerLeads);
app.put('/admin/:adminId/consumerleads', ensureSec, ensureAuthenticated, RestirctAccess, routes.consumerLeadsPut);
app.get('/admin/:adminId/unassigned', ensureSec, ensureAuthenticated, RestirctAccess, routes.adminUnassigned)
app.put('/admin/:adminId/unassigned', ensureSec, ensureAuthenticated, RestirctAccess, routes.adminUnassignedPut)

/**
 * For testign purposes (should be commented on master)
 */

app.get('/testing', function(req, res) {
  res.render('testviews/socketChat.jade', {
    title: 'socket chat'
  });
}); //endof testing

/*
 * ******************************************** SOCKET IO ***************************
 */


/**
 * Socket IO
 */
if ('production' == app.get('env')) {
  io.configure(function() {
    // io.enable('browser client minification');  // send minified client
    // io.enable('browser client etag');          // apply etag caching logic based on version number
    // io.enable('browser client gzip');          // gzip the file
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
    io.set('log level', 1);

  }); //end of setup socket.io
} //end of if production
if ('development' == app.get('env')) {
  ioSecure.configure(function() {
    ioSecure.set("transports", ["xhr-polling"]);
    ioSecure.set("polling duration", 10);
    ioSecure.set('log level', 1);
    // io.set('authorization', function (data, accept) {
    //     // check if there's a cookie header
    //     if (data.headers.cookie) {
    //         // if there is, parse the cookie
    //         data.cookie = parseCookie(data.headers.cookie);
    //         // note that you will need to use the same key to grad the
    //         // session id, as you specified in the Express setup.
    //         data.sessionID = data.cookie['connect.sid'];
    //     } else {
    //        // if there isn't, turn down the connection with a message
    //        // and leave the function.
    //        console.log('ioSecure: user NOT AUTHOERIZED FOR SOCKET.IO');
    //        return accept('No cookie transmitted.', false);
    //     }
    //     // accept the incoming connection
    //     // console.log('ioSecure: authorization = ' +JSON.stringify(data, null,'\t'));
    //     console.log('ioSecure: user socket authorized');
    //     accept(null, true);
    // });
  });
}



var handler = function(socket) {
  /**
   * connected
   */
  socket.on('connected', function(data) {
    console.log('SOCKET: connected: data = ' + JSON.stringify(data, null, '\t'));
    console.log('SOCKET: connected: socket id = ' + socket.id);
    // data.cookie = parseCookie(data.headers.cookie);
    // data.sessionID = data.cookie['connect.sid'];
    // console.log(JSON.stringify( socket.handshake.headers.cookie,null ,'\t')) 
    // socket.join(socket.handshake.sessionID);
  }); //end of connected



  /**
   * ChangeMonthly
   */
  socket.on('ChangeMonthly', function(data) {

    CompNum.getCM(data, function(err, result) {
      if (!err) {
        socket.emit('ReturnMonthlyPayment', result);
      } //end of if
      else {
        console.log('SOCKET: ChangeMonthly: ERROR: ' + err);
        socket.emit('ReturnMonthlyPayment', result);
      } //end of else
    }); //end of getCM
  }); //end of change monthly



  /**
   * ChangeIncomeNeeded
   */
  socket.on('ChangeIncomeNeeded', function(data) {
    CompNum.incNeed(data, function(err, result) {
      if (!err) {
        socket.emit('ReturnIncomeNeeded', result);
      } //end of if
      else {
        console.log('SOCKET: ChangeIncomeNeeded: ERROR: ' + err);
        // socket.emit('ReturnMonthlyPayment', result)
      } //end of else
    }); //end of incNeed
  }); //end of ChangeIncomeNeeded



  /**
   * sendEmailAgent
   */
  socket.on('sendEmailAgent', function(data) {
    // console.log('SOCKET: sendEmailAgent: send instructions to ' + data.emailAgent)
    var emailData = {
      to: data.emailAgent,
      // to: 'sogoiii@gmail.com', //debug line
      locals: {
        email: data.emailAgent,
        nameClient: data.nameClient,
        nameLO: data.nameLO,
        instructions: data.instructions
      } //end locals
    }; //end email data
    sendGridMail.sendEmailAgent(emailData);
    socket.emit('sendEmailAgentDisableButton', true)
  })



  /**
   * updateDocuments
   */
  socket.on('updateDocuments', function(data) {
    dbFun.updateDocuments(data, function(err, emailData) {
      if (!err) {
        console.log('SOCKET: updateDocuments: saved checkmark data to db');
        dbFun.sendAlert(data, function(sendErr, sendEmail){
          if(!sendErr){
            if(sendEmail == true){
              console.log('SOCKET: updateDocuments: sent email to user:')
            } else {
              console.log('SOCKET: updateDocuments: sendEmail was false: did not send email:')
            }//end of sendEmail state conditions
          } else {
            console.log('SOCKET: updateDocuments: failed to send email because of an error')
          };//end of !sendErr
        });//end of sendAlert
      } //end of !err if
      else {
        console.log('SOCKET: updateDocuments: ERROR: ' + err);
        socket.emit('denyDocumentChange', data)
      } //end of !err else
    }); //end of updateDocuments DB
  }); //end of updateDocuments socket



  /**
   * updateCommunication
   */
  socket.on('updateCommunication', function(data) {
    // console.log('SOCKET: updateCommunication: data.message = ' + data.message);
    var v = new Validator();

    // v.sanitize('message').xss();
    v.check(data.message, 'No special characters allowed in message line: only ,.!? are allowed').regex(/^[A-Za-z0-9 .!?,]+$/);
    var errors = v.getErrors();

    if (errors.length) {
      console.log('SOCKET: updateCommunication: ERROR: erros has length')
      socket.emit('denyCommunication-badinput', errors)
    } else {
      dbFun.updateCommunication(data, function(err) {
        if (!err) {
          // console.log('mostrar data: '+JSON.stringify(data, null, '\t'))
          // console.log('SOCKET: updateCommunication: updated communication');
        } //end of !err if
        else {
          console.log('SOCKET: updateCommunication: ERROR: ' + err);
          socket.emit('denyCommunication', 'A remove request was placed')
        } //end of !err else
      }); //end of updateCommunication db
    } // end of if no errors (else)
  }); //end of updateCommunication socket



  /**
   * saveLoanOfficerInstruction
   */
  socket.on('saveLoanOfficerInstruction', function(data) {
    // console.log('SOCKET: saveLoanofficerInstruction: saving step =' + data.step + ' with message = ' + data.instruction);
    // console.log('SOCKET: saveLoanOfficerInstruction: data.message = '+JSON.stringify(data.instruction,null, '\t'));

    var v = new Validator();
    v.check(data.instruction, 'No special characters allowed in message line: only ,.!? are allowed').regex(/^[A-Za-z0-9 .!?,]+$/);
    var errors = v.getErrors();

    if (errors.length) {
      console.log('SOCKET : saveLoanOfficerInstruction: message = ' + errors);
      socket.emit('denyInstruction-badinput', errors)
    } else {
      dbFun.updateInstructionsMessage(data, function(err) {
        if (!err) {
          socket.emit('confirmSavedInstruction', data.step);
        } //end of !err if
        else {
          console.log('SOCKET: saveLoanOfficerInstruction: Error: ' + err);
          // socket.emit('confirmSavedInstruction', data.step);
          socket.emit('denyConfirmSavedInstruction', data.step)
        } //end of !err else
      }); //end of updateInstructionsMessage
    } // end of if no errors (else)
  }); //end of loanOfficerInstruction



  /**
   * loanOfficerChangedCompleted
   */
  socket.on('loanOfficerChangedCompleted', function(data) {
    if (data.instructionData == '') {
      console.log('SOCKET: loanOfficerChangedCompleted: ERROR: this checkbox has no instruction data'); //then remove checkbox
      socket.emit('denyComfirmCompleted', data, 'Instruction: cannot be mark completed for unsaved instruction');
    } //end of if not data
    else {
      dbFun.updateInstructionComplete(data, function(err) {
        if (!err) {
          // console.log('SOCKET: loanOfficerChangedCompleted: step = ' + data.state)
          socket.emit('comfirmCompleted', data);
        } //end of !err if
        else {
          console.log('SOCKET: loanOfficerChangedCompleted:ERROR ' + err);
          socket.emit('denyComfirmCompleted', data, 'Instruction: Not saved because agent has removed client');
        } //end of !err else
      }); //end of updateInstructionComplete
    } //end of else data exists
  }); // end of loanOfficerChangedCompleted



  /**
   * removeCommunicationNotification
   */
  socket.on('removeCommunicationNotification', function(data) {
    dbFun.removeCommunicationNotification(data, function(err) {
      if (!err) {
        // console.log('SOCKET: removeCommunicationNotification: succesfully removed communication alert');
      } //end of if no error
      else {
        console.log('SOCKET: removeCommunicationNotification: ERROR: ' + err);
      } //end of if err
    }); //end of removeCommunicationNotification DB call
  }); //end of removeCommunicationNotification 



  /**
   * updateAnalysis
   */
  socket.on('updateAnalysis', function(data) {
    // console.log('SOCKET: updateAnalysis: income = ' + data.income + ' debt = ' + data.debt + ' interest = ' + data.interest + ' DPMethod = ' + data.DPMethod);
    CompNum.updateAnalysis(data, function(err, results) {
      if (!err) {
        // console.log('SOCKET: updateAnalysis: (BO) - computed analysis: succesfully');
        socket.emit('updateAnalysisData', results);
      } //end of if no error
      else {
        console.log('SOCKET: updateAnalysis: ERROR: ' + err);
      } //end of if error
    }); //end of comNum updateAnlaysis Fucntion
  }); //end of socket updateAnalysis



  /**
   * changeUserSettings
   */
  socket.on('changeUserSettings', function(userData) {
    console.log('changeUserSettings was called')
    var v = new Validator();
    v.check(userData.userType).isAlpha();
    v.check(userData.userId).isAlphanumeric();
    v.check(userData.eventType).isAlpha();
    v.check(userData.checkbox).isAlphanumeric();
    v.check(userData.userId, 'userId not valid').regex(/^[0-9a-fA-F]{24}$/);

    console.log(userData);

    if (userData.eventType != 'email' && userData.eventType != 'text') {
      v.error('eventType is not email or text')
    }
    if (userData.state != true && userData.state != false) {
      v.error('state of checkbox is not true or false')
    }
    if (userData.userType != 'realEstateAgent' && userData.userType != 'loanOfficer') {
      v.error('userType is not correct')
    }

    console.log("SOCKET: changeUserSettings: userData : " + userData);
    var errors = v.getErrors(); // ['Invalid email', 'String is too small']

    if (errors.length) {
      console.log('SOCKET: changeUserSettings: ERROR: inputs not valid :' + errors)
      socket.emit('removeSettingsCheck', {
        checkbox: userData.checkbox,
        state: userData.state,
        eventType: userData.eventType
      })
    } else {
      dbFun.updateSetting(userData, function(err) {
        if (err) {
          console.log('SOCKET: changeUserSettings: ERROR: ' + err);
        } else {
          console.log('the setting was changed properly')
          socket.emit('changeUserSettingSuccess')
        }
      }); //end of updateSetting
    } //end if else no error
  }); //end of changeUserSettings



  socket.on('searchClient', function(value, agentId) {

    var getTasks;
    if (value.length == 0) getTasks = dbFun.getAllTasks
    else getTasks = dbFun.getTasks

    getTasks({
      clientName: value,
      agentId: agentId
    }, function(err, results) {

      if (!err && results.length != 0) {

        extFun.filtrarData(results, function(data) {
          socket.emit('searchClient', value, data.tasksCompleted, (data.tasks));
        })
      } else {
        socket.emit('searchClient', value, null, null);

      }; // end of else
    })
  }) //end of Socket searchClient

  socket.on('updateTaskCompleted', function(userData) {
    var getTasks;
    var v = new Validator();
    // v.check(userData.value).isAlpha();
    v.check(userData.agentId, 'agentId not valid').regex(/^[0-9a-fA-F]{24}$/);
    v.check(userData.clientId, 'clientId not valid').regex(/^[0-9a-fA-F]{24}$/);
    v.check(userData.taskId, 'taskId not valid').regex(/^[0-9a-fA-F]{24}$/);

    if (userData.checkbox != true && userData.checkbox != false) {
      v.error('state of checkbox is not true or false')
    }
    // console.log("SOCKET: updateTaskCompleted: userData : "+userData);
    var errors = v.getErrors(); // ['Invalid email', 'String is too small']
    var value = (userData.value) ? userData.value : '';
    // console.log('probando'+typeof(value))
    if (errors.length) {
      // console.log('SOCKET: updateTaskCompleted: ERROR: inputs not valid :'+errors)
      socket.emit('searchClient', value, null, null)
    } else {
      if (userData.value.length == 0) {
        getTasks = dbFun.getAllTasks
      } else {
        getTasks = dbFun.getTasks
      }
      dbFun.updateTask(userData, function(err) {
        // console.log('Socket :: '+typeof(err))
        // console.log(err)
        if (err == null) {
          // console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT:: CORRECT DB")
          getTasks({
            clientName: value,
            agentId: userData.agentId
          }, function(err, results) {
            // console.log('--------------')
            // console.log(err)

            if (!err && results.length != 0) {
              extFun.filtrarData(results, function(data) {
                socket.emit('searchClient', value, data.tasksCompleted, (data.tasks));
              })
            } else {
              // console.log('will emit searcHClient but it has an error')
              socket.emit('searchClient', value, null, null);
              // console.log()
            }; // end of else
          }) //end of err null
        } else {
          // console.log("--------------------------------------------------:: ERROR DB")
          socket.emit('denyUpdateTaskCompleted', false, userData)
        }
      }) //end of dbFun.updateTask
    } //end of check errors
  }) //end of Socket updateTaskCompleted


  socket.on('addUserToGroup',function(data){
    // console.log(data)
    // return false

    var v= new Validator();
    v.check(data.userId, 'agentId not valid').regex(/^[0-9a-fA-F]{24}$/);
    v.check(data.email, 'Email is invalid').isEmail();
    var errors = v.getErrors();
    if(!(errors.length)){
      dbFun.addUserToGroup(data,function(err,result){
        if(!err){
          if(result == false){//means no changes made, need to send email to user
              var emailData = {
                // to: data.email,
                to: 'sogoiii@gmail.com', //debug line
                locals: data
              }; //end email data
              console.log(emailData)
              // sendGridMail.sendAddAgents(emailData);
              socket.emit('addUserToGroup',data.email);
          } else if(result == true){//true means the user exists in officeEmployees
            socket.emit('errorAddUserToGroup', "The user with email " + data.email + " is already part of your group.")
          } else { //else i added the user to the DB
            socket.emit('addUserToGroup',result);
          };//end of result== false conditions
        }else{
          if(result == false){
            return socket.emit('errorAddUserToGroup', err);
          }

          return socket.emit('errorAddUserToGroup',"Could not complete the operation try again later.");
        }
      })//end of function DB:getAgents
    } else {
      socket.emit('errorAddUserToGroup',"Could not process the request");
    };//end of if errors
  })//end of addUserToGroup

socket.on('changePrivileges',function(data){
  // console.log(data)

  var v = new Validator();
    // v.sanitize('message').xss();
    v.check(data.groupName, 'No special characters allowed in message line: only ,.!? are allowed').regex(/^[A-Za-z0-9 .!?,]+$/);
    v.check(data.companyName, 'No special characters allowed in message line: only ,.!? are allowed').regex(/^[A-Za-z0-9 .!?,]+$/);
    // v.check(data.securityMessage, 'No special characters allowed in message line: only ,.!? are allowed').regex(/^[A-Za-z0-9 .!?,]+$/);
    v.check(data.userId, 'agentId not valid').regex(/^[0-9a-fA-F]{24}$/);
    var errors = v.getErrors();
    // console.log("sss")
    // console.log(errors)

    data.groupName = extFun.toCapitalLetter(data.groupName)
    if(!(errors.length)){   
      dbFun.newBrokerLeader(data,function(err,result){
        console.log(err)
        console.log(result)

          if(!err){
            if(result != null){
              if(typeof(result)=="object"){
                socket.emit('changePrivileges',result);
              }else{

                console.log("groupName Exist!")
                socket.emit('errorChangePrivileges','groupName Exist!');
              }
            }else{

              console.log("Your input company name does not match. Please the correct name of the company")
              socket.emit('errorChangePrivileges','Your input company name does not match. Please the correct name of the company');
            }
          }else{
            if(result == false){
              return socket.emit('errorChangePrivileges',err);
            }
            socket.emit('errorChangePrivileges','Could not complete the operation try again later.');
          }





      })//end of newBrokerLeader
    }else{
      console.log("SOCKET: changePrivileges: ERROR: Please enter valid data")
      return socket.emit('errorChangePrivileges','Please enter valid data: Your company name must be the same you registered with.');
    }//end of extFun.filtrar
  })//end of changePrivileges




} //end of all socket.io functions 



/*
 * ******************************************** SERVER CREATIN END !!!! ***************************
 */


if ('production' == app.get('env')) {
  io.sockets.on('connection', handler); //end of socket.io
}
if ('development' == app.get('env')) {
  ioSecure.sockets.on('connection', handler); //end of socket.io
}

// console.log('APP: app.settings.evn = ' +app.settings.env )
// console.log('process.env.NODE_ENV = ' + process.env.NODE_ENV)

server.listen(function() {
  console.log("APP: http server listening on port %d in %s mode", server.address().port, app.settings.env);
});