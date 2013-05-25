var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var ObjectId = mongoose.Schema.Types.ObjectId;

// var clientData = require('./client.js').client;




var safe = { j: 1, wtimeout: 10000 };//writes to this will be on journal and have a timeout of 10 seconds

//Schema Definition
var requestClients = new Schema({
    client: {},
//REMOVED
},
{safe: safe}
);




module.exports = mongoose.model('requestClients', requestClients );
