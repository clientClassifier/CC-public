var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;



var safe = { j: 1, wtimeout: 10000 };//writes to this will be on journal and have a timeout of 10 seconds

//Schema Definition
var consumerLead = new Schema({

//REMOVED

},
{safe: safe});//end of consumer model






module.exports = mongoose.model('consumerLead', consumerLead);
