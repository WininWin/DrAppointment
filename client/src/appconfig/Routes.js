import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import UserView from "../components/UserView";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/dash" component={UserView} />
  </Switch>;
