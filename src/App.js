import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./libs/errorLib";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const history = useHistory();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userGroups, setUserGroups] = useState([""]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function onLoad() {
      try {
        await Auth.currentSession();
        let user =  await Auth.currentAuthenticatedUser();
        let userGroups = await user.signInUserSession.accessToken.payload["cognito:groups"];
        setUserGroups(userGroups);
        console.log(userGroups);
        setIsAdmin(userGroups.includes("AdminUsers") ? true : false);
        console.log(isAdmin);
        userHasAuthenticated(true);
      }
      catch(e) {
        if (e !== 'No current user') {
          onError(e);
        }
      }
      setIsAuthenticating(false);
    }
    onLoad();
  }, [isAdmin]);



  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);
    history.push("/login");
  }
  return (
    !isAuthenticating && (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Patient Portal Home</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/profile">
                    <NavItem>Profile</NavItem>
                  </LinkContainer>
                  <NavItem onClick={handleLogout}>Logout</NavItem>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <ErrorBoundary>
          <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated, userGroups, setUserGroups, isAdmin, setIsAdmin }}>
            <Routes />
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
}

export default App;
