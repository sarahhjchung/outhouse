import React from "react";
import { Button } from "@material-ui/core";
import Header from "../../Shared/Header";
import Logo from "../../../assets/Logo.svg";

import "./styles.css";

import { updateLoginForm, signupUser } from "../../../actions/users";
import { Redirect } from "react-router";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.props.history.push("/signup");
  }

  // signup form state
  state = {
    newusername: "",
    newpassword: "",
    gender: "",
  };

  render() {
    const { currentUser, app } = this.props;
    if (currentUser) {
      return <Redirect to="/map" />;
    }

    return (
      <div>
        <Header currentUser={currentUser} app={app} />

        <div className="loginBox">
          <h2 className="loginHeader">
            Sign up for
            <div className="logo-wrapper">
              <img src={Logo} alt="Outhouse Logo" id="logoLoginImg" />
              <h1 className="loginLogo">Outhouse</h1>
            </div>
          </h2>

          <form className="loginForm">
            <div className="loginInput">
              <label className="loginLabel">Username</label>
              <input
                className="usernameInput"
                name="newusername"
                placeholder="Enter your username"
                onChange={(e) => updateLoginForm(this, e.target)}
              />
            </div>
            <div>
              <label className="loginLabel">Password</label>
              <input
                name="newpassword"
                className="passwordInput"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => updateLoginForm(this, e.target)}
              />
            </div>
            <div className="loginInput">
              <label className="loginLabel">Gender</label>
              <input
                className="genderInput"
                name="gender"
                placeholder="Enter your gender (optional)"
                onChange={(e) => updateLoginForm(this, e.target)}
              />
            </div>
          </form>
          <br />
          <div className="loginButton">
            <Button
              variant="outlined"
              onClick={() =>
                signupUser(
                  this.state.newusername,
                  this.state.newpassword,
                  this.state.gender,
                  app,
                  true
                )
              }
              style={{
                borderRadius: 20,
                borderColor: "#22223B",
                color: "#22223B",
              }}
            >
              Sign up
            </Button>
          </div>
          <a className="signupButton" href="/login">
            Already have an account? Log in here.
          </a>
        </div>
      </div>
    );
  }
}

export default Signup;
