import React from 'react'
import DB from "../appconfig/DB.js";
import {Row, Col, Button,FormGroup, FormControl } from "react-bootstrap";

class FileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      file:null,
      validation: ""
    }
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  //on File submit
  onFormSubmit(e){
     e.preventDefault();

     if(this.state.file === null){

       this.setState({validation:'Upload File',
            file: null
       });
     }
     DB.uploadMedicalRecord(
      this.props.patient,
      this.state.file
    , (res) => {
      if(this.state.file !== null){
          this.setState({validation:'Upload Success',
            file: null
        });

      }

      this.props.onUpload();

     
    });
  }
  //change current file
  onChange(e) {
    const maxAllowedSize = 2000000;


      if(e.target.files[0].size > maxAllowedSize) {
        // Notify the user that their file(s) are too large
         e.target.files = null;
         this.setState({validation:'File is too large',
          file:null})
      }

     else if(e.target.files[0].type !== 'application/pdf') {
        // Notify of invalid file type for file in question
        e.target.files = null;
        this.setState({validation:'File must be pdf format',
          file:null})
      }
      else{
         this.setState({
          validation:'',
          file:e.target.files[0]});
      }
    
   
  }

  componentWillReceiveProps(props) {
    this.inputFile.value = "";
    this.setState({ file:null,
      validation: ""});
  }

 

  render() {
    return (
      <div>
      <form>
        <h4>Medical Record Upload</h4>
        <Row>
          <Col md={6}>
         <FormGroup>
          <FormControl inputRef={input => this.inputFile = input} name="medicalRecord" type="file" onChange={this.onChange}/>


          </FormGroup>
          </Col>
          <Col md={6}>
       
        <Button type="submit" bsStyle="success" bsSize="small" onClick={this.onFormSubmit}>Upload</Button>
            </Col>
        </Row>
      </form>
      {this.state.validation}
      </div>
   );
  }
}



export default FileUpload
