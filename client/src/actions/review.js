// environment configutations
import ENV from "./../config.js";
const API_HOST = ENV.api_host;
// console.log('Current environment:', ENV.env)

// Get all reviews
export const getReviews = (reviews) => {
  // the URL for the request
  const url = `${API_HOST}/api/reviews`;

  // Since this is a GET request, simply call fetch on the URL
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        // return a promise that resolves with the JSON body
        return res.json();
      } else {
        alert("Could not get reviews");
      }
    })
    .then((json) => {
      // the resolved promise with the JSON body
      reviews.setState({ reviews: json.reviews });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Retrieve review by id
export const getReviewById = (review, id) => {
  // the URL for the request
  const url = `${API_HOST}/api/reviews/${id}`;
  // Since this is a GET request, simply call fetch on the URL
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        // return a promise that resolves with the JSON body
        return res.json();
      } else {
        alert("Could not get review");
      }
    })
    .then((json) => {
      // the resolved promise with the JSON body
      review.setState({ review: json.review });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Delete review by userid and id
export const deleteReview = (currentUserId, reviewID) => {
  // the URL for the request
  const url = `${API_HOST}/api/reviews/${currentUserId}/${reviewID}`;

  fetch(url, { method: "DELETE" })
    .then((res) => {
      if (res.status === 200) {
        console.log("Successfully deleted review");
      } else {
        alert("Could not delete review");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// A function to send a POST request to add a review to a washroom
export const addReview = (
  washroom_id,
  cleanliness,
  functionality,
  privacy,
  reviewContent,
  uid
) => {
  const currDate = new Date().toString().slice(4, 25);
  const reviewBody = {
    date: currDate,
    cleanliness: parseInt(cleanliness),
    functionality: parseInt(functionality),
    privacy: parseInt(privacy),
    content: reviewContent,
  };

  const request = new Request(`${API_HOST}/api/reviews/${washroom_id}/${uid}`, {
    method: "post",
    body: JSON.stringify(reviewBody),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  // Send the request with fetch()
  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
