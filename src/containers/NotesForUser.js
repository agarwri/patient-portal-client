import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";


export default function NotesForUser() {
  const [notes, setNotes] = useState([]);
  const { userPoolUserId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function loadNotes() {
      return API.get("patient-records", `/patients/${userPoolUserId}`);
    }

    async function onLoad() {
      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [userPoolUserId]);



  function renderNotesList(notes) {
    return notes.map((note) =>
      <LinkContainer key={note.recordId} to={`/users/${userPoolUserId}/${note.recordId}`}>
        <ListGroupItem header={note.content.trim().split("\n")[0]}>
          {"Created: " + new Date(note.createdAt).toLocaleString()}
        </ListGroupItem>
      </LinkContainer>
    );
  }


  function renderNotesForUser() {
    return (
      <div className="notes">
        <PageHeader>Records For Patient</PageHeader>
        <ListGroup>
          {!isLoading && renderNotesList(notes)}
        </ListGroup>
      </div>
    );
  }


  return (
    <div className="NotesForUser">
      {renderNotesForUser()}
    </div>
  );
}
