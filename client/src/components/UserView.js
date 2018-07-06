import React, { Component } from "react";
import DB from "../appconfig/DB.js";
import Auth from "../appconfig/Auth.js";
import  {Redirect}  from 'react-router-dom';
import DoctorView from "./DoctorView.js";
import PatientView from "./PatientView.js";



class UserView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      role : "",
      data : {}
    };
  }


  //get user data from server 
  componentDidMount() {
    DB.authCheck((res) => {
       res.json().then((user)=>{
        
         this.setState({
          role : user.data.role,
          data : user.data
         });
       });
    });


  }

  render() {

    return (
      <div className='user'>

      {!Auth.isUserAuthenticated() ? (
           <Redirect to={'/'}/>
            ): (

             <div className='user-view'>
                  {
                    this.state.role==='Doctor'?(
                        <DoctorView role={this.state.role} doctorData={this.state.data} />
                      ):
                    (
                       <PatientView role={this.state.role} patientData={this.state.data} />
                      )

                  }

             </div>
            )
          }

      </div>
     
    );
  }
}
export default UserView;