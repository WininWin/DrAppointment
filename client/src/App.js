import React from 'react';
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import Routes from "./appconfig/Routes";
import Auth from "./appconfig/Auth.js";

import "./css/index.css";


class App extends React.Component {

  render() {
   
    return (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Dr.Appointments</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
            <Navbar.Collapse>
          <Nav pullRight>
          {!Auth.isUserAuthenticated() ? (
           <NavItem href="/">Login</NavItem>
            ): (

             <NavItem onClick={Auth.deauthenticateUser} href="/">Logout</NavItem>
            )
          }
          
          </Nav>
        </Navbar.Collapse>
        </Navbar>
           <Routes />
      </div>
    );
  }
}

export default App;
