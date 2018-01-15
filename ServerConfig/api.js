//Server API
module.exports = function(app, router, passport, User,Appointment, fs, jwt, jwtsecret, multer){

	//const // upload to temp location
	const upload = multer({ dest: __dirname + '/../tempUploadLocation/' });
	

	//------login strategy-------------
	const LocalStrategy = require('passport-local').Strategy;

	passport.use('local-login', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		session: false,
  		passReqToCallback: true
	},
	function(req, username, password, done) {
		
		User.findOne({'username': username}, function(err, user) {
			
			if(err){
				return done(err);
			}
			if(!user){
				
				const error = new Error('Username does not exist')
				error.name = "IncorrectCredentialsError";
				return done(error, false);
			}
			if(!user.validPassword(password)){
				
				const error = new Error('Incorrect password');
				error.name = "IncorrectCredentialsError";

				return done(error, false);
			}

			const payload = {
		        sub: user._id
		    };

		    // create a token string
		    const token = jwt.sign(payload, jwtsecret);
		      
		
		    return done(null, token, user);
		

		});
	}));

	//auth checker 
	function authCheck(req, res, next){

	  if (!req.headers.authorization) {
	    return res.status(401).end();
	  }

	  const token = req.headers.authorization.split(' ')[1];

	  // decode the token using a secret key-phrase
	  return jwt.verify(token, jwtsecret, (err, decoded) => {
	    // the 401 code is for unauthorized status
	    if (err) { return res.status(401).end(); }

	    const userId = decoded.sub;

	    // check if a user exists
	    return User.findById(userId, { password: 0 }, (userErr, user) => {
	    	
	      if (userErr || !user) {
	        return res.status(401).end();
	      }
	      res.user = user;
	      return next();
	    });
	  });
	};


	//login
	app.post('/auth/login', function(req, res, next) {
		
		
		passport.authenticate('local-login', (err, token, userData) => {
		   
		    if (err) {
		      if (err.name === 'IncorrectCredentialsError') {
		        return res.status(400).json({
		          success: false,
		          message: err.message
		        });
		      }

		      return res.status(400).json({
		        success: false,
		        message: 'Could not process the form.'
		      });
		    }


		    return res.json({
		      success: true,
		      message: 'You have successfully logged in!',
		      token,
		      user: userData
		    });
		  })(req, res, next);
		


	});

	//authorized user data
	app.get('/auth/user' , authCheck, function(req, res){
	
		return res.json({
			message: "Authorized",
			data : res.user
		});

	});

	//get patients list
	app.get('/auth/patients', authCheck, function(req, res){

		User.find({role:'Patient'}, function(err, data){
			
			return res.json({
				message: "Patients List",
				data: data 
			});

		});
	});

	//get doctors list
	app.get('/auth/doctors', authCheck, function(req, res){

		User.find({role:'Doctor'}, function(err, data){
			
			return res.json({
				message: "Doctorss List",
				data: data 
			});

		});

	});


	//get one patient
	app.get('/auth/patient', authCheck, function(req,res){

		User.find({username: req.query.username}, function(err,data){
		
				return res.json({
					message: 'success',
					data : data
				});
		});

	});

	//get patient's appointment
	app.get('/auth/myappointments', authCheck, function(req, res){
		Appointment.find({patientID : req.query.patientID}, function(err, data){
					return res.json({
					message: "success",
					data: data 
				});

		});
	});

	//get Appointments between doctor and patient
	app.get('/auth/appointments', authCheck, function(req, res){	

		Appointment.find({$and:[ 
			{doctorID: req.query.doctorID}, 
			{patientID: req.query.patientID}
			]}, 
			function(err,data){
			return res.json({
				message: "success",
				data: data 
			});

		});

	});



	//appointment status update
	app.put('/auth/appointments/update', authCheck, function(req, res){

		Appointment.findOne({_id: req.body._id}, function(err, data){
			
			for(let key in req.body){
				data[key] = req.body[key];
			}

			data.save(function(err,msg){
				
				return res.json({
					message: 'success'
				});
			});
		
		});
	});


	//submit appointment request
	app.post("/auth/makeAppointment", authCheck, function(req, res){

    			let data = {
    				doctorID : req.body.doctorID,
    				doctorName : req.body.doctorName,
    				patientID : req.body.patientID,
    				purpose : req.body.purpose,
    				status: 'pending',
    				appointmentDate : req.body.appointmentDate,
    				
    			}
    			

    			let newAppointment = new Appointment(data);

    			newAppointment.save(function(err,data){
    				return res.json({
    					message: "success",
    					data : data
    				});
    			});

	});

	//read medical record file
	app.post('/auth/medicalRecord/', authCheck, function(req, res){
		
		let tempfile = __dirname + "/../medicalRecords/" 
						+ req.body.username + "/" 
						+ req.body.requestFile;
		
		//Doctor can access all files 
		if(res.user.role === 'Doctor'){
			fs.readFile(tempfile, function(err, data){
				
				res.contentType("application/pdf");
				
    			return res.json({
    				message: "success",
    				data : data
    			});
			});

		}
		else{
			if(res.user.username === req.body.username){

				fs.readFile(tempfile, function(err, data){
				
				res.contentType("application/pdf");
    			return res.json({
    				message: "success",
    				data : data
    			});
				});

			}
			else{
				return res.json({
					message: 'No permission!'
				});
			}
		}

	});


	//upload medicalRecord
	app.post('/auth/upload/', authCheck, upload.single('medicalRecord'), function(req,res){
		
		if (!req.file) {
		   
		    return res.send({
		      success: false
		    });

		  } else {
		    
		   if(res.user.role === 'Doctor' || res.user.username === req.body.patientUsername){ 

		   	//upload to temp location and then copy to user directory
		   	fs.createReadStream(req.file.path)
		   		    	.pipe(fs.createWriteStream(__dirname + "/../medicalRecords/" 
		   		    		+ req.body.patientUsername + '/' + req.file.filename + ".pdf"));
		   		    
		   			
		   		    User.findOne({username: req.body.patientUsername}, function(err, data){
		   			
		   					data['medicalRecords'].push(req.file.filename + ".pdf");
		   
		   					data.save(function(err,msg){
		   						
		   						return res.json({
		   							message: 'success'
		   						});
		   					});
		   				
		   				});
		   	}
		    
		  }

	});

	//delete medical record 
	app.post('/auth/deleteMedicalRecord', authCheck, function(req, res){

		let filepath = __dirname + "/../medicalRecords/" 
						+ req.body.username + "/" 
						+ req.body.requestFile;
		//delete file
		fs.unlinkSync(filepath);

		User.findOne({username : req.body.username}, function(err,data){
			if(req.body.index > -1){
				data['medicalRecords'].splice(req.body.index, 1);
			}
		
			data.save(function(err,msg){
		   						
		   		return res.json({
		   			message: 'success'
		   		});
		   	});
		});


	});

}