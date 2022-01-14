"use strict";

/* Server environment setup */
// To run in development mode, run normally: node server.js
// To run in development with the test user logged in the backend, run: TEST_USER_ON=true node server.js
// To run in production mode, run in terminal: NODE_ENV=production node server.js
const env = process.env.NODE_ENV; // read the environment variable (will be 'production' in production mode)

const USE_TEST_USER = env !== "production" && process.env.TEST_USER_ON; // option to turn on the test user.
const TEST_USER_ID = "61aedcad53217913f9252f50"; // the id of our test user (you will have to replace it with a test user that you made). can also put this into a separate configutation file
const TEST_USER_USERNAME = "test2";
const TEST_USER_PASSWORD = "test2";
// const TEST_USER_ID = "61ad9b27b5faa60f2688c247"; // the id of our test user (you will have to replace it with a test user that you made). can also put this into a separate configutation file
// const TEST_USER_USERNAME = "test2";
// const TEST_USER_PASSWORD = "test2";
//////

const log = console.log;
const path = require("path");

const express = require("express");
// starting the express server
const app = express();

// enable CORS if in development, for React local development server to connect to the web server.
const cors = require("cors");
if (env !== "production") {
  app.use(cors());
}

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("useFindAndModify", false); // for some deprecation issues

// import the mongoose models
const { User } = require("./models/user");
const { Washroom } = require("./models/washroom");
const { Report } = require("./models/report");
const { Review } = require("./models/review");

// to validate object IDs
const { ObjectID } = require("mongodb");

// body-parser: middleware for parsing parts of the request into a usable object (onto req.body)
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // parsing JSON body
app.use(bodyParser.urlencoded({ extended: true })); // parsing URL-encoded form data (from form POST requests)

// express-session for managing user sessions
const session = require("express-session");
const MongoStore = require("connect-mongo"); // to store session information on the database in production

function isMongoError(error) {
  // checks for first error returned by promise rejection if Mongo database suddently disconnects
  return (
    typeof error === "object" &&
    error !== null &&
    error.name === "MongoNetworkError"
  );
}

/*** Middlewares below ***********************************/

// middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
  // check mongoose connection established.
  if (mongoose.connection.readyState != 1) {
    log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return;
  } else {
    next();
  }
};

/*** Session handling ************************************/
// create a session and session cookie
app.use(
  session({
    secret: process.env.SESSION_SECRET || "our hardcoded secret", // make a SESSION_SECRET environment variable when deploying (for example, on heroku)
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 1200000, // 20 minutes until user is logged out
      httpOnly: true,
    },
    // store the sessions on the database in production
    store:
      env === "production"
        ? MongoStore.create({
            mongoUrl:
              process.env.MONGODB_URI ||
              "mongodb://localhost:27017/OuthouseAPI",
          })
        : null,
  })
);

// A route to login and create a session
app.post("/users/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // log(username, password);
  // Use the static method on the User model to find a user
  // by their username and password
  try {
    const user = await User.findByUsernamePassword(username, password);
    // Add the user's id to the session.
    // We can check later if this exists to ensure we are logged in.
    req.session.user = user._id;
    req.session.username = user.username; // we will later send the username to the browser when checking if someone is logged in through GET /check-session (we will display it on the frontend dashboard. You could however also just send a boolean flag).
    res.send({ currentUser: user });
  } catch (error) {
    res.status(400).send();
  }
});

// A route to logout a user
app.get("/users/logout", (req, res) => {
  // Remove the session
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send();
    }
  });
});

// A route to check if a user is logged in on the session
app.get("/users/check-session", async (req, res) => {
  if (env !== "production" && USE_TEST_USER) {
    // test user on development environment.
    try {
      const user = await User.findByUsernamePassword(
        TEST_USER_USERNAME,
        TEST_USER_PASSWORD
      );
      // Add the user's id to the session.
      // We can check later if this exists to ensure we are logged in.
      req.session.user = TEST_USER_ID;
      req.session.username = TEST_USER_PASSWORD; // we will later send the username to the browser when checking if someone is logged in through GET /check-session (we will display it on the frontend dashboard. You could however also just send a boolean flag).
      res.send({ currentUser: user });
      return;
    } catch (error) {
      res.status(400).send();
    }
  }

  if (req.session.user) {
    try {
      const user = await User.findById(req.session.user);
      res.send({ currentUser: user });
      if (!user) {
        res.status(404).send("User not found");
      }
      // else {
      //   req.user = user;
      // }
    } catch (error) {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(401).send();
  }
});

/*** API Routes below ************************************/

// GET ROUTES --------------------------------------------/

// retrieve all washrooms
app.get("/api/washrooms", mongoChecker, async (req, res) => {
  try {
    const washrooms = await Washroom.find();
    res.send({ washrooms });
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// retrieve all reviews for specific washroom
app.get(
  "/api/reviews/washroom/:washroom_id",
  mongoChecker,
  async (req, res) => {
    const wid = req.params.washroom_id;

    // if (!ObjectID.isValid(wid)) {
    //   res.status(404).send("Invalid ID");
    //   return;
    // }

    try {
      const washroom = await Washroom.findById(wid);
      if (!washroom) {
        log("Washroom doesn't exist");
        res.status(404).send("Resource not found");
        return;
      }
      res.send(washroom.reviews);
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// retrieve all reports sorted by most recent
app.get("/api/reports", mongoChecker, async (req, res) => {
  try {
    const reports = await Report.find();
    res.send({ reports });
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// retrieve the review by id
app.get("/api/reviews/:review_id", mongoChecker, async (req, res) => {
  const id = req.params.review_id;

  // if (!ObjectID.isValid(wid)) {
  //   res.status(404).send("Invalid ID");
  //   return;
  // }

  try {
    const review = await Review.findById(id);
    if (!review) {
      log("Washroom doesn't exist");
      res.status(404).send("Resource not found");
      return;
    }
    res.send({ review });
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// retrieve the washroom by id
app.get("/api/washrooms/:washroom_id", mongoChecker, async (req, res) => {
  const id = req.params.washroom_id;

  // if (!ObjectID.isValid(wid)) {
  //   res.status(404).send("Invalid ID");
  //   return;
  // }

  try {
    const washroom = await Washroom.findById(id);
    if (!washroom) {
      log("Washroom doesn't exist");
      res.status(404).send("Resource not found");
      return;
    }
    res.send({ washroom });
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// retrieve all reviews written by specific user
app.get("/api/reviews/user/:user_id", mongoChecker, async (req, res) => {
  const uid = req.params.user_id; // TODO: Should this be a uid?

  // if (!ObjectID.isValid(username)) {
  //   res.status(404).send("Invalid ID");
  //   return;
  // }

  try {
    const user = await User.findById(uid);
    if (!user) {
      log("User doesn't exist");
      res.status(404).send("Resource not found");
      return;
    }
    const reviews = user.reviews;
    res.send({ reviews });
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// retrieve all users
app.get("/api/users", mongoChecker, async (req, res) => {
  try {
    const users = await User.find();
    res.send({ users });
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// retrieve all reviews
app.get("/api/reviews", mongoChecker, async (req, res) => {
  try {
    const reviews = await Review.find();
    res.send({ reviews });
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// POST ROUTES -------------------------------------------/

// add a new user
app.post("/api/users", mongoChecker, async (req, res) => {
  // Check for invalid request body
  if (
    req.body.username === undefined ||
    req.body.password === undefined ||
    req.body.type === undefined
  ) {
    res.status(400).send("Bad Request");
    return;
  }

  // Create a new user
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    gender: req.body.gender || "",
    type: req.body.type,
    reviews: [],
    reports: [],
  });

  // Save student to the database
  try {
    const result = await user.save();
    if (req.body.isSignup) {
      req.session.user = result._id;
      req.session.username = result.username;
    }
    res.send({ user });
  } catch (error) {
    log(error); // log server error to the console, not to the client.
    res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
  }
});

// add a new washroom
app.post("/api/washrooms", mongoChecker, async (req, res) => {
  // Check for invalid request body
  if (
    req.body.name === undefined ||
    req.body.location === undefined ||
    req.body.gender === undefined ||
    req.body.coordinates.lat === undefined ||
    req.body.coordinates.lng === undefined
  ) {
    res.status(400).send("Bad Request");
    return;
  }

  const washroom = new Washroom({
    name: req.body.name,
    location: req.body.location,
    amenities: req.body.amenities || "",
    gender: req.body.gender,
    coordinates: {
      lat: req.body.coordinates.lat,
      lng: req.body.coordinates.lng,
    },
    reviews: [],
    reports: [],
  });

  try {
    const result = await washroom.save();
    res.send(washroom);
  } catch (error) {
    log(error);
    res.status(400).send("Bad Request");
  }
});

// add a new review by current user on specific washroom
app.post(
  "/api/reviews/:washroom_id/:user_id",
  mongoChecker,
  async (req, res) => {
    const wid = req.params.washroom_id;
    const uid = req.params.user_id;

    if (
      req.body.date === undefined ||
      req.body.cleanliness === undefined ||
      req.body.functionality === undefined ||
      req.body.privacy === undefined ||
      req.body.content === undefined
    ) {
      res.status(400).send("Bad Request");
      return;
    }

    const review = {
      user: uid,
      washroom: wid,
      date: req.body.date,
      cleanliness: req.body.cleanliness,
      functionality: req.body.functionality,
      privacy: req.body.privacy,
      content: req.body.content,
      likes: 0,
      dislikes: 0,
    };

    const newReview = new Review(review);

    try {
      const washroom = await Washroom.findById(wid);
      if (!washroom) {
        log("Washroom doesn't exist");
        res.status(404).send("Resource not found");
        return;
      }
      const user = await User.findById(uid);
      if (!user) {
        log("User doesn't exist");
        res.status(404).send("Resource not found");
        return;
      }
      washroom.reviews.push(newReview._id);
      user.reviews.push(newReview._id);
      const w_result = await washroom.save();
      const u_result = await user.save();
      const reviewResult = await newReview.save();
      res.send(review);
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// add a new report by current user on specific washroom
app.post(
  "/api/reports/:washroom_id/:user_id",
  mongoChecker,
  async (req, res) => {
    const wid = req.params.washroom_id;
    const uid = req.params.user_id;

    if (
      req.body.updateTime === undefined ||
      req.body.title === undefined ||
      req.body.content === undefined
    ) {
      res.status(400).send("Bad Request");
      return;
    }

    const report = {
      user: uid,
      washroom: wid,
      updateTime: req.body.updateTime,
      title: req.body.title,
      content: req.body.content,
    };

    const newReport = new Report(report);

    try {
      const washroom = await Washroom.findById(wid);
      if (!washroom) {
        log("Washroom doesn't exist");
        res.status(404).send("Resource not found");
        return;
      }
      const user = await User.findById(uid);
      if (!user) {
        log("User doesn't exist");
        res.status(404).send("Resource not found");
        return;
      }
      washroom.reports.push(newReport._id);
      user.reports.push(newReport._id);
      const w_result = await washroom.save();
      const u_result = await user.save();
      const reportResult = await newReport.save();
      res.send(report);
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// DELETE ROUTES -----------------------------------------/

// delete specific review written by current user
app.delete(
  "/api/reviews/:user_id/:review_id",
  mongoChecker,
  async (req, res) => {
    const user_id = req.params.user_id;
    const review_id = req.params.review_id;

    // // Validate id
    // if (!ObjectID.isValid(user_id) || !ObjectID.isValid(review_id)) {
    //   res.status(404).send("Resource not found");
    //   return;
    // }

    // Delete the review
    try {
      const user = await User.findById(user_id);
      if (!user) {
        res.status(404).send();
        return;
      }

      const review = await Review.findById(review_id);
      if (!review) {
        res.status(404).send("Review not found");
        return;
      }

      const washroom = await Washroom.findById(review.washroom);
      if (!washroom) {
        res.status(404).send("Washroom not found");
        return;
      }

      for (let i = 0; i < user.reviews.length; i++) {
        if (user.reviews[i] === review_id) {
          user.reviews.splice(i, 1);
          const result1 = await user.save();
          break;
        }
      }

      for (let i = 0; i < washroom.reviews.length; i++) {
        if (washroom.reviews[i] === review_id) {
          washroom.reviews.splice(i, 1);
          const result2 = await washroom.save();
          break;
        }
      }

      const result = await Review.findByIdAndRemove(review_id);
      res.send({ user, washroom });
    } catch (error) {
      log(error);
      res.status(500).send(); // server error, could not delete.
    }
  }
);

// delete specific user by id
app.delete("/api/users/:user_id", mongoChecker, async (req, res) => {
  const user_id = req.params.user_id;
  // Validate id
  // if (!ObjectID.isValid(user_id)) {
  //   res.status(404).send("Resource not found");
  //   return;
  // }

  // Delete the user
  try {
    const user = await User.findByIdAndRemove(user_id);
    if (!user) {
      res.status(404).send();
    } else {
      let review;
      // delete each review from db and the washroom
      for (let i = 0; i < user.reviews.length; i++) {
        const review_id = user.reviews[i];
        review = await Review.findByIdAndRemove(review_id);
        let washroom = await Washroom.findById(review.washroom);
        for (let j = 0; j < washroom.reviews.length; j++) {
          if (washroom.reviews[j] === review_id) {
            washroom.reviews.splice(j, 1);
            const result1 = await washroom.save();
            // res.send({ review});
            break;
          }
        }
      }

      let report;
      // delete each report from db and the washroom
      for (let i = 0; i < user.reports.length; i++) {
        const report_id = user.reports[i];
        report = await Report.findByIdAndRemove(report_id);
        let washroom = await Washroom.findById(report.washroom);
        for (let j = 0; j < washroom.reports.length; j++) {
          if (washroom.reports[j] === report_id) {
            washroom.reports.splice(j, 1);
            const result2 = await washroom.save();
            // res.send({ report, washroom });
            break;
          }
        }
      }
      //user.reviews = [];
      //user.reports = [];
      res.send(user);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// delete specific washroom by id
app.delete("/api/washrooms/:washroom_id", mongoChecker, async (req, res) => {
  const washroom_id = req.params.washroom_id;

  try {
    const washroom = await Washroom.findById(washroom_id);
    if (!washroom) {
      res.status(404).send("Washroom not found");
      return;
    }

    // Delete all the washroom's reviews from their user
    for (let i = 0; i < washroom.reviews.length; i++) {
      const review_id = washroom.reviews[i];
      const review = await Review.findById(review_id);
      const user = await User.findById(review.user);

      for (let i = 0; i < user.reviews.length; i++) {
        if (user.reviews[i] === review_id) {
          user.reviews.splice(i, 1);
          const result1 = await user.save();
          break;
        }
      }

      const result2 = await Review.findByIdAndRemove(review_id);
    }

    // Delete all the washroom's reports from their user
    for (let i = 0; i < washroom.reports.length; i++) {
      const report_id = washroom.reports[i];
      const report = await Report.findById(report_id);
      const user = await User.findById(report.user);

      for (let i = 0; i < user.reports.length; i++) {
        if (user.reports[i] === report_id) {
          user.reports.splice(i, 1);
          const result3 = await user.save();
          break;
        }
      }

      const result4 = await Report.findByIdAndRemove(report_id);
    }

    const result5 = await Washroom.findByIdAndRemove(washroom_id);
    res.send(washroom);
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// delete specific report by id
app.delete("/api/reports/:report_id", mongoChecker, async (req, res) => {
  // Delete the report
  const report_id = req.params.report_id;
  try {
    const report = await Report.findById(report_id);
    if (!report) {
      res.status(404).send("Report not found");
      return;
    }

    const user = await User.findById(report.user);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    const washroom = await Washroom.findById(report.washroom);
    if (!washroom) {
      res.status(404).send("Washroom not found");
      return;
    }

    for (let i = 0; i < user.reports.length; i++) {
      if (user.reports[i] === report_id) {
        user.reports.splice(i, 1);
        const result1 = await user.save();
        break;
      }
    }

    for (let i = 0; i < washroom.reports.length; i++) {
      if (washroom.reports[i] === report_id) {
        washroom.reports.splice(i, 1);
        const result2 = await washroom.save();
        break;
      }
    }

    const result = await Report.findByIdAndRemove(report_id);
    res.send({ user, washroom });
  } catch (error) {
    log(error);
    res.status(500).send(); // server error, could not delete.
  }
});

// PATCH ROUTES ------------------------------------------/

// update user information
app.patch("/api/user/:user_id", mongoChecker, async (req, res) => {
  const uid = req.params.user_id;

  const fieldsToUpdate = {};
  Object.keys(req.body).map((change) => {
    fieldsToUpdate[change] = req.body[change];
  });

  try {
    const user = await User.findOneAndUpdate(
      { _id: uid },
      { $set: fieldsToUpdate },
      { new: true, useFindAndModify: false }
    );
    if (!user) {
      res.status(404).send("Resource not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// update specific washroom
app.patch("/api/washrooms/:washroom_id", mongoChecker, async (req, res) => {
  const wid = req.params.washroom_id;

  const fieldsToUpdate = {};
  Object.keys(req.body).map((change) => {
    fieldsToUpdate[change] = req.body[change];
  });

  try {
    const washroom = await Washroom.findOneAndUpdate(
      { _id: wid },
      { $set: fieldsToUpdate },
      { new: true, useFindAndModify: false }
    );
    if (!washroom) {
      res.status(404).send("Resource not found");
    } else {
      res.send(washroom);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

/*************************************************/
// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
  // check for page routes that we expect in the frontend to provide correct status code.
  const goodPageRoutes = [
    "/",
    "/login",
    "/map",
    "/admin",
    "/reports",
    "/profile",
    // "/reportform",
    // "/reviewform",
    "/reportform/:washroom_id",
    "/reviewform/:washroom_id",
    "/reviews/:washroom_id",
  ];

  //   if (!goodPageRoutes.includes(req.url)) {
  //     // if url not in expected page routes, set status to 404.
  //     res.status(404);
  //   }

  // send index.html
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

// Express server listening...
const port = process.env.PORT || 5000;
app.listen(port, () => {
  log(`Listening on port ${port}...`);
});
