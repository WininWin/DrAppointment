import React, { Component } from "react";
import DB from "../appconfig/DB.js";
import {Grid, Row, Col, ListGroupItem, 
  ListGroup, Panel, Button, 
  Modal, FormGroup, FormControl,
   ControlLabel } from "react-bootstrap";

import FileView from './FileView';
import FileUpload from './FileUpload';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';


import "../css/PatientView.css";


class PatientView extends Component {

  constructor(props) {
    super(props);

      
    this.state = {

      myInfo : "",
      myInfoView :'',
      myMedicalRecords : [],
      showMedicalRecord : false,
      myAppointments : "",
      appointmentModal: false,
      appointmentDate: moment(),
      doctorsList : "",
      purpose: "",
      appointmentDoctor : "",
      appointmentError : ""
      
    };
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  //date 
   handleDateChange(date) {
    this.setState({
      appointmentDate: date
    });
  }



  //modal handler
  hideMedicalRecord = event => {
    this.setState({ showMedicalRecord: false });
  }

  appointmentModalClose = event => {
    this.setState({appointmentModal: false, 
      appointmentError : ''});
  }

  appointmentModalShow = function(appointmentID){
    this.setState({appointmentModal: true,
        purpose : "",
        appointmentDate : moment()
             
       });
  }

  appointmentPurpose = event => {
     this.setState({purpose: event.target.value});
  }

  appointmentDoctorSelect = event => {
   
     this.setState({appointmentDoctor: event.target.value});
  }

   formatDate(value){
    return value.getMonth()+1 + "/" + value.getDate() + "/" + value.getFullYear();
  }

  //update current appointment list
   updateAppointmentList(patient){
    DB.getMyAppointments({ patientID: patient._id}, (res) => {
          res.json().then((appointments) => {
             
              const aList = appointments.data.map((appointment, index)=>{
                    //status check
                    let buttons = "";
                   if(appointment.status === 'scheduled'){
                        buttons = (<div>
                          <Col md={4}>
                          <Button onClick={() => this.cancelAppointment(patient, appointment._id, 'canceled')} bsStyle="danger" bsSize="small">Cancel
                          </Button>
                          </Col>
                              
                          </div>
                          

                          );
                    }

                    let declineMessage = "";
                    if(appointment.status === 'declined'){
                      declineMessage = 'Message : ' + appointment.message;
                    }
                    //date
                    let date = new Date(appointment.appointmentDate);
                    date = this.formatDate(date);

                    return (
                        <ListGroupItem key={appointment._id}>
                        <Grid className="appointment-list-item">
                          <Row>
                              <Col md={4}>{appointment.purpose}</Col>
                              <Col md={4}>{date}</Col>
                              <Col md={4}>{appointment.status}</Col>
                            

                          </Row>
                          <Row>

                             <Col md={8}>
                              Doctor Name : {appointment.doctorName}
                            </Col>
                             {buttons}
                              
                          </Row>
                          <Row> 
                              {declineMessage}
                          </Row>

                        </Grid>
                        </ListGroupItem>
                      );
             
              });
              this.setState({ myAppointments : aList});
          });
      });
  }

  //cancel appointment
  cancelAppointment(patient, appointmentID, status){

      DB.updateAppointments({
      '_id': appointmentID,
      'status': status,
  }, (res) => {

          this.updateAppointmentList(patient);
      });


  }


  //submit appointment
  makeAppointment(patient, doctor, purpose, date){


      if(!purpose.trim().length){
        this.setState({
            appointmentError : 'Purpose is required'
        });
      }


      else{
        const doctorInfo = doctor.split(",");
       
        DB.makeAppointment({
          patientID : patient._id,
          doctorID: doctorInfo[0],
          doctorName : doctorInfo[1],
          purpose: purpose,
          appointmentDate: date._d

        },(res) => {
        
            res.json().then((result) => {

              this.updateAppointmentList(patient);
              this.setState({appointmentModal: false, 
                 appointmentError : ''});
            });
        });
      }
      



  }

   //read medical Record as pdf
  readMedicalRecord(patient, index){
    
     DB.getMedicalRecord({
        username : patient.username,
        requestFile : patient.medicalRecords[index],

      }, (res) =>{
            res.json().then((file) => {
             
              this.setState({
                currMedicalRecord : file.data.data,
                currMedicalRecordName : patient.medicalRecords[index],
                showMedicalRecord: true

              });
            });

      });

  }

  //update current medical record
  updateMedicalRecordList(patient){
    DB.getPatient({
      username : patient.username
    },(res) => {

      res.json().then((patient)=>{
       
         const mrList = patient.data[0].medicalRecords.map((item, index) => 
        <ListGroupItem key={item[index] + index} >
          <a onClick={() => this.readMedicalRecord(patient.data[0], index)}>{item}</a> 
           </ListGroupItem>
       
      );
      this.setState({
          myMedicalRecords: mrList
      });

      });
    });
  }

  //initial state
  componentWillReceiveProps(props) {
   
    const mrList = props.patientData.medicalRecords.map((item, index) => 
        <ListGroupItem key={item[index] + index} >
          <a onClick={() => this.readMedicalRecord(props.patientData, index)}>{item}</a>
        </ListGroupItem>
       
      );

    const info = (
        <div className="my-details">
          <Grid>
            <Row>Username : {props.patientData.username}</Row>
            <Row>Name : {props.patientData.name}</Row>
            <Row>Age : {props.patientData.age}</Row>
            <Row>Email : {props.patientData.email}</Row>
            <Row>Address : {props.patientData.address}</Row>
            <Row>Phone : {props.patientData.phoneNumber}</Row>

            <Row> 
              <FileUpload patient={props.patientData} 
              onUpload={()=>this.updateMedicalRecordList(props.patientData)}/>
            </Row>

          </Grid>
        </div>
      );

     DB.getDoctors((res) => {
        res.json().then((doctors) => {
          this.setState({appointmentDoctor: doctors.data[0]._id + "," + doctors.data[0].name});
           const dList =  doctors.data.map((item, index) => 
                <option key={item._id} value={[item._id, item.name]}>{item.name}</option>
            );
          

           this.setState({
              doctorsList : dList
           });
        });
        
    });
    

    this.setState({   myInfo : props.patientData,
      myInfoView : info,
      myMedicalRecords : mrList,
       });  

    this.updateAppointmentList(props.patientData);
  }

  render() {
    return (
      <Grid className="patient-view">
        <Row className="user-name">
            Hello! {this.props.patientData.name}
        </Row>
         <Row className="details-view">
            <Col md={6} >
                 <Panel bsStyle="info">
              <Panel.Heading>
                <Panel.Title componentClass="h3">My Info</Panel.Title>
              </Panel.Heading>
              <Panel.Body>{this.state.myInfoView}</Panel.Body>
            </Panel>

            <Panel bsStyle="info">
            <Panel.Heading>
              <Panel.Title componentClass="h3">
                Medical Records 
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body> 
              <ListGroup>
                {this.state.myMedicalRecords}
              </ListGroup>
              </Panel.Body>
          </Panel>
            </Col>


            <Col md={6}>
                <Panel bsStyle="info">
              <Panel.Heading>
                <Panel.Title componentClass="h3">Appointments</Panel.Title>
              </Panel.Heading>
              <Panel.Body className="appointment-info">
                 <Grid>
                  <Row> 
                    <Col mdPush={4} md={4}>
                      <Button bsStyle='success' onClick={()=>this.appointmentModalShow("")}>Make Appointment </Button>
                     </Col>
                  </Row>

                    <Row>
                              <Col md={4}>purpose</Col>
                              <Col md={4}>date</Col>
                              <Col md={4}>status</Col>
                            

                    </Row>  
                    </Grid>
                    <ListGroup>
                        {this.state.myAppointments}
                    </ListGroup>
                    </Panel.Body>
                    </Panel>
            </Col>
         </Row>
           <Modal show={this.state.appointmentModal} onHide={this.appointmentModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Make Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
           <form>
           
              <FormGroup bsSize="large">
               <ControlLabel>Purpose</ControlLabel>
                <FormControl type="text" placeholder="Write purpose here"  value={this.state.purpose} onChange={this.appointmentPurpose}/>
              </FormGroup>

              <FormGroup controlId="formControlsSelect">
      <ControlLabel>Select Doctor to see</ControlLabel>
      <FormControl componentClass="select" placeholder="select" onChange={this.appointmentDoctorSelect}>
          {this.state.doctorsList}
      </FormControl>
    </FormGroup>
           
              <FormGroup controlId="formControlsSelect">  
             
                <ControlLabel>Date</ControlLabel>
            <DatePicker
                selected={this.state.appointmentDate}
                onChange={this.handleDateChange}
                   minDate={moment()}
                maxDate={moment().add(365, "days")}
            />
            
            </FormGroup>
              </form>

              <div>{this.state.appointmentError}</div>
              </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={() => this.makeAppointment(this.state.myInfo, this.state.appointmentDoctor, this.state.purpose, this.state.appointmentDate)}>Send</Button>
            <Button bsStyle="danger" onClick={this.appointmentModalClose}>Cancel</Button>
          </Modal.Footer>
        </Modal>

           <Modal show={this.state.showMedicalRecord} onHide={this.hideMedicalRecord}>
        <Modal.Header closeButton>
            <Modal.Title>{this.state.currMedicalRecordName}</Modal.Title>
          </Modal.Header>
          
              <FileView data={this.state.currMedicalRecord} />
           
        </Modal>
             
     </Grid>
    );
  }
}

export default PatientView;