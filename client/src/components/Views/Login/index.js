import React from "react";
import { Button } from "@material-ui/core";
import Header from "../../Shared/Header";
import Logo from "../../../assets/Logo.svg";

import "./styles.css";

import { updateLoginForm, login } from "../../../actions/users";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.props.history.push("/login");
  }

  // login form state
  state = {
    username: "",
    password: "",
  };

  render() {
    const { currentUser, app } = this.props;

    return (
      <div>
        <Header currentUser={currentUser} app={app} />

        <div className="loginBox">
          <h2 className="loginHeader">
            Log in to
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
                name="username"
                placeholder="Enter your username"
                onChange={(e) => updateLoginForm(this, e.target)}
              />
            </div>
            <div>
              <label className="loginLabel">Password</label>
              <input
                name="password"
                className="passwordInput"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => updateLoginForm(this, e.target)}
              />
            </div>
          </form>
          <br />
          <div className="loginButton">
            <Button
              variant="outlined"
              onClick={() => login(this, app)}
              style={{
                borderRadius: 20,
                borderColor: "#22223B",
                color: "#22223B",
              }}
            >
              Log in
            </Button>
          </div>
          <a className="signupButton" href="/signup">
            Don't have an account? Sign up here.
          </a>
        </div>
      </div>
    );
  }
}

export default Login;
