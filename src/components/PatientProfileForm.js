import React from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
//import "./PatientProfile.css";
import { useFormFields } from "../libs/hooksLib";
import LoaderButton from "./LoaderButton";

export default function PatientProfileForm({ isLoading, onSubmit, profile, ...props }) {
  const [fields, handleFieldChange] = useFormFields({
    name:profile.name,
    birthdate:profile.birthdate,
    gender:profile.gender,
    email:profile.email,
    address:profile.address,
    phone_number:profile.phone_number,
  });


  async function handleSubmitClick(event) {
    event.preventDefault();
    const fieldsToUpdate = {};
    for (const [key, value] of Object.entries(fields)) {
        if(value !== undefined) {
            fieldsToUpdate[key] = value;
        }
    }
    console.log(fieldsToUpdate);
    onSubmit(fieldsToUpdate);
  }

  function validateForm() {
    return true;
  }

  return (
    <div className="Profile">
      <form onSubmit={handleSubmitClick}>
        <h6 class="heading-small text-muted mb-4">Patient Information</h6>
        <div class="pl-lg-4">
            <div class="row">
                <div class="col-md-12">
                    <FormGroup controlId="name" bsSize="large">
                        <ControlLabel>Full Name</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={fields.name}
                            onChange={handleFieldChange}
                        />
                    </FormGroup>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6">
                    <FormGroup controlId="birthdate" bsSize="large">
                        <ControlLabel>Birth Date</ControlLabel>
                        <FormControl
                            autoFocus
                            type="date"
                            value={fields.birthdate}
                            onChange={handleFieldChange}
                        />
                    </FormGroup>
                </div>
                <div class="col-lg-6">
                    <FormGroup controlId="gender" bsSize="large">
                        <ControlLabel>Gender</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={fields.gender}
                            onChange={handleFieldChange}
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
        <hr class="my-4"></hr>
        <h6 class="heading-small text-muted mb-4">Contact Information</h6>
        <div class="pl-lg-4">
            <div class="row">
                <div class="col-md-12">
                    <FormGroup controlId="address" bsSize="large">
                        <ControlLabel>Home Address</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={fields.address}
                            onChange={handleFieldChange}
                        />
                    </FormGroup>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6">
                    <FormGroup controlId="phone_number" bsSize="large">
                        <ControlLabel>Phone Number</ControlLabel>
                        <FormControl
                            autoFocus
                            type="tel"
                            value={fields.phone_number}
                            onChange={handleFieldChange}
                        />
                    </FormGroup>
                </div>
                <div class="col-lg-6">
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email Address</ControlLabel>
                        <FormControl
                            autoFocus
                            type="email"
                            value={fields.email}
                            onChange={handleFieldChange}
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
        <LoaderButton
        block
        type="submit"
        bsSize="large"
        bsStyle="primary"
        isLoading={isLoading}
        disabled={!validateForm()}
        >
            Save Profile
        </LoaderButton>
      </form>
    </div>
  );
}
