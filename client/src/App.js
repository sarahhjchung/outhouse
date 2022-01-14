import React from "react";

// Importing react-router-dom to use the React Router
import { Route, Switch, BrowserRouter } from "react-router-dom";
import "./App.css";

import Login from "./components/Views/Login";
import Signup from "./components/Views/Signup";
import Map from "./components/Views/Map";
import Reviews from "./components/Views/Reviews";
import Reports from "./components/Views/Reports";
import Profile from "./components/Views/Profile";
import Admin from "./components/Views/Admin";
import ReviewForm from "./components/Views/ReviewForm";
import ReportForm from "./components/Views/ReportForm";

import { checkSession } from "./actions/users";

class App extends React.Component {
  componentDidMount() {
    checkSession(this); // sees if a user is logged in
  }

  // global state passed down includes the current logged in user.
  state = {
    currentUser: null,
  };

  render() {
    const { currentUser } = this.state;
    console.log(currentUser);

    document.title = "Outhouse";
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path={["/", "/login", "/admin"]}
              render={(props) => (
                <div>
                  {!currentUser ? (
                    <Login {...props} currentUser={currentUser} app={this} />
                  ) : (
                    <Admin {...props} currentUser={currentUser} app={this} />
                  )}
                </div>
              )}
            />
            <Route
              exact
              path="/signup"
              render={(props) => (
                <div>
                  <Signup {...props} currentUser={currentUser} app={this} />
                </div>
              )}
            />
            <Route
              exact
              path="/map"
              render={(props) => (
                <div>
                  <Map {...props} currentUser={currentUser} app={this} />
                </div>
              )}
            />
            <Route
              exact
              path="/reports"
              render={(props) => (
                <div>
                  <Reports {...props} currentUser={currentUser} app={this} />
                </div>
              )}
            />
            <Route
              exact
              path="/reviews/:washroom_id"
              render={(props) => (
                <div>
                  <Reviews {...props} currentUser={currentUser} app={this} />
                </div>
              )}
            />
            <Route
              exact
              path="/profile"
              render={(props) => (
                <div>
                  <Profile {...props} currentUser={currentUser} app={this} />
                </div>
              )}
            />
            <Route
              exact
              path="/reviewform/:washroom_id"
              render={(props) => (
                <div>
                  <ReviewForm {...props} currentUser={currentUser} app={this} />
                </div>
              )}
            />
            <Route
              exact
              path="/reportform/:washroom_id"
              render={(props) => (
                <div>
                  <ReportForm {...props} currentUser={currentUser} app={this} />
                </div>
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
