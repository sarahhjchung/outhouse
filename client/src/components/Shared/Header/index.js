import React from "react";

import "./styles.css";
import Logo from "../../../assets/Logo.svg";

import { logout } from "../../../actions/users";

class Header extends React.Component {
  render() {
    const { currentUser, app } = this.props;

    return (
      <div className="navbar">
        {currentUser && (
          <a href="/map" id="logo">
            <img src={Logo} alt="Outhouse Logo" id="logoImg" />
            <span className="outhouse-title">Outhouse</span>
          </a>
        )}
        {currentUser ? (
          <div className="navbarLinks">
            <a href="/map" className="navbarItem">
              Map
            </a>
            <a href="/reports" className="navbarItem">
              Reports
            </a>
            <a href="/profile" className="navbarItem">
              Profile
            </a>
            {currentUser.type === "admin" && (
              <a href="/admin" className="navbarItem">
                Portal
              </a>
            )}
            <a onClick={() => logout(app)} href="/login" className="navbarItem">
              Logout
            </a>
          </div>
        ) : (
          <div className="navbarLinks">
            <a href="/login" className="navbarItem">
              Login
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default Header;
