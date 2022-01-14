import React from "react";
import "./styles.css";
import Button from "@material-ui/core/Button";
import { MapPin, Edit2, Trash } from "react-feather";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { deleteWashroom } from "../../../../actions/washroom";

class WashroomAdminContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickEditId = this.onClickEditId.bind(this);
  }

  state = {
    openDeleteModal: false,
  };

  deleteWashroom = (wid) => {
    deleteWashroom(wid);
    this.setState({ openDeleteModal: true });
  };

  onCloseDeleteModal = () => {
    this.setState({ openDeleteModal: false });
  };
  onClickEdit = () => {
    this.props.parentCallback(true);
  };

  onClickEditId = (id) => {
    this.props.editCallback(id);
  };

  render() {
    const { id, washroomName, gender, location } = this.props;

    return (
      <div className="washroom-admin-container">
        <div className="washroom-admin-container-text">
          <div className="title-wrapper">
            <MapPin className="map-pin" />
            <h3 className="title">
              <b>{washroomName}</b> {gender}
            </h3>
          </div>

          <p className="shift-right">{location}</p>
        </div>
        <Button
          onClick={() => this.deleteWashroom(id)}
          className="washroom-admin-container-btn round-btn"
          style={{
            borderWidth: "2px",
            borderRadius: 10,
            color: "#F2E9E4",
            width: "60px",
            height: "60px",
          }}
        >
          <Trash />
        </Button>
        <Button
          onClick={() => {
            this.onClickEdit();
            this.onClickEditId(id);
          }}
          className="washroom-admin-container-btn"
          style={{
            borderWidth: "2px",
            borderRadius: 10,
            color: "#F2E9E4",
            width: "60px",
            height: "60px",
          }}
        >
          <Edit2 />
        </Button>
        <Modal
          open={this.state.openDeleteModal}
          onClose={this.onCloseDeleteModal}
          classNames={{
            overlay: "customOverlay",
            modal: "review-modal",
          }}
        >
          <div className="new-review-message">
            <h3>Washroom deleted! 👏</h3>
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

export default WashroomAdminContainer;
