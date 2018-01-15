//libs
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const db = require('./ServerConfig/database.js');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const generateDB = require('./ServerConfig/generateDB.js');
//db setting
mongoose.connect(db.url);


//models
const Appointment = require("./models/Appointment");
const User = require("./models/User");
let firstCallCheck = 0; 
let dbFillTimer = generateDB.userCount*150;
let dbEmptyCheck = 1000;
//first call - generate dummy users  
User.find(function(err, users){
	if(err){
		console.log(err);
	}
	else{
		if(!users.length){
			firstCallCheck = 1; 
			console.log("--DB does not have dummy users--");
			let users = generateDB.generateUsers(User);

			console.log("--Generate dummy users--");
			for(let i = 0; i < users.length; i++){
				
				users[i].save(function(err, result){
					if(err){
						console.log(err);
					}
					
				});
			}
		}
	}
});

console.log("--Check that DB is empty or not--")
setTimeout(function(){
	let DoctorIDs = [];
	let PatientIDs = [];

	User.find({role: "Doctor"}, "name", function(err,result){
		DoctorIDs = result;
			
	});
	User.find({role: "Patient"}, "_id", function(err,result){
		PatientIDs = result;
	});

	if(firstCallCheck){
		console.log("--Done dummy users data--");
		setTimeout(function(){
			

			//first call - generate dummy appointments 
			Appointment.find(function(err, appointments){
				if(err){
					console.log(err);
				}
				else{
					if(!appointments.length){
						console.log("--DB does not have dummy appointments--");
						console.log("--Generate dummy appointments--");
						generateDB.generateAppointments(DoctorIDs, PatientIDs, Appointment);
					}

				}
			});

		}, dbEmptyCheck);
	
}
	else{
		console.log("--DB has dummy datas--");
	}

},dbFillTimer);









//express settings
const router = express.Router();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());


app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

//api
require('./ServerConfig/api.js')(app, router, passport, User,Appointment,fs, jwt, db.jwtSecret, multer);


app.listen(app.get('port'));
console.log('Server running on port ' + app.get('port'));
