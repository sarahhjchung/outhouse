import React from "react";
import ReportsContainer from "../../Shared/ReportsContainer";
import Header from "../../Shared/Header";
import "./styles.css";
// import { Redirect } from "react-router-dom";

import { getReports } from "../../../actions/report";
import { getWashrooms } from "../../../actions/washroom";

/* Component for the Home page */
class Reports extends React.Component {
  state = {
    reports: getReports(this),
    washrooms: getWashrooms(this),
  };

  constructor(props) {
    super(props);
    this.props.history.push("/reports");
  }

  render() {
    const { currentUser, app } = this.props;

    // if (!currentUser) {
    //   return <Redirect to="/login" />;
    // }

    return (
      <div>
        <Header currentUser={currentUser} app={app} />
        <div className="wrapper">
          <h1>Latest Updates</h1>
        </div>
        <div className="reports"></div>
        <div className="latestUpdates">
          {this.state.reports &&
            this.state.reports.slice(0).reverse().map((r, i) => {
              let washroom = null;
              this.state.washrooms &&
                this.state.washrooms.forEach((w) => {
                  if (w._id === r.washroom) {
                    washroom = w;
                  }
                });
              return (
                <ReportsContainer
                  key={i}
                  washroomTitle={
                    washroom
                      ? `${washroom.location} - ${washroom.name} - ${washroom.gender}`
                      : ""
                  }
                  updateTime={r.updateTime}
                  reportTitle={r.title}
                  content={r.content}
                  adminPage={false}
                />
              );
            })}
        </div>
      </div>
    );
  }
}

export default Reports;
