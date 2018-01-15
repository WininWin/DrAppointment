//base User object
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserBaseSchema = new mongoose.Schema({
  username :{type : String, unique: true}
, password : {type : String, required: true}
, role : {type : String, default : "Patient", required: true}
, name: { type: String }
, email: {type: String , unique: true}
, address: {type: String, default : "Somewhere over the Rainbow"}
, age: {type: Number}
, phoneNumber: {type: String}
, medicalRecords : [String]
, dateCreated: { type: Date, default: Date.now }
});


UserBaseSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserBaseSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// Export the Mongoose model
module.exports =  mongoose.model('User', UserBaseSchema, 'users');

