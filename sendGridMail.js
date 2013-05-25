var jade = require('jade');
var fs = require('fs');
var SendGrid = require('sendgrid').SendGrid;
var sendgrid = new SendGrid('userName', 'api_key'); 
var Email = require('sendgrid').Email;



var Mailer = function Mailer(params) {
  params = params || {};
  this.to      = params.to      || [];
  this.from    = params.from    || 'angello@clientclassifier.com';
  this.subject = params.subject || '';
  this.locals = params.locals || '';
  this.debug = params.debug || false;
};

Mailer.prototype = {

  send: function(callback) {
    var data = this; 

    if(data.locals == null || typeof(data.locals) == 'undefined' || data.locals == ''){ //make sure that if the locals variable is empty, to exit well
      console.log('Mailer: '+  data.template +': Does not have the locals defined, hence cannot do anything')
      return callback('Mailer: locals is null, undefined, or empty')
    }

    fs.readFile(__dirname + '/views/emails/' + data.template, 'utf8', function (err, template) {
        if (err){
         // console.log('Mailer: '+  data.template +': ' + err)
          return callback('Mailer: '+  data.template +': ' + err)
        }
        var emailTemplate = jade.compile(template);

        var email = new Email({
          to: data.to,
          from: data.from,
          subject: data.subject,
          html: emailTemplate(data.locals)
        });

      if(data.debug == false){
        sendgrid.send(email, function(success, message){
          if(!success){
            console.log(message)
            console.log('Mailer: ' + data.template + ': FAILED to send mail');
            return callback(message)
          }
          else {
         //   console.log('Mailer: ' + data.template + ': SUCCEFULLY sent mail');
            return callback(null)
          }
        })//end of send grid send
      }// if !data.debug
      else{
        //return callback('debug:sent mail')
      }
    });//end of fs
  }//end of send
};//end of mailer prototype



/*
 * ******************************************** Export Functions !!!! *************************** //this can be made more general
 */

 
/**
 * Send a sendAddAgents
 */
module.exports.sendAddAgents=function(user){
  var mailer = new Mailer(user);
  mailer.subject='CC: Register in Client Classifer';
  mailer.template='sendAddAgents.jade';
  mailer.send(function(err){
    if(!err) console.log('Mailer: sent sendAddAgents.jade')
    else console.log('Mailer: sendAddAgents failed to send')    
  });
};//end of sendAddAgents



 
/**
 * sendAlertLoanOfficerNewClient
 */
module.exports.sendAlertLoanOfficerNewClient = function(loanOfficer){
  var mailer = new Mailer(loanOfficer);
  mailer.subject = 'A new client was added. Please review Prospects';
  mailer.template = 'sendAlertLoanOfficerNewClient.jade';
  mailer.send(function(err){
    if(!err) console.log('Mailer: sent sendAlertLoanOfficerNewClient.jade')
    else console.log('Mailer: sendAlertLoanOfficerNewClient failed to send')
  });
};// sendAlertLoanOfficerNewClient



/**
 * Send a sendRequestLostEmail
 */
module.exports.sendRequestLostEmail = function(user) {
  var mailer = new Mailer(user);
  // console.log('Whole user = ' + user);
  mailer.subject = 'Client classifier: I lost my password';
  mailer.template = 'sendRequestLostEmail.jade';
  mailer.send(function(err){
    if(!err) console.log('Mailer: sent sendRequestLostEmail.jade')
    else console.log('Mailer: sendRequestLostEmail failed to send')
  });
};// end of sendRequestLostEmail


/**
 * Send a sendCheckedUpdateInfo
 */
module.exports.sendCheckedUpdateInfo=function(user){
  var mailer = new Mailer(user);
  mailer.subject='CC: '+user.locals.nameFL+' updated '+user.locals.nameClient+ ' status';
  mailer.template='sendCheckedUpdateInfo.jade';
  mailer.send(function(err){
    if(!err) console.log('Mailer: sent sendCheckedUpdateInfo.jade')
    else console.log('Mailer: sendCheckedUpdateInfo failed to send')    
  });
};//end of sendCheckedUpdateInfo


/**
 * Send a sendEmailAgent  (instructions)
 */
module.exports.sendEmailAgent=function(user){
  var mailer=new Mailer(user);
  mailer.subject='CC: Instructions for '+user.locals.nameClient+' from '+user.locals.nameLO;
  mailer.template='sendEmailAgent.jade';
  mailer.send(function(err){
    if(!err) console.log('Mailer: sent sendEmailAgent.jade')
    else console.log('Mailer: sendEmailAgent failed to send')    
  }); 
};// end of sendEmailAgent


/**
 * Send a sendClientAnalysisRequest  
 */
module.exports.sendClientAnalysisRequest = function(user){
var mailer=new Mailer(user);
  mailer.subject="CC: New consumer lead requst";
  mailer.template = 'sendClientAnalysisRequest.jade';
  mailer.send(function(err){
    if(!err) console.log('Mailer: sent sendClientAnalysisRequest ')
    else console.log('Mailer: sendClientAnalysisRequest failed to send')    
  });
};//end of sendClientAnalysisRequest



/*
 *sendConfirmRegisterEmailClient
 */
module.exports.sendConfirmRegisterEmailClient = function(info){
  var mailer = new Mailer(info);
  mailer.subject = 'Client Classifier: Confirm Email Link';
  mailer.template = 'sendConfirmRegisterEmailClient.jade';
  mailer.send(function(err){
    if(!err) console.log('Mailer: sent sendConfirmRegisterEmailClient ')
    else console.log('Mailer: sendConfirmRegisterEmailClient failed to send')    
  });
};// end of sendConfirmRegisterEmailClient

/*
 *sendConfirmRegisterEmail
 */
module.exports.sendConfirmRegisterEmail = function(info){
  var mailer = new Mailer(info);
  mailer.subject = 'Client Classifier: Confirm Email Link';
  mailer.template = 'sendConfirmRegisterEmail.jade';
  mailer.send(function(err){
    if(!err) console.log('Mailer: sent sendConfirmRegisterEmail ')
    else console.log('Mailer: sendConfirmRegisterEmail failed to send')    
  });
};// end of sendConfirmRegisterEmail


/**
 * debugTESTMAIL
 */
module.exports.debugTESTMAIL=function(user, callback){
  var mailer=new Mailer(user);
  mailer.subject='CC: Test mail debugTESTMAIL';
  mailer.template='debugTESTMAIL.jade';
  mailer.send(function(err){
    if(!err){
      callback("Success")
    }
    else{
      callback(err)
    }
  });//end of mailer.send 
};//end of debugTESTMAIL

