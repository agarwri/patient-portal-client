import React, { useState } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import "./Login.css";
import { Auth } from "aws-amplify";
import { useAppContext } from "../../libs/contextLib";
import { onError } from "../../libs/errorLib";
import { useFormFields } from "../../libs/hooksLib";

export default function Login() {
  const { userHasAuthenticated, setUserGroups } = useAppContext();
  const [fields, handleFieldChange] = useFormFields({
    email:"",
    password:""
  });
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      let user =  await Auth.currentAuthenticatedUser();
      setUserGroups(user.signInUserSession.accessToken.payload["cognito:groups"]);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={fields.password}
            onChange={handleFieldChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </form>
    </div>
  );
}
