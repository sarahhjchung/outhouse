/* Washroom mongoose model */
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true,
  },
  washroom: {
    type: String,
    required: true,
    trim: true,
  },
  updateTime: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  content: {
    type: String,
    trim: true,
    required: true,
  },
});

// user: user _id of this report
// washroom: washroom _id of this report
// updateTime: time that this report was submitted at
// title: the title of this report
// content: the content of this report
const Report = mongoose.model("Report", ReportSchema);

module.exports = { Report, ReportSchema };
