/* Washroom mongoose model */
const mongoose = require("mongoose");
const { ReviewSchema } = require("./review");
const { ReportSchema } = require("./report");

const WashroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlegth: 1,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    minlegth: 1,
    trim: true,
  },
  amenities: {
    type: String,
    required: false,
    minlegth: 1,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    minlegth: 1,
    trim: true,
  },
  coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
  },
  reviews: [String],
  reports: [String],
});

// name: floor # - room #
// location: building name
// amenities: special features
// gender: gender
// reviews: list of reviews for this washroom
// reports: list of reports for this washroom
const Washroom = mongoose.model("Washroom", WashroomSchema);

module.exports = { Washroom };
