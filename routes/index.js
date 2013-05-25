/**
 * Module dependencies.
 */

var passport = require('passport');
var moment = require('moment');
var async = require('async');
var bcrypt = require('bcrypt');
var jade = require('jade');
var fs = require('fs');
var Validator = require('validator').Validator;
var check = require('validator').check,
  sanitize = require('validator').sanitize
  Validator.prototype.error = function(msg) {
    this._errors.push(msg);
    return this;
  }
Validator.prototype.getErrors = function() {
  return this._errors;
}


/** 
 * external files
 */

var dbFun = require('../DBfunctions'); //access to the DB and other functions
var extFun = require('../extFunctions')
var sendGridMail = require('../sendGridMail');

/*
 * ******************************************** Functions ***************************
 */


function stripToNumbers(stringNumber){
  return stringNumber.replace(/[^0-9]/g, '');
}



/*
 * ******************************************** STATIC PAGES ***************************
 */



/*
 * GET index
 */
exports.index = function(req, res) {
  res.render('index.jade', {
    title: 'index'
  });
}; //end of index



/**
 * TOS
 */
exports.TOS = function(req, res) {
  res.render('static/TOS.jade', {
    title: 'Terms and Conditions'
  });
}; //end of TOS



/**
 * privacyPolicy
 */
exports.privacyPolicy = function(req, res) {
  res.render('static/privacyPolicy.jade', {
    title: 'Privacy Policy'
  });
}; //end of privacyPolicy

/**
 * contactUs
 */
exports.contactUs = function(req, res) {
  var contactErrors = req.session.contactErrors;
  req.session.contactErrors = '';
  res.render('static/contactUs.jade', {
    title: 'Contact Us',
    contactErrors: contactErrors
  });
}; //end of contactUs

/**
 * contactUsPost
 */
exports.contactUsPost = function(req, res) {
  req.assert('email', 'email: Enter correct email').isEmail();
  req.assert('subject', 'subject: Subject line cannot be empty').notEmpty();
  req.assert('body', 'Body: Please write something').notEmpty();

  req.assert('subject', 'No special characters allowed in subject line: only ,.!? are allowed').regex(/^[A-Za-z0-9 .!?,]+$/);
  req.assert('body', 'No special characters allowed in body: only ,.!? are allowed').regex(/^[A-Za-z0-9 .!?,]+$/);

  req.sanitize('subject').xss();
  req.sanitize('subject').entityDecode();

  req.sanitize('body').xss();
  req.sanitize('body').entityDecode();
  // console.log('router: contactUsPost: req.body.body = '+ req.body.body)

  var contactErrors = req.validationErrors();
  // console.log('router: contactUsPost: contact errors ' + contactErrors)
  if (contactErrors.length) {
    req.session.contactErrors = contactErrors;
    console.log('router: contactUsPost: routes: error with inputs')
    res.redirect(302, 'back')
  } else {
    // console.log('router: contactUsPost: '+req.body)
    res.redirect(302, 'back');
  }
}; // end of contactUsPost



/**
 * faq
 */
exports.faq = function(req, res) {
  // res.redirect(400, '/')
  res.render('static/FAQ.jade', {
    title: 'Faq'
  });
}; //end of faq



/**
 * experimentalAnalysis
 */
exports.experimentalAnalysis = function(req, res) {
  var errorsRequestConsultation = req.session.errorsRequestConsultation;
  if (req.session.requestSuccessfull) {
    var congrats = 'you will receive an email'; //message shown on user page
  }
  req.session.requestSuccessfull = '';
  req.session.errorsRequestConsultation = '';
  res.render('directClientAnalysis.jade', {
    title: 'Experimental',
    errorsRequestConsultation: errorsRequestConsultation,
    imageBackground: true,
    congrats: congrats
  });
}; //end of experimentalAnalysis



/**
 * requestConsultation
 */
exports.requestConsultation = function(req, res) {
  console.log('router: requestconsultation Consumer Data = ' + JSON.stringify(req.body, null, '\t'));

  if (req.body.formGraphData.length == 0 || typeof(req.body.formGraphData) == 'undefined') {
    var errorsRequestConsultation = [{
      msg: 'empty graph data'
    }];
    req.session.errorsRequestConsultation = errorsRequestConsultation;
    return res.redirect(400, '/experimentalAnalysis')
  }

  var formGraphDataObj = JSON.parse(req.body.formGraphData);
  req.body.formGraphDataObj = formGraphDataObj;

  req.assert('formIncome', 'Please answer if you have an agent or not').notNull();
  req.assert('formDebt', 'Please answer if you have an agent or not').notNull();
  req.assert('formInterest', 'Please answer if you have an agent or not').notNull();

  req.assert('hasAgent', 'Please answer if you have an agent or not').notNull();
  req.assert('wantsUs', 'Do you want us to help you get you a home?').notNull();
  req.assert('firstName', 'First name: enter only be alpha charaters').isAlpha();
  req.assert('lastName', 'Last name: enter only be alpha charaters').isAlpha();
  req.assert('cellPhone', 'Cell phone: enter only be numbers, spaces, dashes, and parenthases').regex(/^[0-9 ()-]+$/);
  req.sanitize('consumerEmail').trim();
  req.assert('consumerEmail', 'Email: enter valid email').isEmail();

  var errorsRequestConsultation = req.validationErrors();

  req.session.errorsRequestConsultation = errorsRequestConsultation;
  console.log('router: requestConsultation: errorsRequestConsultation = ' + errorsRequestConsultation);
  if (errorsRequestConsultation.length) {
    res.redirect(400, '/experimentalAnalysis');
  } else {
    dbFun.requestconsultation(req.body, function(err, results) {
      if (!err) {
        console.log('router: requestConsultation: added consumer');
        req.session.requestSuccessfull = true;
        res.redirect(302, '/experimentalAnalysis');
        console.log('router: requestConsultation: will send email to ' + req.body.consumerEmail)

        var consumerName = req.body.firstName + ' ' + req.body.lastName;
        var emailData = {
          to: req.body.consumerEmail, //should be req.body.email //was sogoiii@gmail.com for debuggin
          // to: 'sogoiii@gmail.com',
          locals: {
            clientName: consumerName
          }
        };
        sendGridMail.sendClientAnalysisRequest(emailData);
      } //end of if no error
      else {
        console.log('router: requestConsultation: ERROR: ' + err);
        req.session.requestSuccessfull = false;
        res.redirect(400, '/experimentalAnalysis');
      } //end of if error exists
    }); //end of requestConsultation DB call
  } //end of else inputs are fine
}; //end of requestConsultation function



/*
 *  consumerLeads
 */
exports.consumerLeads = function(req, res) {
  var index = parseInt(req.params);
  var v = new Validator();
  v.check(req.params.index, 'index should be a number').regex(/^[0-9]$/);
  var errors = v.getErrors();

  // console.log('router: consumerLeads: errors = ' + errors.length)
  if (errors.length) {
    return res.redirect(302, '/consumerLeads/1');
  }

  async.parallel([

  function(cb) {
    //REMOVED
  },

  function(cb) {
    //REMOVED
  }],

  function(allErrors, allResults) {
      //REMOVED

  });
}; //end of consumerLeads





exports.consumerLeadsPut = function(req, res){

  console.log(req.body)
  // return res.redirect('/consumerleads/1')

  dbFun.consumerLeadsHandle(req.body.clientId, function(err){
    if(!err){
      return res.redirect('back')
    } else {
      return res.redirect('/')
    }
  });//end of db consumerleadshandle
};//end of consumerleads





/*
 * ******************************************** Loging, Register, Logout !!!! ***************************
 */



/*
 * GET enter
 */
exports.enter = function(req, res) {
  //REMOVED
  res.render('scriptPages/enter.jade', {
    title: 'Enter',
    errorsRegister: errorsRegister,
    errorsLogIn: errorsLogIn,
    confirmEmail: confirmEmail,
    confirmChangePassword: confirmChangePassword
  });
}; //end of enter



/*
 * get getforgotpassword
 */
exports.getforgotpassword = function(req, res) {
  console.log('router: getforgotpassword: errorData: ' + req.session.errorData)
  var errorData = req.session.errorData;
  req.session.errorData = '';
  res.render('scriptPages/forgotpassword.jade', {
    title: 'forgotpassword',
    EmalingMessage: false,
    errorData: errorData
  });
}; //end of getforgotpassword

/*
 * get postforgotpassword
 */
exports.postforgotpassword = function(req, res) {
  console.log('userType = ' +req.body.userType )
  if (req.body.userType === 'realEstateAgent' || req.body.userType === 'loanOfficer' || req.body.userType === 'client') {
    dbFun.findEmail(req.body, function(err, confirmCode) {
      if (!err) {
        console.log('router: postforgotpassword: will be sent to - > ' + req.body.email);
        // res.redirect(200,'/forgotpassword');      
        var errorData = req.session.errorData;
        req.session.errorData = false;
        res.render('scriptPages/forgotpassword.jade', {
          title: 'forgotpassword',
          EmalingMessage: true,
          errorData: errorData
        });
        var emailData = {
          to: req.body.email,
          locals: {
            confirmCode: encodeURIComponent(confirmCode)
          }
        };
        sendGridMail.sendRequestLostEmail(emailData);
      } else {
        // req.session.errorData = true; 
        req.session.errorData = true;
        console.log('router: postforgotpassword: ERROR : ' + err);
        res.redirect('/forgotpassword');
      }
    }); //end of forgotpassword DB      
  } //end of if user type is correct
  else {
    req.session.errorData = true;
    console.log('router: postforgotpassword: Entered userType == ' + req.body.userType);
    return res.redirect(400, '/forgotpassword'); //exit this function after res.redirect
  } //end of if user type does not match
}; //end of postforgotpassword



/*
 * getChangePassword
 */
exports.getChangePassword = function(req, res) {
  var errorsChangePassword = req.session.errorsChangePassword;
  req.session.errorsChangePassword = '';
  dbFun.getChangePassword(req.params.confirmCode, function(err) {
    if (!err) {
      var confirmChangePasswordError = req.session.confirmChangePasswordError;
      req.session.confirmChangePasswordError = '';
      console.log('router: getChangePassword: ok for this user to change their password');
      res.render('scriptPages/changepassword.jade', {
        title: 'Change password',
        allowChange: true,
        confirmCode: encodeURIComponent(req.params.confirmCode),
        errorsInput: errorsChangePassword,
        confirmChangePasswordError: confirmChangePasswordError
      });
    } else {
      console.log('router: getChangePassword :ERROR : ' + err);
      res.render('scriptPages/changepassword.jade', {
        title: 'Change password',
        allowChange: false
      });
    }
  }); //end of getChangePassword DB call
}; //end of getChangePassword



/*
 * postChangePassword
 */
exports.postChangePassword = function(req, res) {
  req.assert('email', 'Email: enter valid email').isEmail();
  if (req.body.password !== req.body.confirmPassword) { //passwords are not the same
    res.redirect('back');
  }
  var errorsRegister = req.validationErrors();
  req.session.errorsChangePassword = errorsRegister;
  if (errorsRegister.length) {
    res.redirect(400, 'back');
  } else {
    console.log('Entro a la funcion SaveChangedPassword')
    dbFun.SaveChangedPassword(req.body, req.params.confirmCode, function(err) {
      if (!err) {
        req.session.confirmChangePassword = true;
        console.log('routes: postChangePassword: user succesfully changed password!')
        res.redirect(302, '/enter');
      } //end if no error saving new password
      else {
        req.session.confirmChangePasswordError = true;
        console.log('routes: postChangePassword: ERROR: ' + err);
        res.redirect('back');
      } //end if problem saving new password
    }); //end of SaveChangedPassword
  } //end of else if no errors validation input data
}; // end of postChangePassword



/*
 * POST register
 */
exports.postregister = function(req, res, next) {

  req.sanitize('firstName').trim();
  req.sanitize('lastName').trim();
  req.sanitize('email').trim();
  req.sanitize('confirmEmail').trim();
  req.sanitize('password').trim();
  req.sanitize('companyName').ltrim();
  req.sanitize('companyName').rtrim();

  req.assert('firstName', 'First name: enter only be alpha charaters').isAlpha();
  req.assert('lastName', 'Last name: enter only be alpha charaters').isAlpha();
  req.assert('email', 'Email: enter valid email').isEmail();
  req.assert('confirmEmail', 'confirmEmail: enter valid email').isEmail();
  req.assert('password', 'password: enter a password').notEmpty();
  req.assert('cellPhone', 'Cell phone: enter only be numbers, spaces, dashes, and parenthases').regex(/^[0-9 ()-]+$/);

  req.assert('companyName', 'Company name: cannot be empty').notEmpty();
  req.assert('companyName', 'Company name: enter only be alphanumeric charaters and spaces').regex(/^[A-Za-z0-9 ]/g);

  req.assert('companyPhone', 'Company phone: cannot be empty').notEmpty();
  req.assert('companyPhone', 'Company phone: enter only be numbers, spaces, dashes, and parenthases').regex(/^[0-9 ()-]+$/);

  req.assert('TOS', 'Terms of Service must be accepted').equals('on');

  req.body.firstName = req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1).toLowerCase();
  req.body.lastName = req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1).toLowerCase();

  var errorsRegister = req.validationErrors();

  req.session.errorsRegister = errorsRegister;
  if (errorsRegister.length) {
    res.redirect(400, '/enter');
  } else {
    req.session.errorsRegister = '';
    dbFun.registerNewAgent(req.body, function(err, results) {
      if (!err) {
        req.session.confirmEmail = true;
        res.redirect(302, '/enter');
        console.log('router: postregister: confimCode = ' + encodeURIComponent(results));
        console.log('router: postregister: sending email to ' + req.body.email)
        var emailData = {
          to: req.body.email, //should be req.body.email //was sogoiii@gmail.com for debuggin
          // to: 'sogoiii@gmail.com',
          locals: {
            confirmCode: encodeURIComponent(results)
          }
        };
        sendGridMail.sendConfirmRegisterEmail(emailData);
      } //end of !err if
      else {
        // console.log('router: postRegister: Error: ' + err);
        if (err == 'MongoError: E11000 duplicate key error index: ClientClass-RC1Test1.realestateagents.$email_1  dup key: { : "' + req.body.email + '" }') { //must find a better way to detect this
          console.log('router: postRegister: ERROR: ' + err)
          req.session.errorsRegister = [{
            msg: 'That email exists'
          }];
          res.redirect(400, '/enter');
          //res.render('scriptPages/enter.jade', {title: 'err duplicate exists'}); //user exists, may not want ot say this,i could be attacked to check who exists in DB.
        } else {
          req.session.errorsRegister = [{
            msg: 'Unknown server error. Please contact us'
          }];
          console.log('router: postRegister: ERROR: ' + err)
          res.redirect(400, '/enter');
          //res.render('scriptPages/enter.jade', {title: 'err: entry was not an email'}); //input was not an email
        }
        // res.render('register.jade', {title: err});
      } //end of !err else
    }); //end of registerRealEstateAgent
  } //end of errors else
}; //end post register



/*
 * POST register2
 */
exports.postregister2 = function(req, res) { //user has registered and can enter the page
  //REMOVED
  res.redirect('/agent/' + req.user._id); //after authentication is done, enter user setupclass
}; //end of post register 2.



/*
 * confirmNewUser
 */
exports.confirmNewUser = function(req, res) {
  dbFun.confirmNewUser(req.params.confirmCode, function(err) {
    if (!err) {
      res.render('scriptPages/confirmNewUser.jade', {
        title: 'confirm new user',
        confirmation: true
      });
    } //end of !err
    else {
      console.log('router: confirmNewUser: ERROR: ' + err);
      res.render('scriptPages/confirmNewUser.jade', {
        title: 'confirm new user FAILED!!!!!',
        confirmation: false
      });
    } //end of !err else
  }); //end of confirmNewUser DB
}; //end of confirmNewUser 



/*
 * GET loanOfficerRegister
 */
exports.loanOfficerRegister = function(req, res) {
  var errorsRegister = req.session.errorsRegister;
  req.session.errorsRegister = '';
  res.render('loanOfficer/loanOfficerRegister.jade', {
    title: 'loanOfficerRegister',
    errorsRegister: errorsRegister,
    message: null
  });
}; // end of loanOfficerRegister



/*
 * POST loanOfficerRegisterPost
 */
exports.loanOfficerRegisterPost = function(req, res) {

  req.sanitize('firstName').trim();
  req.sanitize('lastName').trim();
  req.sanitize('email').trim();
  req.sanitize('confirmEmail').trim();
  req.sanitize('password').trim();

  req.assert('firstName', 'First name: cannot be empty').notEmpty();
  req.assert('firstName', 'First name: enter only be alpha charaters').isAlpha();
  req.assert('lastName', 'Last name: cannot be empty').notEmpty();
  req.assert('lastName', 'Last name: enter only be alpha charaters').isAlpha();

  req.assert('email', 'Email: enter valid email').isEmail();
  req.assert('confirmEmail', 'ConfirmEmail: enter valid email').isEmail();
  req.assert('password', 'Password: enter a password').notEmpty();
  req.assert('cellPhone', 'Cell phone: enter only be numbers, spaces, dashes, and parenthases').regex(/^[0-9 ()-]+$/);

  req.assert('NMLSID', 'NMSL: cannot be empty').notEmpty();
  req.assert('NMLSID', 'NMSL: input value included non numbers').isInt();

  console.log('loanofficer register post: NMLSID = ' + req.body.NMLSID)

  req.assert('NMLSID', 'NMSL: enter a valid NMLS ID').len(6);
  req.body.firstName = req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1).toLowerCase();
  req.body.lastName = req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1).toLowerCase();

  var errorsRegister = req.validationErrors();

  req.session.errorsRegister = errorsRegister;
  if (errorsRegister.length) {
    res.redirect(400, '/loanOfficer-mysupersecretstringthatnooneshouldevertypeinbecausewhywouldtheytypesomethingthislong');
  } else {
    req.session.errorsRegister = '';
    dbFun.registerNewLoanOfficer(req.body, function(err, results) {
      if (!err) {
        // res.render('loanOfficer/loanOfficerRegister.jade', {title: 'loanOfficerRegister', errors: null, message: 'Congrates, you created a new Loan Officer'});
        req.session.confirmEmail = true;
        res.redirect(200, '/enter');
        // console.log('router: loanOfficerRegisterPost: confirmcode for LO = ' + encodeURIComponent(results) );
        // console.log('router: loanOfficerRegisterPost: send confirm to = ' + req.body.email);
        var emailData = {
          to: req.body.email, //should be req.body.email //was sogoiii@gmail.com for debugging
          // to: 'sogoiii@gmail.com',
          locals: {
            confirmCode: encodeURIComponent(results)
          }
        };
        sendGridMail.sendConfirmRegisterEmail(emailData);
      } //end of !err if
      else {
        console.log('router: loanOfficerRegisterPost: ERROR: ' + err);
        res.redirect(500, 'back')
        // res.render('loanOfficer/loanOfficerRegister.jade', {title: 'loanOfficerRegister', errors: err, message: 'failed to register Loan Officer'});
      } //end of !err else
    }); //end of registernewLoanOfficer
  } //end of else no validation errors
}; // end of loanOfficerRegister



/*
 * POST Login CLEAN
 */
exports.postloginCLEAN = function(req, res, next) { //check if the input values are alright

  req.assert('email', 'email: enter email').isEmail();
  req.assert('password', 'password: enter a password').notEmpty();
  req.sanitize('email').trim();
  req.sanitize('password').trim();
  var errorsLogIn = req.validationErrors();
  req.session.errorsLogIn = errorsLogIn;

  console.log('router: postloginCLEAN: length of errors = ' + errorsLogIn.length);
  if (errorsLogIn.length) {
    res.redirect(422, '/enter');
  } else {
    console.log('router: postloginCLEAN: will now authenticate user')
    next();
  }
} //end of postloginCLEAN



/*
 * POST Login
 */
exports.postlogin = function(req, res) { //right before redirecting to page
  if (req.user.confirmed == true) {
    //REMOVED

    if (req.user.userType == 'realEstateAgent') {
      res.redirect(302, '/agent/' + req.user._id);
    } else if (req.user.userType == 'loanOfficer') {
      console.log('router: postlogin: HAS AUTHENTICATE USER')
      res.redirect(302, '/loanOfficer/' + req.user._id);
    } else if (req.user.userType == 'client') {
      console.log('router: post loign 2 : will login as client')
      res.redirect(302, '/client/' + req.user._id)
    } else if (req.user.userType == 'adminClientClassifier'){
      console.log('router: loging in as admin');
      res.redirect(302, '/admin/' + req.user._id + '/unassigned')
    } else if (req.user.userType == 'client'){
      console.log('router: loging in as client');
      res.redirect(302, '/client/' + req.user._id )
    } else {
      console.log('router: postlogin: user was confirmed, but has no userType')
      res.redirect(406, '/enter');
    }
  } //end if confirmed == true if
  else {
    console.log('router: postlogin: user has not been confirmed, hence block entrance');
    req.session.errorsLogIn = [{
      msg: 'Check your email inbox for a confirmation link'
    }];
    res.redirect(400, '/enter');
  } //end of else user is not confirmed yet
}; //end of postlogin



/*
 * GET logout
 */
exports.getlogout = function(req, res) {
  console.log('getLogout was called')
  req.session.destroy()
  console.log(JSON.stringify(req.session, null, '\t'))
  req.logout()
  res.redirect('/')
}; //end getlogout


/*
 * ******************************************** AGENT ROUTES!!!! ***************************
 */

/*
 * Agent Index
 */
exports.agentIndex = function(req, res) {

  var inputErrors = req.session.inputErrors;
  req.session.inputErrors = '';

  var v = new Validator();

  v.check(req.params.agentId, 'agentId not Number').regex(/^[0-9a-fA-F]{24}$/);
  var errors = v.getErrors();
  if (errors.length == 0) {
    dbFun.getSelf(req.params.agentId, function(err, result) {
      if (!err) {
        //REMOVED
        res.render('agent/agentIndex.jade', {
          title: 'agentIndex',
          totCommissions: result.totCommissions,
          agent: result,
          clients: result.clients,
          currentClientId: null,
          inputErrors: inputErrors
        });
      } //end of !err if
      else {
        console.log('router: agentIndex: failed to load agent user = ' + req.params.agentId);
        res.redirect('/');
      } //end of !err else
    }); //end of getSelf
  } else {
    res.redirect(400, '/')
  }
}; //end of agentIndex



/*
 * addClient
 */
exports.addClient = function(req, res) {
  console.log(req.body)
  req.assert('firstName', 'First name only be alpha charaters').isAlpha();
  req.assert('lastName', 'Last name only be alpha charaters').isAlpha();
  // req.assert('clientConfirm', 'Client confirmation must be checked').equals('on');

  req.sanitize('firstName').trim();
  // req.sanitize('firstName').rtrim();
  req.sanitize('lastName').trim();
  // req.sanitize('lastName').rtrim();
  req.body.firstName = req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1).toLowerCase();
  req.body.lastName = req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1).toLowerCase();
  if (req.body.middleName != '') {
    console.log('middle name has stuff')
    req.assert('middleName', 'Middle name only be alpha charaters').isAlpha();
    req.sanitize('middleName').trim();
    req.body.middleName = req.body.middleName.charAt(0).toUpperCase() + req.body.middleName.slice(1).toLowerCase();
    // req.sanitize('middleName').rtrim();
  }

  var errors = req.validationErrors();
  console.log('router: addClient: errors = ' + JSON.stringify(errors, null, '\t'))
  req.session.inputErrors = errors;
  if (errors.length) {
    res.redirect('/agent/' + req.params.agentId);
  } else {
    req.session.inputErrors = '';
    req.body.agentId = req.params.agentId; //to know which client this associated with
    dbFun.addNewClient(req.body, function(err, clientId) {
      if (!err) {
        //REMOVED
        res.redirect('/agent/' + req.params.agentId + '/calculator/' + clientId);
      } //end of !err if
      else {
        console.log('router: addClient: whoops, encountered error while saving Client');
        res.redirect('back');
      } //end of !err else
    }); //end of addNewClient
  } //end of errors else
}; //end of addClient



/*
 * GET agentClient
 */
exports.agentClient = function(req, res) {
  // console.log('req.params'+JSON.stringify(req.params, null, '\t'))  
  var v = new Validator();
  v.check(req.params.agentId, 'agentId not valid').regex(/^[0-9a-fA-F]{24}$/);
  v.check(req.params.clientId, 'clientId not valid').regex(/^[0-9a-fA-F]{24}$/);
  var errors = v.getErrors();
  if (errors.length == 0) {
    dbFun.getOnlyClientNames(req.params, function(err, result) {
      if (!err) {
        //REMOVED
        res.render('agent/agentClient.jade', {
          title: 'client Calculator version',
          clients: result.clients, //for sidebar                                                                        
          calcData: result.clients[result.index].calculator, //caluclator 
          currentClientId: req.params.clientId, //to identify who this client is
          currentClient: result.clients[result.index], //all data in regard to this client (maybe remove currentClientId)
          clientPhoneErrors: clientPhoneErrors,
          contactErrors: contactErrors, //add jhon
          confirmEmailClient: confirmEmailClient, //add jhon  
          confirmEmailClienError: confirmEmailClienError, //add jhon    
          totCommissions: result.totCommissions
        }); //end of render
      } //end of !err if
      else {
        console.log('router: agentClient: ERROR:' + err); // failed to load agent user = ' + req.params.agentId
        res.redirect('/');
      } //end of !err else
    }); //end of getOnlyClientNames
  } else {
    res.redirect(302, '/')
  }
}; // end agentClient


/**
 * agentCreateClientAccount
 */
exports.agentCreateClientAccount = function(req, res) {

  console.log('router: agentClientPost: ' + JSON.stringify(req.body, null, '\t'))
  console.log('router: agentClientPost: email: ' + JSON.stringify(req.body.email, null, '\t'))
  // return res.redirect('back')

  req.assert('email', 'email: Enter correct email').isEmail();
  var contactErrors = req.validationErrors();
  // console.log('router: agentClientPost: contact errors ' + contactErrors)
  if (contactErrors.length) {
    req.session.contactErrors = contactErrors;
    console.log('router: agentClientPost: routes: error with inputs')
    res.redirect(400, 'back')
  } else {
    dbFun.agentCreateClientAccount(req.body.email, req.body, function(err, results) {
      if (!err) {
        req.session.confirmEmailClient = true;
        console.log('succesfully created client')
        res.redirect(302, 'back');
        console.log('vamas a mandar email a = ' + req.body.email)
        var emailData = {
          // to: req.body.email, 
          to: 'jhonsy_72@hotmail.com', //lo utilice para la prueba
          locals: results
        };
        sendGridMail.sendConfirmRegisterEmailClient(emailData);
      } //end of ir !err
      else {
        req.session.confirmEmailClienError = true;
        console.log('router: agentCreateClient: failed to create client: ' + err)
        res.redirect('back');
      }
    }); // end of dbfun 
  } //end of else no error
}; // end of agentCreateClientAccount





/*
 * putClientPhoneNumbers
 */
exports.putClientPhoneNumbers = function(req, res) {

  req.assert('clientCellPhone', 'ClientPhone is required: Phone can only contain numbers, spaces, dashes, and parenthases').regex(/^[0-9 ()-]+$/);
  req.assert('clientConfirm', 'Client confirmation must be checked').equals('on');
  if (req.body.clientHomePhone != '') {
    req.assert('clientHomePhone', 'Phone can only contain numbers, spaces, dashes, and parenthases').regex(/^[0-9 ()-]+$/);
  }

  var errors = req.validationErrors();
  req.session.ClientPhoneErrors = errors;

  if (errors.length) {
    res.redirect(400, 'back');
  } //end of if errors exist
  else {
    req.session.ClientPhoneErrors = ''
    dbFun.putClientPhoneNumbers(req.body, function(err, clientInfo) {
      if (!err) {
        res.redirect('back');
        //REMOVED
      } //end of !err if
      else {
        console.log('router: putClientPhoneNumbers: ' + err);
        res.redirect(500, 'back')
      } //end of !err else
    }); //end of putClientPhoneNumbers DB
  } //end of else no errors
}; // end of putClientPhoneNumbers 



/*
 * delClientFromAgent
 */
exports.delClientFromAgent = function(req, res) {

  req.sanitize('otherReason').trim();
  req.sanitize('otherReason').xss();
  req.sanitize('otherReason').entityDecode();
  req.sanitize('comment').trim();
  req.sanitize('comment').xss();
  req.sanitize('comment').entityDecode();

  if (req.body.otherReason.length == 0) { //otherReason is not required. if i leave this in then if empty, it will return error.
    req.assert('comment', 'No special characters allowed').regex(/^[A-Za-z0-9 .!?,]+$/);
  }
  if (req.body.comment.length == 0) {
    req.assert('otherReason', 'Other reason can only be have alphanumeric characters and punctuation').regex(/^[A-Za-z0-9 .!?,]+$/);
  }

  if (req.body.optionsRadios == 'clientDispute') {
    // console.log('router: delClientFromAgent: 1')
    req.body.client = true;
    req.body.loanOfficer = false;
    req.body.agent = false;
    req.body.other = false;
  } else if (req.body.optionsRadios == 'loanOfficerDispute') {
    // console.log('router: delClientFromAgent: 2')
    req.body.client = false;
    req.body.loanOfficer = true;
    req.body.agent = false;
    req.body.other = false;
  } else if (req.body.optionsRadios == 'otherDispute') {
    // console.log('router: delClientFromAgent: 3')
    req.body.client = false;
    req.body.loanOfficer = false;
    req.body.agent = false;
    req.body.other = true;
  } else {
    console.log('router: delClientFromAgent: ERROR: html modified by user');
    res.redirect(301, '/agent/' + req.body.agentId);
  }

  var errors = req.validationErrors();
  console.log('router: delClientFromAgent: number of errors = ' + errors.length)
  if (errors.length > 0) {
    res.render('404.jade', {
      title: '404 page'
    });
  } else {
    dbFun.delClientFromAgent(req.body, function(err) {
      if (!err) {
        res.redirect(301, '/agent/' + req.body.agentId);
      } else {
        console.log('router: delClientFromAgent:  ERROR: ' + err)
        res.redirect('back')
      } //end of else error
    }) //end of delClientFromAgent
  } //else no input errors
}; // end of delClientFromAgent



/*
 * delClientFromLO
 */
exports.delClientFromLO = function(req, res) {
//REMOVED
}; //end of delClientFromLO



/**
 * requestNewLoanOfficer
 */
exports.requestNewLoanOfficer = function(req, res) {

  req.sanitize('otherReason').trim();
  req.sanitize('otherReason').xss();
  req.sanitize('otherReason').entityDecode();
  req.sanitize('comment').trim();
  req.sanitize('comment').xss();
  req.sanitize('comment').entityDecode();
  req.assert('comment', 'Comment cannot be empty').notEmpty();

  if (req.body.otherReason.length == 0) { //otherReason is not required. if i leave this in then if empty, it will return error.
    req.assert('comment', 'No special characters allowed').regex(/^[A-Za-z0-9 .!?,]+$/);
  }
  if (req.body.comment.length == 0) {
    req.assert('otherReason', 'Other reason can only be have alphanumeric characters and punctuation').regex(/^[A-Za-z0-9 .!?,]+$/);
  }

  if (req.body.optionsRadios == 'clientDispute') {
    console.log('router: requestNewLoanOfficer: 1')
    req.body.client = true;
    req.body.loanOfficer = false;
    req.body.agent = false;
    req.body.other = false;
  } else if (req.body.optionsRadios == 'loanOfficerDispute') {
    console.log('router: requestNewLoanOfficer: 2')
    req.body.client = false;
    req.body.loanOfficer = true;
    req.body.agent = false;
    req.body.other = false;
  } else if (req.body.optionsRadios == 'otherDispute') {
    console.log('router: requestNewLoanOfficer: 3')
    req.body.client = false;
    req.body.loanOfficer = false;
    req.body.agent = false;
    req.body.other = true;
  } else {
    console.log('router: requestNewLoanOfficer: ERROR: html modified by user');
    res.redirect(301, '/agent/' + req.body.agentId);
  }

  var errors = req.validationErrors();
  if (errors.length > 0) {
    res.render('404.jade', {
      title: '404 page'
    });
  } else {
    dbFun.requestNewLoanOfficer(req.body, function(err, client) {
      if (!err) {
        console.log('router: requestNewLoanOfficer: agent requested new LO (Agent acted first)')
        res.redirect(301, '/agent/' + req.body.agentId);

        var emailData = {
          to: 'sogoiii@gmail.com',  //debugging sogoiii@gmail.com
          locals: {
            client: client
          }
        }
        sendGridMail.sendAlertLoanOfficerNewClient(emailData);
      } else if (err == 'emailForNewLO') {
        console.log('router: requestNewLoanOfficer: will email for new LO (lo deleted client first)')
        res.redirect(301, '/agent/' + req.body.agentId);
        var emailData = {
          to: 'sogoiii@gmail.com', //debugging sogoiii@gmail.com
          locals: {
            client: client
          }
        }
        sendGridMail.sendAlertLoanOfficerNewClient(emailData);
      } else {
        console.log('router: equestNewLoanOfficer: failed to properly removed client from loan officer')
        res.redirect(301, '/agent/' + req.body.agentId);
      }
    }); //end of request new loan officer
  } //end of else no errors
}; //end of requestNewLoanOfficer



/*
 * ******************************************** Lender ROUTES!!!! ***************************
 */



/*
 * loanOfficerIndex
 */
exports.loanOfficerIndex = function(req, res) {
  //grab all the unassigned clients and create excel of them so they can be assigned 

  var v = new Validator();

  v.check(req.params.lenderId, 'lenderId not Number').regex(/^[0-9a-fA-F]{24}$/);
  var errors = v.getErrors();
  if (errors.length == 0) {
    async.parallel([

    function(cb) {
      dbFun.newlyCreatedClients(function(err, results) {
        if (!err) {
          req.session.numUnassigned = results.numUnassigned;
          cb(null, results);
        } //end of !err if
        else {
          cb(err, null);
        } //end of !err else
      }); //end of newlyCreatedClients
    }, //end of first parallel function

    function(cb) {
      dbFun.GrabAllLO(function(err, results) {
        if (!err) {
          cb(null, results);
        } //end of !err if
        else {
          cb(err, null);
        } //end of !err else
      }); //end of GrabAllLO
    }, //end of second parallel function

    function(cb) {
      dbFun.getLOClients(req.params.lenderId, function(err, results) {
        if (!err) {
          cb(null, results);
        } //end of !err if
        else {
          cb(err, null);
        } //end of !err else
      }); //end of getLOClients
    } //end of third parallel function
    ], //end of third async functions to compute

    function(allErr, allResults) {
      if (!allErr) {
        //REMOVED
        res.render('loanofficer/loanOfficerIndex.jade', {
          title: 'loanOfficerIndex',
          message: 'Loan Officer page loaded correctly',
          clients: allResults[2].clients,
          allLO: allResults[1],
          numUnassigned: allResults[0].numUnassigned,
          currentClientId: null,
          privileges: allResults[2].privileges
        });
        // res.render('loanOfficerUnassigned', {title: 'lender', message: 'Loan Officer page loaded correctly', unassigned: allResults[0], clients: null, allLO: allResults[1], numUnassigned : allResults[0].numUnassigned});
      } //end of !allErr
      else {
        //REMOVED
        console.log('router: loanOfficerIndex: unassigned page failed to load');
        res.render('loanofficer/loanOfficerIndex.jade', {
          title: 'loanOfficerIndex',
          message: 'Something faild in the back end',
          clients: null,
          allLO: null,
          numUnassigned: null,
          currentClientId: null
        });
      } //end of !allErr
    } //end of totalerr function
    ); //end of asyncparallel
  } else {
    res.redirect(400, '/');

  } //end of errors
}; //end of loanOfficerIndex



/*
 * loanOfficer Client
 */
exports.loanOfficerClient = function(req, res) {

  dbFun.getLoanOfficerClient(req.params, function(err, result) {
    if (!err) {
      //REMOVED
      res.render('loanOfficer/loanOfficerClient.jade', {
        title: 'client Calculator version',
        clients: result.clients, //for sidebar
        calcData: result.clients[result.index].calculator, //caluclator 
        currentClientId: req.params.clientId, //to identify who this client is
        currentClient: result.clients[result.index], //all data in regard to this client (maybe remove currentClientId)
        privileges: req.session.privileges
      }); //end of render
    } //end of !err if
    else {
      // console.log('router: loanOfficerClient: failed to load agent user = ' + req.params.agentId);
      res.redirect(302, '/');
    } //end of !err else
  }); //end of getOnlyClientNames
}; //end of loanOfficerClient



/*
 * unAssigned
 */
exports.unassigned = function(req, res) {
 //REMOVED
}; //end of unAssigned



/*
 * putUnassigned
 */
exports.putUnassigned = function(req, res) {

  dbFun.cloneClientToLoanOfficer(req.body, function(err){
    if(!err){
      console.log('cloned client to loan officer');
      res.redirect('back');
    }//end of !err if
    else{
      console.log('failed to clone client to loan officer');
      console.log(err);
      res.redirect('back');
    }//end of !err else
  });//end of cloneClientToLoanOfficer
}; //end of putUnassigneds



/**
 * agentSetting
 */
exports.agentSetting = function(req, res) {

  var v = new Validator();
  var inputErrors = req.session.inputErrors;
  req.session.inputErrors = '';
  v.check(req.params.agentId, 'agentId not valid').regex(/^[0-9a-fA-F]{24}$/);
  var errors = v.getErrors();
  if (errors.length == 0) {
    dbFun.userSetting(req.params.agentId, 'RealEstateAgent', function(err, result) {
      if (!err) {

        res.render('Blocks/settings.jade', {
          title: 'agentSetting',
          privileges:result.privileges,
          userName: result.firstName +  ' ' + result.lastName,
          cellPhone: result.cellPhone,
          email: result.email,
          leaderId:(result.leaderId==null)?false:true,
          subscribedEvents: result.subscribedEvents,                           
          OfficeEmployees: extFun.formatDate(result.officeEmployees.toObject(),"dateAdded",'MM-DD-YYYY')
        });
      } //end of !err if
      else {
        console.log('router: agentSetting: failed to load agent user = ' + req.params.agentId);
        res.redirect(400, '/');
      } //end of !err else
    }); //end of getSelf
  } else {
    // console.log('router: agentSetting: ERROR:' + errors);
    res.redirect(400, '/');
  } //end of if errors.length
}; //end of agentSetting



exports.loanOfficerSetting = function(req, res) {
  var v = new Validator();
  var inputErrors = req.session.inputErrors;
  req.session.inputErrors = '';
  v.check(req.params.lenderId, 'lenderId not valid').regex(/^[0-9a-fA-F]{24}$/);
  var errors = v.getErrors();
  if (errors.length == 0) {
    dbFun.userSetting(req.params.lenderId, 'loanOfficer', function(err, result) {
      if (!err) {
        // console.log(result.subscribedEvents)
        res.render('Blocks/settings.jade', {
          title: 'loanOfficer Setting',
          privileges:result.privileges,
          userName: result.firstName +  ' ' + result.lastName,
          cellPhone: result.cellPhone,
          email: result.email,
          leaderId:(result.leaderId==null)?false:true,
          subscribedEvents: result.subscribedEvents,
          OfficeEmployees:(result.officeEmployees!=undefined)?(extFun.formatDate(result.officeEmployees.toObject(),"dateAdded",'MM-DD-YYYY')):""
        }); //, subscribedEvents: allResults[2].subscribedEvents
      } //end of !err if
      else {
        console.log('router: loanOfficerSetting: failed to load agent user = ' + req.params.agentId);
        res.redirect(400, '/');
      } //end of !err else
    }); //end of loanOfficerSetting DB
  } else {
    console.log('router: loanOfficerSetting: ERROR :' + errors);
    res.redirect(400, '/');
  } //end of if errors.length
}; //loanOfficerSetting


exports.tasks = function(req, res) {

//REMOVED
} //end of tasks




/****************************************************** testing */
exports.clientIndex = function(req, res) {
  //REMOVED

};//end of lientIndex=





/**
 * adminUnassigned
 */


exports.adminUnassigned = function(req, res){
//REMOVED

};//end of adminUnassigned








/*
 * adminUnassignedPut
 */


exports.adminUnassignedPut = function(req, res){

   //REMOVED
};//end of adminUnassignedPut




/*
 * agentAnalytics
 */


exports.agentAnalytics = function(req, res){ //INCOMPLETE



  dbFun.getAnalytics(req.body, function(err, data){



  });//


  res.render('testviews/analytics.jade',{title: 'Analytics'})
};//end of agentAnalytics









