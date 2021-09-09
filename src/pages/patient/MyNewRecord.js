import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import { onError } from "../../libs/errorLib";
import config from "../../config";
import { useFormFields } from "../../libs/hooksLib";
import { API } from "aws-amplify";
import { s3Upload } from "../../libs/awsLib";


export default function MyNewRecord() {
  const selectedFiles = useRef(null);
  const [fields, handleFieldChange] = useFormFields({
    date:"",
    type:"",
    clinic:"",
    reason:"",
  });
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);


  function validateForm() {
    return fields.reason.length > 0;
  }


  const selectFiles = (event) => {
    selectedFiles.current = event.target.files;
    console.log("selected some files");
  };

  function validateFile(file) {
    if (file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const files = selectedFiles.current ? Array.from(selectedFiles.current) : [];
    console.log(files);
    const {date, type, clinic, reason} = fields;
    files.map(file => (validateFile(file)));
    const attachments = [];
    var attachment = "";
    setIsLoading(true);
    try {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log(file.name);
        attachment = await s3Upload(file);
        console.log(attachment);
        attachments.push(attachment);
      }
      console.log(attachments);
      await createRecord({ date, type, clinic, reason, attachments });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createRecord(record) {
    return API.post("patient-records", "/patientRecords", {
      body: record
    }); 
  }


  

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="date">
          <ControlLabel>Appointment Date</ControlLabel>
          <FormControl
            autoFocus
            type="date"
            value={fields.date}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="type">
          <ControlLabel>Appointment Type</ControlLabel>
          <FormControl componentClass="select" autoFocus type="text" value={fields.type} onChange={handleFieldChange}>
            <option value="online">Online</option>
            <option value="physical">Physical</option>
          </FormControl>  
        </FormGroup>
        <FormGroup controlId="clinic">
          <ControlLabel>Clinic</ControlLabel>
          <FormControl componentClass="select" autoFocus type="text" value={fields.clinic} onChange={handleFieldChange}>
            <option value="N/A">N/A</option>
            <option value="bhowanipur">Bhowanipur</option>
            <option value="cmri">CMRI</option>
            <option value="wizderm">Wizderm</option>
          </FormControl> 
        </FormGroup>
        <FormGroup controlId="reason">
          <ControlLabel>Reason for Visit</ControlLabel>
          <FormControl
            value={fields.reason}
            placeholder="Please describe your reason for appointment"
            componentClass="textarea"
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="files">
          <ControlLabel>Upload any images, videos or old prescriptions relevant to this appointment</ControlLabel>
          <FormControl onChange={selectFiles} type="file" multiple />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create Appointment Record
        </LoaderButton>
      </form>
    </div>
  );
}
