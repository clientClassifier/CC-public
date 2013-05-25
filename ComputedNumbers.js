/** 
 * Model files
 */

var dbFun = require('./DBfunctions'); //access to the DB and other functions

//REMOVED!!

/*
 * ******************************************** Functions !!!! ***************************
 */


/**
 * getMFactor
 */
function getMFactor(interest, DPMethod){
//REMOVED

}//end of getMFactor



/**
 * getFHA
 */
function getFHA(num){//num = IR
  //REMOVED
};//end of getFHA


/**
 * getGreater
 */
function getGreater(num, callback){ //num = IR
//num is the input interest from the form user
//must grab interest rate correction, and the computed factor number

  IR = null;
  GF = null;
  for(var i = 0; i < interestLookup.length; i++){
    var difference = num - interestLookup[i];
    if(difference >=  0 && difference < 0.25){
      IR = interestLookup[i];
      GF = greaterLookup[i];
      var data = {GF: GF, RIR: IR};
      // console.log('CompNum: getGreater: factor = ' + JSON.stringify(data,null, '\t'));
      return data;
    }///end of num if
  }//end of while
}//end of get closest


/**
 * getLesser
 */
function getLesser(num, callback){
//num is the input interest from the form
//must grab interest rate correction, and the computed factor number

  IR = null;
  LF = null;
  for(var i = 0; i < interestLookup.length; i++){
    var difference = num - interestLookup[i];
    if(difference >=  0 && difference < 0.25){
      IR = interestLookup[i];
      LF = lesserLookup[i];
      var data = {LF: LF, RIR: IR};
      // console.log('factor = ' + JSON.stringify(data,null, '\t'));
      return data;
    }///end of num if
  }//end of while
}//end of get closest





/*
 * ******************************************** EXPORTS !!!! ***************************
 */



/**
 * updateAnalysis
 */
exports.updateAnalysis = function(data, callback){
  //REMOVED
}//end of updateAnalysis






/**
 * incNeed
 */
exports.incNeed = function(data, callback){
//removed
};//end of incneed





/**
 * getCM
 */
exports.getCM = function(data, callback){ //change monthly
 //removed
};//end of get CM




/*
 * ******************************************** Variables !!!! *************************** //REMOVED
 */



 //REMOVED!!!!!!!
