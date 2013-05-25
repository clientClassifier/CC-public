var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var bcrypt = require('bcrypt');
var ObjectId = mongoose.Schema.Types.ObjectId;
var client = require('./client.js').client;


// var subSchema = require('mongoose').model('subscribedEvents').schema
var subSchema = require('./subObjects/subscribedEvents.js')

// var amodel = subscribedEvents
// var subEvents = new subscribedEvents()

var safe = { j: 1, wtimeout: 10000 };//writes to this will be on journal and have a timeout of 10 seconds
//Schema Definition
var RealEstateAgent = new Schema({
    email: {type: Email, unique: true },

    cellPhone: {type: String, required: true},
    firstName: {type: String, required: true},
    middleName: {type: String},
    lastName: {type: String, required: true},


    brokerCompany: {type: String},
    companyPhone: {type: String},
    TOS: {type: Boolean, required:true, default: false},
    
    hash: {type: String, required: true},
    salt: {type: String, required: true},
    clients: [client],
    userType: {type: String, required: true, default: 'realEstateAgent'},

    subscribedEvents :subSchema,


    disputeCounts :{ //how many times has this agent claimed a dispute source.
      client: {type: Number, default: 0},
      loanOfficer :{type: Number, default: 0},
      agent: {type: Number, default: 0}, //this represents counts aggainst agent
      other: {type: Number, default: 0},
      type:{
        requestNewLO : {type: Number, default: 0},
        requestDeleteClient: {type: Number, default: 0}     
      }
    },

    disputeIds: [{_id: Schema.ObjectId}],

    userCreated: {type: Date, default: Date.now},
    privileges: {type: Boolean, default: 0},
    agentBroker: {type: Schema.Types.ObjectId, ref: 'RealEstateAgent'}, //need to know who to update when somethign significant happens
    leaderId: {type: Schema.Types.ObjectId, default: null, ref: 'RealEstateAgent'},
    closed :[{
        clientId: {type: Schema.ObjectId, ref: 'client'},
        agentId: {type: Schema.ObjectId, ref: 'RealEstateAgent'},
        loanOfficerId: {type: Schema.ObjectId, ref: 'loanOfficer'},
        dateAdded: {type: Date},
        dateCreated: {type: Date},
        commission: {type: Number},
        housePrice : {type: Number},
        clientName: {type: String},
        agentName: {type: String},
        clientPhoneNumber: {type: Number}
    }],

    officeEmployees: [{
        userId : {type: Schema.ObjectId, ref: 'RealEstateAgent'},
        dateAdded: {type: Date, default: Date.now},
        name: {type: String},
        cellPhone: {type: String},//ESTABA EN INT
        email: {type: Email, unique: true },
        groupName: {type: String}, 
        companyName: {type: String}
    }], 

    analystics :{
        closing:[{
            startDate: {type: Date},
            closingTime: {type: Date},
            date: {type: Date, default: Date.now},
            agentId: {type: Schema.Types.ObjectId, ref: 'RealEstateAgent'},
            loanOfficerId: {type: Schema.Types.ObjectId, ref: 'loanOfficer'},
            clientId: {type: Schema.Types.ObjectId, ref: 'client'},//Ill save the client in the table when they get closed.
            commission:{type: Number},
            housePrice: {type: Number},
            clientFirstName: {type: String},
            clientLastName: {type: String},
        }],
        creation: [{
            date: {type: Date},
            agentId: {type: Schema.Types.ObjectId, ref: 'RealEstateAgent'},
            clientId: {type: Schema.Types.ObjectId},
            agentName: {type: String},
            clientName: {type: String}
        }]
    }
},
{safe: safe}
);




RealEstateAgent
.virtual('password')
.get(function () {
  return this._password;
})
.set(function (password) {
  this._password = password;
  var salt = this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, salt);
});




module.exports = mongoose.model('RealEstateAgent', RealEstateAgent );


  
