/* Washroom mongoose model */
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  washroom: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  cleanliness: {
    type: Number,
    required: true,
  },
  functionality: {
    type: Number,
    required: true,
  },
  privacy: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  dislikes: {
    type: Number,
    required: true,
  },
});

// user: user _id of this review
// washroom: washroom _id of this review
// date: datetime that this review was submitted at
// cleanliness: the cleanliness score (out of 5) of this review
// functionality: the functionality score (out of 5) of this review
// privacy: the privacy score (out of 5) of this review
// content: the content of this review
// likes: # of likes
// dislikes: # of dislikes
const Review = mongoose.model("Review", ReviewSchema);

module.exports = { Review, ReviewSchema };
