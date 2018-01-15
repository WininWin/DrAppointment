import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import DB from "../appconfig/DB.js";
import Auth from "../appconfig/Auth.js";
import { Redirect } from 'react-router-dom'
import "../css/index.css";


export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loginCheck : "",
      redirect: false
    };
  }


  //front end validation
  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }


  //password set
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }


  //submit event
  handleSubmit = event => {
    event.preventDefault();

    DB.login( this.state.username, this.state.password, (response)=>
      {
          (function(state){

            response.json().then(function(res){
                  
                  if(!res.success){
                      state.setState({loginCheck : res.message});
                  }

                  else{
                    
                    Auth.authenticateUser(res.token);
                    state.setState({
                      loginCheck : "",
                      redirect: true
                    });
                     
                  }
            });
          

          })(this);
            

       
      });

  }

  render() {

    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Username</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            onSubmit={this.handleSubmit}
          >
            Login
          </Button>
        </form>
         {this.state.redirect && (
          <Redirect to={'/dash'}/>
        )}
        <div className="Login-error">{this.state.loginCheck}</div>
        
      </div>
    );
  }
}