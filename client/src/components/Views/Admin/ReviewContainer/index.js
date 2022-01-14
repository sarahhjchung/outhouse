import React from "react";
import Button from "@material-ui/core/Button";
import "./styles.css";
import { Trash, MessageSquare } from "react-feather";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

import { deleteReview } from "../../../../actions/review";

class ReviewContainer extends React.Component {
  state = {
    openDeleteModal: false,
  };

  deleteReview = (uid, rid) => {
    deleteReview(uid, rid);
    this.setState({ openDeleteModal: true });
  };

  onCloseDeleteModal = () => {
    this.setState({ openDeleteModal: false });
  };

  render() {
    const {
      washroomTitle,
      username,
      date,
      text,
      cleanliness,
      functionality,
      privacy,
      likes,
      dislikes,
      isAdminPage,
      isSelf,
      uid,
      rid,
    } = this.props;

    return (
      <div className="review-container">
        <div className="info">
          <div className="reviewWrapper">
            <div className="reviewHeader">
              <div className="title-wrapper">
                <MessageSquare className="message-square" />
                <h3 className="title">{washroomTitle}</h3>
              </div>
              <p className="shift-right">
                <b>{username}</b>
              </p>
              <p className="shift-right">{date}</p>
            </div>

            <ul className="admin-ratings">
              <li className="rating">
                Cleanliness: <b className="ratings">{cleanliness}</b>
              </li>
              <li className="rating">
                Functionality: <b className="ratings">{functionality}</b>
              </li>
              <li className="rating">
                Privacy: <b className="ratings">{privacy}</b>
              </li>
            </ul>
          </div>

          <p className="review-text shift-right">{text}</p>

          <div className="likes-dislikes shift-right">
            <span>
              <span className="num">
                <b>{likes}</b> Likes&nbsp;{" "}
              </span>
              <span className="num">
                &nbsp;<b>{dislikes}</b> Dislikes
              </span>
            </span>

            {(isAdminPage || isSelf) && (
              <Button
                aria-label="delete"
                onClick={() => this.deleteReview(uid, rid)}
                className="delete-review"
              >
                <Trash />
              </Button>
            )}
          </div>
        </div>
        <Modal
          open={this.state.openDeleteModal}
          onClose={this.onCloseDeleteModal}
          classNames={{
            overlay: "customOverlay",
            modal: "review-modal",
          }}
        >
          <div className="new-review-message">
            <h3>Review deleted! 👏</h3>
            <Button
              href={isAdminPage ? "/admin" : "/profile"}
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
    );
  }
}

export default ReviewContainer;
