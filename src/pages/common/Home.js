import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../../libs/contextLib";
import { onError } from "../../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";


export default function Home() {
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const { isAuthenticated } = useAppContext();
  const { isAdmin } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        if (isAdmin) {
          const users = await loadUsers();
          setUsers(users);
        } else {
          const notes = await loadNotes();
          setNotes(notes);
        }
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return API.get("patient-records", "/patientRecords");
  }

  function loadUsers() {
    return API.get("patient-records", "/patients")
  }

  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.recordId} to={`/records/${note.recordId}`}>
          <ListGroupItem header={note.reason.trim().split("\n")[0]}>
            {"appointment date: " + (note.date ? note.date : "TBD")}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/records/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new appointment record
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }


  function renderUsersList(users) {
    return users.map((user, i) =>
        <LinkContainer key={user.Username} to={`/patients/profile/${user.Username}`}>
          <ListGroupItem header={user.Name}>
            {"Created: " + new Date(user.UserCreateDate).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Dr Sanjay Agarwal's Patient Portal</h1>
        <p className="text-muted">Maintain all your dermatology records in one place</p>
        <div className="pt-3">
          <Link to="/login" className="btn btn-info btn-lg mr-3">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Appointment Records</PageHeader>
        <ListGroup>
          {!isLoading && renderNotesList(notes)}
        </ListGroup>
      </div>
    );
  }

  function renderUsers() {
    return (
      <div className="users">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Patients</h2>
        <ListGroup>{!isLoading && renderUsersList(users)}</ListGroup>
      </div>
    );
  }



  return (
    <div className="Home">
      {!isAuthenticated ? renderLander() : isAdmin ? renderUsers() : renderNotes()}
    </div>
  );
}
