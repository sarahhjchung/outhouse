import React from "react";
import Header from "../../Shared/Header";
import WashroomContainer from "../../Shared/WashroomContainer";
import { getWashrooms } from "../../../actions/washroom";

import "./styles.css";
import CampusMap from "./campusMap.js";

class Map extends React.Component {
  state = {
    isLoggedIn: true,
    isAdmin: true,
    washrooms: [],
    highlight: null,
  };

  constructor(props) {
    super(props);
    getWashrooms(this);
    this.props.history.push("/map");
  }

  render() {
    const { currentUser } = this.props;

    const scrollTo = (wid) => {
      this.setState({ highlight: wid });
    };

    return (
      <div>
        <Header currentUser={currentUser} className="header" />
        <div className="mapPage">
          <div className="reviewsBar">
            <h1 className="lessTopMargin">Find a bathroom</h1>
            <div className="washroomReviews">
              {this.state.washrooms &&
                this.state.washrooms.map((w, i) => {
                  if (this.state.highlight !== w._id) {
                    return (
                      <WashroomContainer
                        key={i}
                        className="washroomContainer"
                        washroom={w}
                        highlight={false}
                      />
                    );
                  } else {
                    return (
                      <WashroomContainer
                        key={i}
                        className="washroomContainer"
                        washroom={w}
                        highlight={true}
                      />
                    );
                  }
                })}
              <div className="placeHolder"></div>
            </div>
          </div>
          <div className="mapView">
            <CampusMap
              className="campusMap"
              washrooms={this.state.washrooms}
              scrollTo={scrollTo}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
