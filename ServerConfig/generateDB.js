const Number_of_Doctor = 7;

const Number_of_Patients = 30; 

const Number_of_Appointments = 200;

const bodyparts = ['body', 'arm', 'leg','hand','head', 'foot', 'eye','nose'];

const status = ['completed', 'pending', 'declined','scheduled'];

const testUser = 'testUser';
const testPassword = '12345678';

const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const mkdirp = require('mkdirp');
const dir = __dirname  + '/../uploadSample';


function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


module.exports = {
	userCount : Number_of_Doctor + Number_of_Patients,
	generateUsers : function(User){
		console.log("--Generate dummy users--");

		let names = require('random-human-name').RandomNames(Number_of_Doctor + Number_of_Patients);
		const DoctorNames = names.slice(0,Number_of_Doctor);
		const PatientsName = names.slice(Number_of_Doctor, names.length);


		let users = [];

		for(let i = 0; i < Number_of_Doctor; i++){
			let tempDoctor = {
				username : testUser + "Doctor" + i,
				password : bcrypt.hashSync(testPassword, bcrypt.genSaltSync(8), null),
				role: 'Doctor',
				name : DoctorNames[i],
				email:testUser + "Doctor" + i+'@test.com',
				age: Math.floor(Math.random() * 50) + 30,
				phoneNumber: i + "12-123-1234"

			}
			
			users.push(new User(tempDoctor));
		}

		for(let i = 0; i < Number_of_Patients;i++){
			let tempPatient = {
				username : testUser + "Patient" + i,
				password : bcrypt.hashSync(testPassword, bcrypt.genSaltSync(8), null),
				role: 'Patient',
				name : PatientsName[i],
				email: testUser + "Patient" + i+'@test.com',
				age: Math.floor(Math.random() * 50) + 30,
				phoneNumber: i + "23-113-1234",
				medicalRecords: ['sample.pdf']
			}

			//create medical records directory
			mkdirp(dir + "/" + testUser + "Patient" + i, function (err) {
			    if (err){ console.error(err)}
			    else {

				  fs.createReadStream(dir + "/sample.pdf")
				      .pipe(fs.createWriteStream(dir + "/" + testUser + "Patient" + i + "/sample.pdf"));

			    }
			});

			users.push(new User(tempPatient));
		}


		return users; 

	},

	generateAppointments : function(doctors, patients, Appointment){


					for(let i = 0; i < Number_of_Appointments;i++){
						let randomDoctor = Math.floor(Math.random()*Number_of_Doctor);
						let doctorId = doctors[randomDoctor]._id;
						let doctorName = doctors[randomDoctor].name;
						let patientId = patients[Math.floor(Math.random()*Number_of_Patients)]._id;
						let tempstatus = status[Math.floor(Math.random()*status.length)];
						let appointmentDate = 0;
						let message = "";
						switch(tempstatus){
							case 'pending' :
								appointmentDate = new Date().getTime();
								break;
							case 'completed':
								appointmentDate = randomDate(new Date(2012, 0, 1), new Date());
								break;
							case 'declined':
								appointmentDate = randomDate(new Date(),new Date(2018, 8, 12));
								message = "vacation";
								break;
							case 'scheduled':
								appointmentDate = randomDate(new Date(),new Date(2018, 8, 12));
								break;
							
						}

						let purpose = "check " + bodyparts[Math.floor(Math.random()*bodyparts.length)];

						
						let tempAppointment = {
							   doctorID : doctorId
							 , doctorName : doctorName
							 , patientID :patientId
							 , purpose : purpose
							 , status: tempstatus //completed, pending, scheduled, declined 
							 , appointmentDate : appointmentDate
							 , message: ""

						}

						let newAppointment = new Appointment(tempAppointment);
						newAppointment.save();

					}

					setTimeout(function(){
						console.log("--Done dummy appointments data--");
					}, Number_of_Appointments * 150);

				
				
				
		
		





	}
}