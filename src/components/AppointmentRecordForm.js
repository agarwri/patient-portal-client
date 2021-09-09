import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useFormFields } from "../libs/hooksLib";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, ControlLabel, HelpBlock } from "react-bootstrap";
import LoaderButton from "./LoaderButton";
import config from "../config";
import { privateS3Upload, s3Upload } from "../libs/awsLib";
import "./AppointmentRecordForm.css";

export default function AppointmentRecordForm({ saveRecord, deleteRecord, record, ...props }) {

  const [fields, handleFieldChange] = useFormFields({
    date: record.date,
    type: record.type,
    clinic: record.clinic,
    reason: record.reason,
    notes: record.notes,
  });
  const { isAdmin } = useAppContext();
  const selectedFiles = useRef(null);

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectFiles = (event) => {
    selectedFiles.current = event.target.files;
    console.log("selected some files");
  };
  

  function validateForm() {
    return fields.reason.length > 0;
  }

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

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }


  async function handleSubmit(event) {
    event.preventDefault();
    const { date, type, clinic, reason, notes } = fields;

    let newAttachments = [];
    

    const files = selectedFiles.current ? Array.from(selectedFiles.current) : [];
    files.map(file => (validateFile(file)));

    setIsLoading(true);
  
    try {
      var attachment = "";
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log(file.name);
        attachment = isAdmin ? await privateS3Upload(file) : await s3Upload(file);
        console.log(attachment);
        newAttachments.push(attachment);
      }
      let oldAttachments = isAdmin ? record.doctor_attachments : record.attachments;
      const attachments = isAdmin ? record.attachments : [...newAttachments||[], ...oldAttachments||[]];
      const doctor_attachments = isAdmin ? [...newAttachments||[], ...oldAttachments||[]] : record.doctor_attachments;
      await saveRecord({
        date,
        type,
        clinic,
        reason,
        notes,
        attachments: attachments,
        doctor_attachments: doctor_attachments,
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment record?"
    );
    if (!confirmed) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteRecord();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }
 


  return (!isLoading &&
    <div className="MyRecord">
      {record && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="date" class="required">
            <ControlLabel>Appointment Date</ControlLabel>
            <FormControl
              autoFocus
              type="date"
              value={fields.date}
              onChange={handleFieldChange}
            />
            <FormControl.Feedback />
            <HelpBlock>You can leave this empty if you have not confirmed the date of the appointment yet.</HelpBlock>
          </FormGroup>
          <FormGroup controlId="type">
            <ControlLabel>Appointment Type</ControlLabel>
            <FormControl componentClass="select" autoFocus type="text" value={fields.type} onChange={handleFieldChange}>
              <option value="N/A">N/A</option>
              <option value="online">Online</option>
              <option value="physical">Physical</option>
            </FormControl>
            <FormControl.Feedback />
            <HelpBlock>Select N/A if you do not know the appointment type yet.</HelpBlock> 
          </FormGroup>
          <FormGroup controlId="clinic">
            <ControlLabel>Clinic</ControlLabel>
            <FormControl componentClass="select" autoFocus type="text" value={fields.clinic} onChange={handleFieldChange}>
              <option value="N/A">N/A</option>
              <option value="bhowanipur">Bhowanipur</option>
              <option value="cmri">CMRI</option>
              <option value="wizderm">Wizderm</option>
            </FormControl>
            <FormControl.Feedback />
            <HelpBlock>Select N/A if you do not know the clinic.</HelpBlock> 
          </FormGroup>
          <FormGroup controlId="reason">
            <ControlLabel bsClass="required">Reason for Visit</ControlLabel>
            <FormControl
              value={fields.reason}
              placeholder="Please describe your reason for appointment"
              componentClass="textarea"
              onChange={handleFieldChange}
            />
            <FormControl.Feedback />
            <HelpBlock>Please briefly describe your reason for taking an appointment.</HelpBlock> 
          </FormGroup>
          {record.attachments && (
            <FormGroup>
              <ControlLabel>Patient Uploads</ControlLabel>
              <FormControl.Static>
                {record.attachmentURLs.map((attachmentURLObj) =>
                <div>
                  <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={attachmentURLObj.file_url}
                    >
                    {formatFilename(attachmentURLObj.file_name)}
                  </a>
                  <br></br>
                </div>
                )} 
              </FormControl.Static>
            </FormGroup>
          )}
          {!isAdmin && (
            <FormGroup controlId="files">
              <ControlLabel>Upload attachments</ControlLabel>
              <FormControl onChange={selectFiles} type="file" multiple />
              <FormControl.Feedback />
              <HelpBlock>Upload any images, videos or old prescriptions relevant to this appointment.</HelpBlock> 
            </FormGroup>
          )}
          {isAdmin && (
            <FormGroup controlId="notes">
              <ControlLabel>Doctors Notes</ControlLabel>
              <FormControl
                value={fields.notes}
                placeholder="Please describe patient diagnosis and other additional details here"
                componentClass="textarea"
                onChange={handleFieldChange}
              />
            </FormGroup>
          )}
          {isAdmin && record.doctor_attachments && (
            <FormGroup>
              <ControlLabel>Doctor Uploads</ControlLabel>
              <FormControl.Static>
                {record.doctorAttachmentURLs.map((attachmentURLObj) =>
                <div>
                  <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={attachmentURLObj.file_url}
                    >
                    {formatFilename(attachmentURLObj.file_name)}
                  </a>
                  <br></br>
                </div>
                )} 
              </FormControl.Static>
            </FormGroup>
          )}
          {isAdmin && (
            <FormGroup controlId="files">
              <ControlLabel>Upload any media relevant to this appointment</ControlLabel>
              <FormControl onChange={selectFiles} type="file" multiple />
            </FormGroup>
          )}
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
