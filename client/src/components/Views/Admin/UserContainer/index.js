import React from "react";
import "./styles.css";
import Button from "@material-ui/core/Button";
import { User, Trash } from "react-feather";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

import { deleteUser } from "../../../../actions/users";

class UserContainer extends React.Component {
  state = {
    openDeleteModal: false,
  };

  deleteUser = (uid) => {
    deleteUser(uid);
    this.setState({ openDeleteModal: true });
  };

  onCloseDeleteModal = () => {
    this.setState({ openDeleteModal: false });
  };

  render() {
    const { username, uid, currentUser } = this.props;

    return (
      <div className="user-container">
        <div className="user-container-text">
          <div className="user-container-left-side">
            <User className="user-icon" />
            <h3 className="user-title">
              <b>{username}</b>
            </h3>
          </div>
          {uid !== currentUser && (
            <Button
              aria-label="delete"
              onClick={() => this.deleteUser(uid)}
              className="user-container-delete-btn"
              style={{
                borderWidth: "2px",
                borderRadius: 10,
                color: "#F2E9E4",
                width: "40px",
                height: "40px",
              }}
            >
              <Trash />
            </Button>
          )}
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
            <h3>User deleted! 👏</h3>
            <Button
              href="/admin"
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

export default UserContainer;
