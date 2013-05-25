var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;



var safe = { j: 1, wtimeout: 10000 };//writes to this will be on journal and have a timeout of 10 seconds

//Schema Definition
var brokerLeader = new Schema({
//REMOVED
},
{safe: safe});//end of broker leader



module.exports = mongoose.model('brokerLeader', brokerLeader);

 