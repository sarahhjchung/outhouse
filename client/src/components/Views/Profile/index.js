import { Button } from "@material-ui/core";
import React from "react";
import Header from "../../Shared/Header";
import ReviewContainer from "../Admin/ReviewContainer";
import "react-responsive-modal/styles.css";
import "./styles.css";

import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

import { getReviews } from "../../../actions/review";
import { getWashrooms } from "../../../actions/washroom";
import { updateUser } from "../../../actions/users";

class Profile extends React.Component {
  state = {
    reviews: getReviews(this),
    washrooms: getWashrooms(this),
    username: "",
    gender: "",
  };

  constructor(props) {
    super(props);
    this.props.history.push("/profile");
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  // Edit profile info
  editUser = (username, gender, uid) => {
    updateUser(username, gender, uid);
    this.setState({ openUpdateModal: true });
  };

  onCloseUpdateModal = () => {
    this.setState({ openUpdateModal: false });
  };

  render() {
    const { currentUser, app } = this.props;

    // if (!currentUser) {
    //   return <Redirect to="/login" />;
    // }

    return (
      <div>
        <Header currentUser={currentUser} app={app} />
        <div className="profileHeader">
          <h1>Your Profile</h1>
        </div>

        <div className="profileBox">
          <form className="profileForm">
            <div className="profileLine">
              <label className="profileLabel">Username</label>
              <div className="profileSameLine">
                <input
                  className="profileInput"
                  name="username"
                  placeholder={currentUser ? currentUser.username : ""}
                  onChange={this.handleChange}
                />
                <div className="editButton">
                  <Button
                    name="editUsernameButton"
                    style={{
                      borderRadius: 35,
                      borderColor: "#22223B",
                      color: "#22223B",
                    }}
                    variant="outlined"
                    onClick={() => {
                      this.editUser(
                        this.state.username,
                        currentUser.gender,
                        currentUser._id
                      );
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
            <div className="profileLine">
              <label className="profileLabel">Gender</label>
              <div className="profileSameLine">
                <input
                  className="profileInput"
                  name="gender"
                  placeholder={currentUser ? currentUser.gender : ""}
                  onChange={this.handleChange}
                />
                <div className="editButton">
                  <Button
                    name="editGenderButton"
                    style={{
                      borderRadius: 35,
                      borderColor: "#22223B",
                      color: "#22223B",
                    }}
                    variant="outlined"
                    onClick={() => {
                      this.editUser(
                        currentUser.username,
                        this.state.gender,
                        currentUser._id
                      );
                    }}
                  >
                    Edit
                  </Button>
                </div>
                <Modal
                  open={this.state.openUpdateModal}
                  onClose={this.onCloseUpdateReview}
                  classNames={{
                    overlay: "customOverlay",
                    modal: "review-modal",
                  }}
                >
                  <div className="new-review-message">
                    <h3>Profile updated! 👏</h3>
                    <Button
                      href="/profile"
                      variant="outlined"
                      style={{
                        borderWidth: "2px",
                        borderRadius: 15,
                        borderColor: "#22223B",
                        color: "#22223B",
                      }}
                    >
                      Go Back
                    </Button>
                  </div>
                </Modal>
              </div>
            </div>
          </form>

          <div className="profileReviewsContainer">
            <div className="profileHeader">
              <h3>Reviews you've written</h3>
            </div>
            <div>
              {this.state.reviews &&
                this.state.reviews.map((r, i) => {
                  let review = null;
                  currentUser &&
                    currentUser.reviews.forEach((rid) => {
                      if (rid === r._id) {
                        review = r;
                      }
                    });

                  let washroom = null;
                  this.state.washrooms &&
                    review &&
                    this.state.washrooms.forEach((w) => {
                      if (w._id === review.washroom) {
                        washroom = w;
                      }
                    });

                  if (review) {
                    return (
                      <ReviewContainer
                        washroomTitle={
                          washroom
                            ? `${washroom.location} - ${washroom.name}\n${washroom.gender}`
                            : ""
                        }
                        username={currentUser ? currentUser.username : ""}
                        date={review.date}
                        text={review.content}
                        cleanliness={review.cleanliness}
                        functionality={review.functionality}
                        privacy={review.privacy}
                        likes={review.likes}
                        dislikes={review.dislikes}
                        isAdminPage={false}
                        isSelf={true}
                        uid={currentUser ? currentUser._id : ""}
                        rid={r._id}
                      />
                    );
                  } else {
                    return <></>;
                  }
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
