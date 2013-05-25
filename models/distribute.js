var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var ObjectId = mongoose.Schema.Types.ObjectId;
var client = require('./client.js').client;
var agent = require('./RealEstateAgent.js')


var safe = { j: 1, wtimeout: 10000 };//writes to this will be on journal and have a timeout of 10 seconds

//Schema Definition
var distribute = new Schema({
//REMOVED
},
{safe: safe}
);








module.exports = mongoose.model('distribute', distribute );
