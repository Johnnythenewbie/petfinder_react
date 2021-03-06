import React from "react";
import SignUp from "./pages/signup/SignUp";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AuthState from "./contexts/auth/AuthState";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import PrivateRoute from "./components/PrivateRoute";
import MapComponentState from "./contexts/mapComponent/MapComponentState";

function App() {
  return (
    <AuthState>
      <MapComponentState>
        <BrowserRouter>
          <Switch>
            {/* //todo: change "/" to private route */}
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </BrowserRouter>
      </MapComponentState>
    </AuthState>
  );
}

export default App;
