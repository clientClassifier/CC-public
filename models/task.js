var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var ObjectId = mongoose.Schema.Types.ObjectId;



// var safe = { j: 1, wtimeout: 10000 };//writes to this will be on journal and have a timeout of 10 seconds
//Schema Definition
var task = new Schema({
    name: {type: String, required: true},
    clientId:Schema.ObjectId,
    startDate: {type: Date, default: Date.now},
    dueDate: {type: Date, default: Date.now},
    dateCompleted: {type: Date},
    completed: {type:Boolean,default: false},
    message: {type: String, required: true},
    grade: {type: String, required: true},
    repeateFrequency: {type: Number},
    repeatedDate:[],
    taskFor: {type: String, required: true,default:'realEstateAgent'},
    clientName:{type: String, required: true}
  }
);

module.exports = mongoose.model('task', task);