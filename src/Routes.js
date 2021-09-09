import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/common/Home";
import Login from "./pages/common/Login"
import Signup from "./pages/common/Signup"
import NotFound from "./pages/common/NotFound";
import Profile from "./pages/common/Profile";
import MyNewRecord from "./pages/patient/MyNewRecord";
import MyRecord from "./pages/patient/MyRecord";
import RecordsForPatient from "./pages/doctor/RecordsForPatient";
import RecordForPatient from "./pages/doctor/RecordForPatient";
import ProfileForPatient from "./pages/doctor/ProfileForPatient";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/profile">
        <Profile />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/records/new">
        <MyNewRecord />
      </AuthenticatedRoute>  
      <AuthenticatedRoute exact path="/records/:id">
        <MyRecord />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/patients/profile/:userPoolUserId">
        <ProfileForPatient />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/patients/records/:userPoolUserId">
        <RecordsForPatient />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/patients/records/:userPoolUserId/:id">
        <RecordForPatient />
      </AuthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
