import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { onError } from "../../libs/errorLib";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";


export default function NotesForUser() {
  const [records, setRecords] = useState([]);
  const { userPoolUserId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function loadRecords() {
      return API.get("patient-records", `/patients/records/${userPoolUserId}`);
    }

    async function onLoad() {
      try {
        const records = await loadRecords();
        setRecords(records);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [userPoolUserId]);



  function renderRecordsList(records) {
    return records.map((record) =>
      <LinkContainer key={record.recordId} to={`/patients/records/${userPoolUserId}/${record.recordId}`}>
        <ListGroupItem header={record.reason.trim().split("\n")[0]}>
        {"appointment date: " + (record.date ? record.date : "TBD")}
        </ListGroupItem>
      </LinkContainer>
    );
  }


  function renderRecordsForUser() {
    return (
      <div className="records">
        <PageHeader>Appointment Records For Patient</PageHeader>
        <ListGroup>
          {!isLoading && renderRecordsList(records)}
        </ListGroup>
      </div>
    );
  }


  return (
    <div className="NotesForUser">
      {renderRecordsForUser()}
    </div>
  );
}
