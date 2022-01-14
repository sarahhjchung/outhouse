import React from "react";
import Header from "../../Shared/Header";
import UserContainer from "./UserContainer";
import WashroomAdminContainer from "./WashroomAdminContainer";
import ReviewContainer from "./ReviewContainer";
import ReportsContainer from "../../Shared/ReportsContainer";
import Button from "@material-ui/core/Button";
import { FormControlLabel, FormGroup, Checkbox } from "@material-ui/core";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "./styles.css";
import { PlusCircle } from "react-feather";
import { Redirect } from "react-router";

// Importing actions/required methods
import {
  getWashrooms,
  addWashroom,
  updateWashroom,
} from "../../../actions/washroom";
import { getReviews } from "../../../actions/review";
import { getReports } from "../../../actions/report";
import { addUser, getUsers } from "../../../actions/users";

/* Component for the Admin page */
class Admin extends React.Component {
  state = {
    isLoggedIn: true,
    isAdmin: true,
    openUserModal: false,
    openWashroomModal: false,
    editWashroomModal: false,
    username: "",
    password: "",
    name: "",
    location: "",
    gender: "",
    amenities: "",
    longitude: null,
    latitude: null,
    adminPermission: false,
    users: [],
    reviews: [],
    reports: [],
    washroomId: 0,
    washrooms: [],
  };

  constructor(props) {
    super(props);
    this.props.history.push("/admin");
    getWashrooms(this);
    getUsers(this);
    getReviews(this);
    getReports(this);
  }

  buttonCallback = (childData) => {
    this.setState({ editWashroomModal: childData });
  };

  onClickAdmin = (e) => {
    this.setState({ adminPermission: !this.state.adminPermission });
  };

  onClickAddUser = (e) => {
    e.preventDefault();
    this.setState({ openUserModal: true });
  };

  onCloseAddUser = () => {
    this.setState({ openUserModal: false });
  };

  onClickAddWashroom = (e) => {
    e.preventDefault();
    this.setState({ openWashroomModal: true });
  };

  onCloseAddWashroom = () => {
    this.setState({ openWashroomModal: false });
  };

  onCloseEditWashroom = () => {
    this.setState({ editWashroomModal: false });
  };

  onClickSubmitUser = () => {
    if (
      this.state.username === "" ||
      this.state.password === "" ||
      !this.state.users.every((u) => u.username !== this.state.username)
    ) {
      return;
    }

    addUser(
      this.state.username,
      this.state.password,
      this.state.adminPermission
    );
  };

  onClickSubmitWashroom = () => {
    const washroom = {
      name: this.state.name,
      location: this.state.location,
      gender: this.state.gender,
      amenities: this.state.amenities,
      longitude: this.state.longitude,
      latitude: this.state.latitude,
    };

    if (
      washroom.name === "" ||
      washroom.location === "" ||
      washroom.gender === "" ||
      !washroom.longitude ||
      !washroom.latitude
    ) {
      console.log("Bad request");
      return;
    }
    console.log("Adding washroom...");

    addWashroom(
      washroom.name,
      washroom.location,
      washroom.amenities,
      washroom.gender,
      washroom.longitude,
      washroom.latitude
    );
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  deleteWashroom = (id) => {
    const washrooms = this.state.washrooms.filter((w) => {
      return w.id !== id;
    });
    this.setState({ washrooms: washrooms });
  };

  deleteUser = (id) => {
    const users = this.state.users.filter((u) => {
      return u.username !== id;
    });
    this.setState({ users: users });
  };

  deleteReview = (id) => {
    const reviews = this.state.reviews.filter((r) => {
      return r.id !== id;
    });
    this.setState({ reviews: reviews });
  };

  deleteReport = (id) => {
    const reports = this.state.reports.filter((r) => {
      return r.id !== id;
    });
    this.setState({ reports: reports });
  };

  setWashroomId = (id) => {
    this.setState({ washroomId: id });
  };

  editWashroom = () => {
    const washroom = {
      id: this.state.washroomId,
      name: this.state.name,
      location: this.state.location,
      gender: this.state.gender,
      amenities: this.state.amenities,
      longitude: this.state.longitude,
      latitude: this.state.latitude,
    };

    if (
      washroom.name === "" ||
      washroom.location === "" ||
      washroom.gender === "" ||
      !washroom.longitude ||
      !washroom.latitude
    ) {
      console.log("Bad Request");
      return;
    }
    console.log("Adding washroom...");

    updateWashroom(
      washroom.name,
      washroom.location,
      washroom.amenities,
      washroom.gender,
      washroom.longitude,
      washroom.latitude,
      washroom.id
    );
  };

  render() {
    const { currentUser, app } = this.props;

    if (currentUser && currentUser.type === "user") {
      return <Redirect to="/map" />;
    }

    return (
      <div>
        <Header currentUser={currentUser} app={app} />
        <h1 className="admin-portal-title">Admin Portal</h1>
        <div className="user-washroom-container">
          <div className="users">
            <div className="titleButtonContainer">
              <h2 className="data-title">All Users</h2>
              <Button
                aria-label="add"
                onClick={this.onClickAddUser}
                className="add-button"
              >
                <PlusCircle />
                &nbsp;New User
              </Button>
            </div>

            <Modal
              open={this.state.openUserModal}
              onClose={this.onCloseAddUser}
              classNames={{
                overlay: "customOverlay",
                modal: "user-modal",
              }}
            >
              <div className="add-user-box">
                <h2>Add a New User</h2>
                <form className="add-form">
                  <label className="input-label">Username</label>
                  <input
                    className="username-input"
                    name="username"
                    placeholder="Enter your username (Required)"
                    onChange={this.handleChange}
                  />
                  <label className="input-label">Password</label>
                  <input
                    name="password"
                    className="password-input"
                    placeholder="Enter your password (Required)"
                    onChange={this.handleChange}
                  />
                </form>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="default"
                        checked={this.state.adminPermission}
                        onChange={this.onClickAdmin}
                      />
                    }
                    label="Give Admin Privileges"
                  />
                </FormGroup>
                <div className="modal-button">
                  <Button
                    variant="outlined"
                    href="/admin"
                    onClick={this.onClickSubmitUser}
                  >
                    Add User
                  </Button>
                </div>
              </div>
              <br />
            </Modal>

            <div className="data-container">
              {this.state.users.map((u) => {
                return (
                  <UserContainer
                    username={u.username}
                    uid={u._id}
                    currentUser={currentUser._id}
                  />
                );
              })}
            </div>
          </div>
          <br />

          <div className="washrooms">
            <div className="titleButtonContainer">
              <h2 className="data-title">All Washrooms</h2>
              <Button
                aria-label="delete"
                onClick={this.onClickAddWashroom}
                className="add-button"
              >
                <PlusCircle />
                &nbsp;New Washroom
              </Button>
            </div>

            <Modal
              open={this.state.openWashroomModal}
              onClose={this.onCloseAddWashroom}
              classNames={{
                overlay: "customOverlay",
                modal: "washroom-modal",
              }}
            >
              <div className="add-washroom-box">
                <h2>Add a New Washroom</h2>
                <form className="add-form">
                  <label className="input-label">Washroom Name</label>
                  <input
                    className="washroom-input"
                    name="name"
                    placeholder="Enter washroom name (Required)"
                    onChange={this.handleChange}
                  />
                  <label className="input-label">Location</label>
                  <input
                    name="location"
                    className="washroom-input"
                    placeholder="Enter washroom location (Required)"
                    onChange={this.handleChange}
                  />
                  <label className="input-label">Gender</label>
                  <input
                    name="gender"
                    className="washroom-input"
                    placeholder="Enter washroom gender (Required)"
                    onChange={this.handleChange}
                  />
                  <label className="input-label">Amenities</label>
                  <input
                    name="amenities"
                    className="washroom-input"
                    placeholder="Enter washroom amenities"
                    onChange={this.handleChange}
                  />
                  <label className="input-label">Latitude</label>
                  <input
                    name="latitude"
                    className="washroom-input"
                    placeholder="Enter washroom latitude (Required)"
                    onChange={this.handleChange}
                  />
                  <label className="input-label">Longitude</label>
                  <input
                    name="longitude"
                    className="washroom-input"
                    placeholder="Enter washroom longitude (Required)"
                    onChange={this.handleChange}
                  />
                </form>
                <div className="modal-button">
                  <Button
                    href="/admin"
                    variant="outlined"
                    onClick={this.onClickSubmitWashroom}
                  >
                    Add Washroom
                  </Button>
                </div>
              </div>
              <br />
            </Modal>
            <div className="data-container">
              {this.state.washrooms.map((w) => {
                return (
                  <>
                    <WashroomAdminContainer
                      id={w._id}
                      washroomName={w.name}
                      gender={w.gender}
                      location={w.location}
                      parentCallback={this.buttonCallback}
                      editCallback={this.setWashroomId}
                    />
                    <Modal
                      open={this.state.editWashroomModal}
                      onClose={this.onCloseEditWashroom}
                      classNames={{
                        overlay: "customOverlay",
                        modal: "edit-modal",
                      }}
                    >
                      <div className="edit-washroom-box">
                        <h2>Edit Washroom Data</h2>
                        <form className="edit-form">
                          <label className="input-label">Washroom Name</label>
                          <input
                            className="washroom-input" // need new input tag??
                            name="name"
                            onChange={this.handleChange}
                            required
                          />
                          <label className="input-label">Location</label>
                          <input
                            name="location"
                            className="washroom-input" // need new input?
                            onChange={this.handleChange}
                          />
                          <label className="input-label">Gender</label>
                          <input
                            name="gender"
                            className="washroom-input" // need new input?
                            onChange={this.handleChange}
                          />
                          <label className="input-label">Amenities</label>
                          <input
                            name="amenities"
                            className="washroom-input" // need new input?
                            onChange={this.handleChange}
                          />
                          <label className="input-label">Latitude</label>
                          <input
                            name="latitude"
                            className="washroom-input"
                            onChange={this.handleChange}
                          />
                          <label className="input-label">Longitude</label>
                          <input
                            name="longitude"
                            className="washroom-input"
                            onChange={this.handleChange}
                          />
                        </form>
                        <div className="modal-button">
                          <Button
                            href="/admin"
                            variant="outlined"
                            onClick={this.editWashroom}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                      <br />
                    </Modal>
                  </>
                );
              })}
            </div>
          </div>
        </div>

        <div className="review-reports-container">
          <div className="reviews">
            <h2 className="data-title">All Reviews</h2>
            <div className="data-container">
              {this.state.reviews &&
                this.state.reviews.map((r, i) => {
                  let user = null;
                  let washroom = null;

                  this.state.users &&
                    this.state.users.forEach((u) => {
                      if (u._id === r.user) {
                        user = u;
                      }
                    });

                  this.state.washrooms &&
                    this.state.washrooms.forEach((w) => {
                      if (w._id === r.washroom) {
                        washroom = w;
                      }
                    });
                  return (
                    <ReviewContainer
                      key={r._id}
                      washroomTitle={
                        washroom
                          ? `${washroom.location} - ${washroom.name} - ${washroom.gender}`
                          : ""
                      }
                      username={user ? user.username : ""}
                      date={r.date}
                      text={r.content}
                      cleanliness={r.cleanliness}
                      functionality={r.functionality}
                      privacy={r.privacy}
                      likes={r.likes}
                      dislikes={r.dislikes}
                      isAdminPage={true}
                      deleteCallback={this.deleteReview}
                      rid={r._id}
                      uid={r.user}
                    />
                  );
                })}
            </div>
          </div>
          <div className="reports">
            <h2 className="data-title">All Reports</h2>
            <div className="data-container">
              {this.state.reports.map((r) => {
                let user = null;
                let washroom = null;

                this.state.users &&
                  this.state.users.forEach((u) => {
                    if (u._id === r.user) {
                      user = u;
                    }
                  });

                this.state.washrooms &&
                  this.state.washrooms.forEach((w) => {
                    if (w._id === r.washroom) {
                      washroom = w;
                    }
                  });

                return (
                  <ReportsContainer
                    key={r._id}
                    washroomTitle={
                      washroom
                        ? `${washroom.location} - ${washroom.name} - ${washroom.gender}`
                        : ""
                    }
                    updateTime={r.updateTime}
                    username={user ? user.username : ""}
                    reportTitle={r.title}
                    content={r.content}
                    adminPage={true}
                    deleteCallback={this.deleteReport}
                    rid={r._id}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
