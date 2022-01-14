import React from "react";
import Button from "@material-ui/core/Button";
import { AlertTriangle, Trash } from "react-feather";
import "./styles.css";

import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

import { deleteReport } from "../../../actions/report";

class ReportsContainer extends React.Component {
  state = {
    openDeleteModal: false,
  };

  deleteReport = (rid) => {
    deleteReport(rid);
    this.setState({ openDeleteModal: true });
  };

  onCloseDeleteModal = () => {
    this.setState({ openDeleteModal: false });
  };

  render() {
    const {
      washroomTitle,
      updateTime,
      reportTitle,
      content,
      username,
      adminPage,
      rid,
    } = this.props;

    return (
      <div>
        {adminPage && (
          <div className="report-container">
            <div className="info">
              <div className="title-wrapper">
                <AlertTriangle className="alert-triangle" />
                <div className="temp">
                  <h3 className="title">
                    <b>{reportTitle}</b>
                  </h3>
                  <Button
                    aria-label="delete"
                    onClick={() => this.deleteReport(rid)}
                    className="delete-report"
                    style={{
                      borderWidth: "2px",
                      borderRadius: 10,
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>

              <p className="shift-right">
                <b>{washroomTitle}</b>
              </p>
              <p className="shift-right">
                <b>{username}</b>
              </p>
              <p className="shift-right">{updateTime}</p>
              <p className="shift-right">{content}</p>
            </div>
          </div>
        )}
        {!adminPage && (
          <div className="reportsContainer">
            <h4 className="washroomTitle"> {washroomTitle} </h4>
            <p className="updateTime"> {updateTime} </p>
            <p className="reportTitle"> {reportTitle} </p>
            <p className="content"> {content}</p>
          </div>
        )}
        <Modal
          open={this.state.openDeleteModal}
          onClose={this.onCloseDeleteModal}
          classNames={{
            overlay: "customOverlay",
            modal: "review-modal",
          }}
        >
          <div className="new-review-message">
            <h3>Report deleted! 👏</h3>
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

export default ReportsContainer;
