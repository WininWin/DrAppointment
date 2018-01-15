import Auth from "./Auth.js";
//Client Rrequest
//login
const login = ( username, password, cb) => {
  const loginInfo = {
      'username': username,
      'password': password,
      'grant_type': 'password'
  };

let formBody = [];
for (let key in loginInfo) {
  if(loginInfo.hasOwnProperty(key)){
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(loginInfo[key]);
      formBody.push(encodedKey + "=" + encodedValue);
  }

}
formBody = formBody.join("&");
  return fetch('/auth/login', {
    headers: {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    method: 'post',
    body:  formBody
  })
  .then(cb);
}

//query encode
const queryCheck = function(query){
  let queryList = [];
  for (let key in query) {
    if(query.hasOwnProperty(key)){
        let encodedKey = encodeURIComponent(key);
        let encodedValue = encodeURIComponent(query[key]);
        queryList.push(encodedKey + "=" + encodedValue);
    }

  }
  return queryList.join("&");

}


//auth Check
const authCheck = (cb) => {

  return fetch('/auth/user', {
     headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization' : 'bearer ' + Auth.getToken()
    }

  })
  .then(cb);
};
//get all patient
const getPatients = (cb) => {
  return fetch('/auth/patients', {
     headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization' : 'bearer ' + Auth.getToken()
    }

  })
  .then(cb);

}
//get one patient
const getPatient = (query, cb) => {
  let requestQuery = queryCheck(query);
  return fetch('/auth/patient?' + requestQuery, {
     headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization' : 'bearer ' + Auth.getToken()
    },
    method : 'get'

  })
  .then(cb);
}

//get doctor list
const getDoctors = (cb) => {
  return fetch('/auth/doctors', {
     headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization' : 'bearer ' + Auth.getToken()
    }

  })
  .then(cb);

}


//get all appointments between requested doctor and patient
const getAppointments = (query, cb) => {

   
    let requestQuery = queryCheck(query);

   return fetch('/auth/appointments?' + requestQuery, {
     headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization' : 'bearer ' + Auth.getToken()
    }

  })
  .then(cb);
}

//get all appintments between patient and all doctors
const getMyAppointments = (query, cb) => {

    let requestQuery = queryCheck(query);

   return fetch('/auth/myappointments?' + requestQuery, {
     headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization' : 'bearer ' + Auth.getToken()
    }

  })
  .then(cb);
}

//update appointment status
const updateAppointments = (query, cb) => {
  
  let queryList = queryCheck(query);

  return fetch('/auth/appointments/update',{
     headers: {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Authorization' : 'bearer ' + Auth.getToken()
    },
    method: 'put',
    body: queryList

  })
  .then(cb);

}

//submit Appointment
const makeAppointment = (query, cb) => {
  let queryList = queryCheck(query);
  return fetch('/auth/makeAppointment',{
     headers: {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*, application/pdf',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Authorization' : 'bearer ' + Auth.getToken()
    },
    method: 'post',
    body: queryList

  })
  .then(cb);

}


//get medicalrecord
const getMedicalRecord = (query, cb) => {

  let queryList = queryCheck(query);
  return fetch('/auth/medicalRecord/',{
     headers: {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*, application/pdf',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Authorization' : 'bearer ' + Auth.getToken()
    },
    method: 'post',
    body: queryList

  })
  .then(cb);

}

//upload medical record
const uploadMedicalRecord = (patient, file, cb) => {
  let formData = new FormData();
      formData.append('medicalRecord', file);
      formData.append('patientUsername', patient.username);
 
  return fetch('/auth/upload/', {
      headers: {
    'Authorization' : 'bearer ' + Auth.getToken(),
    },
    method: 'post',
    dataType: 'json',
    body: formData

  })
  .then(cb);
}

//delete medical record
const deleteMedicalRecordRequest = (query, cb) => {

  let queryList = queryCheck(query);
  return fetch('/auth/deleteMedicalRecord',{
     headers: {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*, application/pdf',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Authorization' : 'bearer ' + Auth.getToken()
    },
    method: 'post',
    body: queryList

  })
  .then(cb);


}


const DB = { login, authCheck, getPatients, getAppointments, updateAppointments
      ,getMedicalRecord, uploadMedicalRecord, getPatient, deleteMedicalRecordRequest 
      ,getMyAppointments, getDoctors, makeAppointment
  };
export default DB;
