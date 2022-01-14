import React from "react";
import Header from "../../Shared/Header";
import "./styles.css";
import ReviewContainer from "../Admin/ReviewContainer";
import { getReviews } from "../../../actions/review";
import { getWashroom } from "../../../actions/washroom";
import { getUsers } from "../../../actions/users";

/* Component for the Home page */
class Reviews extends React.Component {
  state = {
    isLoggedIn: true,
    isAdmin: true,
    isReportsPage: true,
    reviews: getReviews(this),
    washroom: getWashroom(this, this.props.match.params.washroom_id),
    users: getUsers(this),
  };

  render() {
    const { currentUser, app } = this.props;

    return (
      <div>
        <Header currentUser={currentUser} app={app} />
        <div className="wrapper">
          <h1>
            {this.state.washroom
              ? `All Reviews for ${this.state.washroom.location} -${" "}
            ${this.state.washroom.name} - ${this.state.washroom.gender}`
              : "All Reviews for Washroom"}
          </h1>
        </div>
        <div className="reports"></div>
        <div className="latestUpdates">
          {this.state.reviews &&
            this.state.reviews.map((r, i) => {
              if (
                this.state.washroom &&
                r.washroom === this.state.washroom._id
              ) {
                let user = null;

                this.state.users &&
                  this.state.users.forEach((u) => {
                    if (u._id === r.user) {
                      user = u;
                    }
                  });
                return (
                  <ReviewContainer
                    key={this.state.washroom._id}
                    washroomTitle={
                      this.state.washroom
                        ? `${this.state.washroom.location} - ${this.state.washroom.name} - ${this.state.washroom.gender}`
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
                    isAdmin={false}
                  />
                );
              }
              return <></>;
            })}
        </div>
      </div>
    );
  }
}

export default Reviews;
