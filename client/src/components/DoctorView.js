import React, { Component } from "react";
import DB from "../appconfig/DB.js";
import {Grid, Row, Col, ListGroupItem, 
  ListGroup, Panel, Button, 
  Modal, FormGroup, FormControl,
  Label } from "react-bootstrap";
import FileView from './FileView';
import FileUpload from './FileUpload';


import "../css/DotorView.css";
class DoctorView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      initpatientList : [],
      patientsList : [],
      patientInfo : "",
      appointmentList : "",
      appointmentButtonList : [],
      showModal: false,
      currPatient : "",
      currAppointmentID : "",
      declineMessage : "",
      medicalRecordsList : [],
      currMedicalRecord : "",
      currMedicalRecordName : "",
      showMedicalRecord : false

    };
 

  }

  //filter / search patient by name 
  filterList = event => {
     event.preventDefault();
    var updatedList = this.state.initpatientList;
    updatedList = updatedList.filter(function(item){
      return item.props.value.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });

    this.setState({patientsList : updatedList});
  }

  //Modal handler
  handleModalClose = event => {
    this.setState({ showModal: false });
  }

  handleModalShow = function(appointmentID){
    this.setState({ showModal: true,
                currAppointmentID : appointmentID,
                declineMessage : ""
       });
  }

  hideMedicalRecord = event => {
    this.setState({ showMedicalRecord: false });
  }


  handleDeclineMessage = event => {
    this.setState({declineMessage: event.target.value});
  }

  formatDate(value){
    return value.getMonth()+1 + "/" + value.getDate() + "/" + value.getFullYear();
  }


  //update current appointment List
  updateAppointmentList(patient){
    DB.getAppointments({doctorID : this.props.doctorData._id, patientID: patient._id}, (res) => {
          res.json().then((appointments) => {
              
              const aList = appointments.data.map((appointment, index)=>{
               
                
                    //status check
                    let buttons = "";
                   if(appointment.status === 'pending'){
                        buttons = (<div>
                          <Col md={6}>
                          <Button onClick={() => this.acceptAppointment(patient, appointment._id, 'scheduled')} bsStyle="success" bsSize="small">Accept
                          </Button>
                          </Col>
                               <Col md={6}> 
                               <Button onClick={() => this.handleModalShow(appointment._id)} value="declined" bsStyle="danger" bsSize="small">Decline</Button>
                               </Col>
                          </div>
                          

                          );
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
                             {buttons}
            
                          </Row>
                        </Grid>
                        </ListGroupItem>
                      );
             
              });
              this.setState({appointmentList : aList,
                currPatient : patient
                  });
          });
      });
  }


  //accept the appointment request
  acceptAppointment(patient, appointmentID, status){

      DB.updateAppointments({
      '_id': appointmentID,
      'status': status,
  }, (res) => {

          this.updateAppointmentList(patient);
      });


  }

  //decline request
  declineAppointment(patient){
      DB.updateAppointments({
          '_id' : this.state.currAppointmentID,
          'status' : 'declined',
          'message' : this.state.declineMessage
      }, (res) => {

           this.updateAppointmentList(patient);
            this.setState({ showModal: false });
      });

  }

    //read medical Record as pdf
  readMedicalRecord(patient, index){
    console.log(patient);
    console.log(index);
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

  //update current medicalRecords List
  updateMedicalRecordList(patient){
    DB.getPatient({
      username : patient.username
    },(res) => {

      res.json().then((patient)=>{
        console.log(patient);
         const mrList = patient.data[0].medicalRecords.map((item, index) => 
        <ListGroupItem key={item[index] + index} >
          <a onClick={() => this.readMedicalRecord(patient.data[0], index)}>{item}</a> <Label onClick={()=>this.deleteMedicalRecord(patient.data[0].username, item, index)} bsStyle="danger">Delete</Label>
        </ListGroupItem>
       
      );
      this.setState({
          medicalRecordsList: mrList,
          currPatient : patient.data[0]
      });

      });
    });
  }

  //delete the medical record
  deleteMedicalRecord(username, item, index){
    
    DB.deleteMedicalRecordRequest({
      username : username,
      requestFile : item,
      index : index

    }, (res) => {

        this.updateMedicalRecordList(this.state.currPatient);
    });
  }

 
  //List item click event
  onClickPatient(patient){
    
    
    const mrList = patient.medicalRecords.map((item, index) => 
        <ListGroupItem key={item[index] + index} >
          <a onClick={() => this.readMedicalRecord(patient, index)}>{item}</a> <Label bsStyle="danger" onClick={()=>this.deleteMedicalRecord(this.state.currPatient.username, item, index)}>Delete</Label>
        </ListGroupItem>
       
      );
    const info = (
      <div className="patient-details">
        <Grid>
          <Row>Username : {patient.username}</Row>
          <Row>Name : {patient.name}</Row>
          <Row>Age : {patient.age}</Row>
          <Row>Email : {patient.email}</Row>
          <Row>Address : {patient.address}</Row>
          <Row>Phone : {patient.phoneNumber}</Row>

          <Row> 
            <FileUpload patient={patient} onUpload={()=>this.updateMedicalRecordList(patient)}/>
          </Row>

        </Grid>
      </div>
    );
      this.setState({
          patientInfo : info,
          medicalRecordsList: mrList
      });

      this.updateAppointmentList(patient);
      

  }

  //get user data from server 
  componentDidMount() {
    DB.getPatients((res) => {
       res.json().then((patients)=>{      
        const pList = patients.data.map((patient)=>
           <ListGroupItem key={patient._id}
              onClick={() => this.onClickPatient(patient)}
              data-category={patient}
              value={patient.name} >

                {patient.name}
              </ListGroupItem>
        );



         this.setState({
          initpatientList : pList,
          patientsList : pList
         });
       });
    });


  }

  

  render() {
    return (
      <Grid className="doctor-view">

        <Row className="user-name">
            Welcome Dr. {this.props.doctorData.name}
        </Row>
       
        <Row className="details-view">
          <Col className="first-col" md={6} >

           <Panel bsStyle="info">
              <Panel.Heading>
                <Panel.Title componentClass="h3">Patients List</Panel.Title>
              </Panel.Heading>
              <Panel.Body> 
               <div>
                <fieldset className="form-group">
                <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList}/>
                </fieldset>
              </div>

              <ListGroup>
                {this.state.patientsList}
              </ListGroup>
              </Panel.Body>
            </Panel>

             
          </Col>
          <Col className="second-col" md={6}>
            <Panel bsStyle="info">
              <Panel.Heading>
                <Panel.Title componentClass="h3">Patient Info</Panel.Title>
              </Panel.Heading>
              <Panel.Body>{this.state.patientInfo}</Panel.Body>
            </Panel>

            <Panel bsStyle="info">
            <Panel.Heading>
              <Panel.Title componentClass="h3">
                Medical Records 
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body> 
              <ListGroup>
                {this.state.medicalRecordsList}
              </ListGroup>
              </Panel.Body>
          </Panel>

             <Panel bsStyle="info">
              <Panel.Heading>
                <Panel.Title componentClass="h3">Appointments</Panel.Title>
              </Panel.Heading>
              <Panel.Body className="appointment-info">
                 <Grid>
                    <Row>
                              <Col md={4}>purpose</Col>
                              <Col md={4}>date</Col>
                              <Col md={4}>status</Col>
                            

                    </Row>  
                    </Grid>
                    <ListGroup>
                        {this.state.appointmentList}
                    </ListGroup>
                  <Modal show={this.state.showModal} onHide={this.handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Send message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
           <form>
              <FormGroup bsSize="large">
                <FormControl type="text" placeholder="Write message here"  value={this.state.declineMessage} onChange={this.handleDeclineMessage}/>
              </FormGroup>
              </form>
              </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={() => this.declineAppointment(this.state.currPatient)}>Send</Button>
            <Button bsStyle="danger" onClick={this.handleModalClose}>Cancel</Button>
          </Modal.Footer>
        </Modal>

          <Modal show={this.state.showMedicalRecord} onHide={this.hideMedicalRecord}>
        <Modal.Header closeButton>
            <Modal.Title>{this.state.currMedicalRecordName}</Modal.Title>
          </Modal.Header>
          
              <FileView data={this.state.currMedicalRecord} />
           
        </Modal>
             
             
              </Panel.Body>
            </Panel>

           
          </Col>
        </Row>

             </Grid>
    );
  }
}

export default DoctorView;