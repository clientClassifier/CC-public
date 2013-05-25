var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var task   = require('./task.js').task;


var safe = { j: 1, wtimeout: 10000 };//writes to this will be on journal and have a timeout of 10 seconds
//Schema Definition
var client = new Schema({
    registered: {type: Boolean, default: false},
    firstName: {type: String, required: true},
    middleName: {type: String},
    lastName: {type: String, required:true},
    homePhone: {type: String},
    cellPhone: {type: String},
    clientConfirmation: {type: Boolean, required:true, default: false},
    email: {type: Email, unique: true },
    agent: {
      _id: Schema.ObjectId,
      firstName: {type: String, required: true},
      middleName: {type: String},
      lastName: {type: String, required: true},
      cellPhone: {type: String, required: true},
      email: {type: Email, unique: true },
      companyFax: {type: String, required: true},
      brokerCompany: {type: String, required: true},
    },
    tasks:[task],
    loanOfficer: {
      _id: Schema.ObjectId,
      exists: {type: Boolean, default: false},
      firstName: {type: String, required: true},
      middleName: {type: String, required: true},
      lastName: {type: String, required: true},
      cellPhone: {type: String, required: true},
      email: {type: Email, unique: true },
      companyPhone: {type: String, required: true, default: '(818) 989-0543'},
      companyFax: {type: String, required: true, default: '(818) 289-9542'},
      brokerCompany: {type: String, required: true, default: 'First Valley Morgage'},


    },
    calculator: {
      housePrice: {type: Number, default: 250000},
      downPaymentPercent: {type: Number, default: 3.5},
      desiredInterestRate: {type: Number, default: 5},
      monthlyDebtPayments: {type: Number, default: 0},
      rentalIncome: {type: Number, default: 0},
      borrower1: {type: Number, default: 0},
      borrower2: {type: Number, default: 0},
      borrower3: {type: Number, default: 0},
      
      loanAmount: {type: Number, default: 241250},
      loanPercent: {type: Number, default: 96.5},
      downPayment: {type: Number, default: 8750},
      monthlyPayment: {type: Number, default: 1795.68},
      needCoborrower: {type: String, default: ''},
      frontDTI: {type: Number, default: '0'},
      backDTI: {type: Number, default: '0'},
      incomeNeeded: {type: Number, default:'0'},
      totalIncome: {type: Number, default: '0'},
      inc47 : {type: Number, default: '0'},
      grade:{ type: String, default: ''},
    },
    commission: {
      twoFive: {type: Number, default: 6250},
      threeFive: {type: Number, default: 8750},
      threeEven: {type: Number, default: 7500}
    },
    documentation: {
      W2: {type: Boolean, default: false},
      taxes: {type: Boolean, default: false},
      payStub: {type: Boolean, default: false},
      bankStatements: {type: Boolean, default: false},
      prequal: {type: Boolean, default: false},

      driversLicense: {type: Boolean, default: false},
      socialSecurityCard: {type: Boolean, default: false},
      application: {type: Boolean, default: false},
      submissionForm: {type: Boolean, default: false},
      signed: {type: Boolean, default: false},
      preApproved: {type: Boolean, default: false},

      prequalAgent: {type: Boolean, default: false},
      showHouses: {type: Boolean, default: false},
      madeOffer: {type: Boolean, default: false},
      
      offerStatus: {type: Boolean, default: false},
      appraisal: {type: Boolean, default: false},
      escrow: {type: Boolean, default: false},
      closed: {type: Boolean, default: false},

      EMD: {type: Boolean, default: false},
      prelim: {type: Boolean, default: false},
      escrowInstruction: {type: Boolean, default: false},
      reDisclosures: {type: Boolean, default: false},
      homeInspections: {type: Boolean, default: false},
      NTP: {type: Boolean, default: false},
      FWT: {type: Boolean, default: false},


      credit: {type: Boolean, default: false},
      updatedDocs: {type: Boolean, default: false},
      conditions: {type: Boolean, default: false},
      subOfLoan: {type: Boolean, default: false},
      // appraisal: {type: Boolean, default: false},
      approved: {type: Boolean, default: false},
      priorToDocs: {type: Boolean, default: false},
      PTFconditions: {type: Boolean, default: false},
      funding: {type: Boolean, default: false}

    },
    communication: [{
      date: {type: Date, default: Date.now},
      formatDate: {type: String},
      text: {type: String},
      userId : Schema.ObjectId,
      userType: {type: String},
      viewedByLO: {type: Boolean},
      viewedByAgent : {type: Boolean},
      userName: {type: String}
    }],
    agentUnseenCommunication : {type: Number, default : 0},
    loanOfficerUnseenCommunication : {type: Number, default: 0},

    instructions: [{
      date: {type: Date, default:Date.now},
      formatDate: {type: String, default: ''},
      text: {type: String, default:''},
      userId: Schema.ObjectId,
      userType: {type: String, default: 'loanOfficer'},
      completed: {type: Boolean, default: false},
      completedDate: {type: Date, default:''},
    }],
    happyness: [{
      time: {type: Date, default: Date.now, required: true},
      value: {type:Number, default: 50, required: true},
      comment: {type: String}
    }],

    dispute :{
      _id : {type: mongoose.Schema.Types.ObjectId, default: null},
      type:{
        requestNewLO : {type:Boolean, default: null},
        requestDeleteclient: {type:Boolean, default : null}        
      }
    },


    



    

    userCreated: {type: Date, default: Date.now}
}
// {safe: safe}
);



module.exports = mongoose.model('client', client);

