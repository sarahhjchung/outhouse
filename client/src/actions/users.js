// environment configutations
import ENV from "./../config.js";
const API_HOST = ENV.api_host;
// console.log('Current environment:', ENV.env)

// Send a request to check if a user is logged in through the session cookie
export const checkSession = (app) => {
  const url = `${API_HOST}/users/check-session`;

  if (!ENV.use_frontend_test_user) {
    fetch(url)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((json) => {
        if (json && json.currentUser) {
          app.setState({ currentUser: json.currentUser });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    app.setState({ currentUser: ENV.user });
  }
};

// A functon to update the login form state
export const updateLoginForm = (loginComp, field) => {
  const value = field.value;
  const name = field.name;

  loginComp.setState({
    [name]: value,
  });
};

// A function to send a POST request with the user to be logged in
export const login = (loginComp, app) => {
  // Create our request constructor with all the parameters we need
  const request = new Request(`${API_HOST}/users/login`, {
    method: "post",
    body: JSON.stringify(loginComp.state),
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
    .then((json) => {
      if (json.currentUser !== undefined) {
        app.setState({ currentUser: json.currentUser });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// A function to send a GET request to logout the current user
export const logout = (app) => {
  const url = `${API_HOST}/users/logout`;

  fetch(url)
    .then((res) => {
      app.setState({
        currentUser: null,
        message: { type: "", body: "" },
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Get all users from db
export const getUsers = (users) => {
  // the URL for the request
  const url = `${API_HOST}/api/users`;

  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get users");
      }
    })
    .then((json) => {
      users.setState({ users: json.users });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Add new user (signup)
export const signupUser = (username, password, gender, app, isSignup) => {
  const userBody = {
    username: username,
    password: password,
    gender: gender,
    type: "user",
    isSignup: isSignup,
  };

  // Create our request constructor with all the parameters we need
  const request = new Request(`${API_HOST}/api/users`, {
    method: "post",
    body: JSON.stringify(userBody),
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
    .then((json) => {
      if (json.user !== undefined) {
        app.setState({ currentUser: json.user });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// Add new user (signup)
export const addUser = (username, password, type) => {
  const userBody = {
    username: username,
    password: password,
    gender: "",
    type: type,
    isSignup: false,
  };

  // Create our request constructor with all the parameters we need
  const request = new Request(`${API_HOST}/api/users`, {
    method: "post",
    body: JSON.stringify(userBody),
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
    .then((json) => {
      if (json.user !== undefined) {
        console.log("user added!");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// Update user information
export const updateUser = (username, gender, uid) => {
  const userBody = {
    username: username,
    gender: gender,
  };

  // Create our request constructor with all the parameters we need
  const request = new Request(`${API_HOST}/api/user/${uid}`, {
    method: "PATCH",
    body: JSON.stringify(userBody),
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

// Delete user by id
export const deleteUser = (userID) => {
  // the URL for the request
  const url = `${API_HOST}/api/users/${userID}`;

  fetch(url, { method: "DELETE" })
    .then((res) => {
      if (res.status === 200) {
        console.log("Successfully deleted user");
      } else {
        alert("Could not delete user");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
