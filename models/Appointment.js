// Load required packages
const mongoose = require('mongoose');

//Schema
const AppointmentSchema = new mongoose.Schema({
  doctorID :{type : String, required: true}
, doctorName : {type : String, required: true}
, patientID : {type : String, require: true}
, purpose : {type : String}
, status: { type: String } //completed, pending, scheduled, declined, canceled
, appointmentDate : {type : Date, defualt : Date.now}
, message : {type: String}
, dateCreated: { type: Date, default: Date.now }
},{collection: 'appointments'});


// Export the Mongoose model
module.exports =  mongoose.model('Appointment', AppointmentSchema);

