
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var bcrypt = require('bcrypt');
var ObjectId = mongoose.Schema.Types.ObjectId;
var client = require('./client.js').client;
var task   = require('./task.js').task;

var subSchema = require('./subObjects/subscribedEvents.js')

var safe = { j: 1, wtimeout: 10000 };//writes to this will be on journal and have a timeout of 10 seconds
//Schema Definition
var Todo = new Schema({
///REMOVED

},
{safe: safe}
);






module.exports = mongoose.model('Todo', Todo );



