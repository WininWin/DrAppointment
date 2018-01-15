import React, { Component } from "react";
import Login from "./Login";
import UserView from "./UserView";
import Auth from "../appconfig/Auth.js";


export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
        {!Auth.isUserAuthenticated() ? (
          <Login /> 
          ): (
            <UserView />
          )
        }
        </div>
      </div>
    );
  }
}