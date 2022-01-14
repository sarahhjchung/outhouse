import React from "react";
import styled from "styled-components";
import Slider from "../../Shared/Slider";
import Header from "../../Shared/Header";
import "./styles.css";
import Button from "@material-ui/core/Button";
import { Droplet, Tool, Lock } from "react-feather";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { addReview } from "../../../actions/review";
import { getWashroom } from "../../../actions/washroom";

/* Component for the Home page */
const Styles = styled.div`
  .Slider {
    margin: 40px 0px;
    font-weight: 500;
    width: 100%;
    color: #f2e9e4;
  }
  .value {
    color: #f2e9e4;
    font-size: 24px;
    padding-left: 8px;
  }
`;

class ReviewForm extends React.Component {
  state = {
    isLoggedIn: true,
    isAdmin: true,
    washroom: getWashroom(this, this.props.match.params.washroom_id),
    cleanliness: 3,
    functionality: 3,
    privacy: 3,
    reviewContent: "",
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  handleSliderChange = (type, value) => {
    this.setState({ [type]: value });
  };

  // Submit review function call:
  // creates a new review for this washroom and adds to data.js
  // review should now show up in other pages of webapp
  submitReview = (washroom, uid) => {
    addReview(
      washroom._id,
      this.state.cleanliness,
      this.state.functionality,
      this.state.privacy,
      this.state.reviewContent,
      uid
    );
    this.setState({ openReviewModal: true });
  };

  onCloseSubmitReview = () => {
    this.setState({ openReviewModal: false });
  };

  render() {
    const { currentUser, app } = this.props;
    const washroom = this.state.washroom;

    return (
      <Styles>
        <div>
          <Header currentUser={currentUser} app={app} />
          <div className="reviewFormContainer">
            <div className="reviewFormTitle">
              <h2>
                Reviewing <br />
                {washroom
                  ? washroom.location +
                    " - " +
                    washroom.name +
                    " - " +
                    washroom.gender
                  : ""}
              </h2>
            </div>
            <div className="Slider">
              <div className="criteria-wrapper">
                <h3 className="criteria-wrapper-title">
                  <Droplet /> &nbsp; Cleanliness
                </h3>
                <p>Give a higher score if this washroom is clean.</p>
                <Slider
                  onChange={this.handleChange}
                  name="cleanliness"
                  color="#F2E9E4"
                  type="cleanliness"
                  handleSliderChange={this.handleSliderChange}
                />
              </div>

              <div className="criteria-wrapper">
                <h3 className="criteria-wrapper-title">
                  <Tool /> &nbsp; Functionality
                </h3>
                <p>
                  Give a higher score if fixtures in this washroom function
                  properly.
                </p>
                <Slider
                  onChange={this.handleChange}
                  name="functionality"
                  color="#F2E9E4"
                  type="functionality"
                  handleSliderChange={this.handleSliderChange}
                />
              </div>

              <div className="criteria-wrapper">
                <h3 className="criteria-wrapper-title">
                  <Lock /> &nbsp; Privacy
                </h3>
                <p>Give a higher score the more private this washroom is.</p>
                <Slider
                  onChange={this.handleChange}
                  name="privacy"
                  color="#F2E9E4"
                  type="privacy"
                  handleSliderChange={this.handleSliderChange}
                />
              </div>
            </div>
            <div className="comments">
              <label className="commentsLabel">
                <h3>Additional Comments</h3>How your experience in this
                washroom? Let it all out (again).
              </label>
              <textarea
                onChange={this.handleChange}
                className="reviewContent"
                name="reviewContent"
                rows="5"
              />
            </div>
            <div className="wrapper">
              <Button
                variant="outlined"
                aria-label="submit"
                onClick={() => this.submitReview(washroom, currentUser._id)}
                className="submitReview"
                style={{
                  borderWidth: "3px",
                  borderRadius: 10,
                  borderColor: "#F2E9E4",
                  color: "#F2E9E4",
                }}
              >
                Submit
              </Button>
            </div>
            <Modal
              open={this.state.openReviewModal}
              onClose={this.onCloseSubmitReview}
              classNames={{
                overlay: "customOverlay",
                modal: "review-modal",
              }}
            >
              <div className="new-review-message">
                <h3>New Review Added! 👏</h3>
                <Button
                  href="/map"
                  variant="outlined"
                  style={{
                    borderWidth: "2px",
                    borderRadius: 15,
                    borderColor: "#22223B",
                    color: "#22223B",
                  }}
                >
                  {" "}
                  Go Home
                </Button>
              </div>
            </Modal>
          </div>
        </div>
      </Styles>
    );
  }
}

export default ReviewForm;
