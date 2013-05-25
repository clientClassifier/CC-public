var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var bcrypt = require('bcrypt');

var forgotInfo = new Schema({
//REMOVED
  });



module.exports = mongoose.model('forgotInfo', forgotInfo );