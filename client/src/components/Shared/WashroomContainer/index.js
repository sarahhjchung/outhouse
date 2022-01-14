import React from "react";
import Button from "@material-ui/core/Button";
import { getReviews } from "../../../actions/review";
import "./styles.css";
import { Droplet, Tool, Lock } from "react-feather";
import toilet from "../../../assets/toilet.png";

class WashroomContainer extends React.Component {
  state = {
    reviews: getReviews(this),
  };

  constructor(props) {
    super(props);
    this.scrollDiv = React.createRef();
  }

  render() {
    const { washroom, highlight } = this.props;

    const scrollHandler = () => {
      console.log(this.scrollDiv.current);
      this.scrollDiv.current.scrollIntoView({ behavior: "smooth" });
    };

    if (highlight) {
      scrollHandler();
    }

    return (
      <div
        ref={this.scrollDiv}
        className={
          "washroomContainer " + (highlight ? "highlightWashroom" : "")
        }
      >
        <div className="washroomWrapper">
            <img src={toilet} alt="toilet" className="toilet" />

          <div className="washroomInfo">
            <h3>{washroom.name}</h3>
            <h3>{washroom.location}</h3>
            <h3>{washroom.gender}</h3>
            <p>{washroom.amenities}</p>
          </div>
        </div>
        <hr className="line" />
        <h3 className="bold">Reviews</h3>
        {this.state.reviews &&
          this.state.reviews.map((r) => {
            let review = null;
            washroom.reviews.forEach((r_id) => {
              if (r_id === r._id) {
                review = r;
              }
            });
            if (review) {
              return (
                <div
                  className="reviewContainer"
                  key={String(review._id) + String(washroom._id)}
                >
                  <p className="review">{review.content}</p>
                  
                <span className="ratingsContainer">
                    <span className="ratingsMap">
                    <Droplet /> &nbsp; <b>{review.cleanliness}</b>
                    </span>
                    <span className="ratingsMap">
                        &nbsp; <Tool /> &nbsp; <b>{review.functionality}</b>
                    </span>
                    <span className="ratingsMap">
                        &nbsp; <Lock /> &nbsp; <b>{review.privacy}</b>
                    </span>
                </span>
                  
                <span className="num">
                    <b>{review.likes}</b> Likes&nbsp;{" "}
                </span>
                <span className="num">
                    &nbsp;<b>{review.dislikes}</b> Dislikes
                </span>

                </div>
              );
            } else {
              return <></>;
            }
          })}
        <a className="seeAllReviews" href={"/reviews/" + washroom._id}>
          Show more...
        </a>

        <div className="buttonsRow">
          <div className="button">
            <Button
              style={{
                borderRadius: 30,
                borderColor: "#4A4E69",
                color: "#4A4E69",
              }}
              variant="outlined"
              size="small"
              href={"/reviewform/" + washroom._id}
            >
              Leave a review
            </Button>
          </div>
          <div className="button">
            <Button
              style={{
                borderRadius: 30,
                borderColor: "#4A4E69",
                color: "#4A4E69",
              }}
              variant="outlined"
              href={"/reportform/" + washroom._id}
              size="small"
            >
              Make a report
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default WashroomContainer;
