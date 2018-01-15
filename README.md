# Dr.Appointment

Using boiler plate from https://github.com/kevinschaich/react-full-stack-starter

Front end : React, React-bootstrap

Back end : Node.js express, multer, passport, jwt, 

Database : Mongo


# Installation/Usage

Make sure you have [MongoDB installed](https://docs.mongodb.com/manual/installation/). 
For changing mongoDB port, change port in `./ServerConfig/database.js`

**Run the following in your terminal:**

```bash
git clone https://github.com/WininWin/DrAppointment
cd DrAppointment
npm install

cd client
npm install

cd ..
npm start
```

Wait for generating dummy data

Wait console message --Done dummy appointments data--

Visit [http://localhost:3000](http://localhost:3000)

Default Doctor UserName : testUserDoctor0 ~ testUserDoctor6 

default Doctor Password : 12345678

(ex. username : testUserDoctor4, password: 12345678)

Default Patient UserName : testUserPatient0 ~ testUserPatient29

default Patient Password : 12345678

(ex. username : testUserPatient7, password: 12345678)

If you log in as Doctor, you can see patients list.
Click a patient for see patient's details, appointments, and medical records.

If you log in as Patient, you can see details, appointments, and medical records. 

Use uploadSample for test upload or any other pdf files 

# Description

Using passport and jwt for authorization and login system, it makes users keeping logged in the system.

Database model in `./models`, using two models, User and Appointment

Server configuration and api are in `./ServerConfig/`

Client Codes are in `./client/src/`

React app configs are in `./client/src/appconfig/`, and `DB.js` is api request service to database.

All cleint components are in `./client/src/components/`

Home/Login : `http://localhost:3000`

Userview(PatientView or DoctorView) : `http://localhost:3000/dash` or `http://localhost:3000` if you do not click log out button on right corner, it will keep logged in.

`./client/src/components/FileView.js` is a pdf reader. 

`./client/src/components/FileUpload.js` is upload component. 

# Assumptions

* Only Doctor can see patients list
* Only Doctor can remove patient's mediecal records
* Only Doctor can accept or decline appointment requests
* Only Paitient can submit appointment requests
* Both Doctor and Patient can see medical records
* Both Doctor and Patient can upload medical records


