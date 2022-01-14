// environment configutations
import ENV from "./../config.js";
const API_HOST = ENV.api_host;
// console.log('Current environment:', ENV.env)

// Retrieves all reports from db
export const getReports = (reports) => {
  // the URL for the request
  const url = `${API_HOST}/api/reports`;

  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get reports");
      }
    })
    .then((json) => {
      reports.setState({ reports: json.reports });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Send post request to make a report for a washroom
export const addReport = (washroom_id, reportTitle, reportContent, uid) => {
  const currDate = new Date().toString().slice(4, 25);
  const reportBody = {
    title: reportTitle,
    content: reportContent,
    updateTime: currDate,
  };

  // Create our request constructor with all the parameters we need
  const request = new Request(`${API_HOST}/api/reports/${washroom_id}/${uid}`, {
    method: "post",
    body: JSON.stringify(reportBody),
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

// Delete report by id
export const deleteReport = (reviewID) => {
  // the URL for the request
  const url = `${API_HOST}/api/reports/${reviewID}`;

  fetch(url, { method: "DELETE" })
    .then((res) => {
      if (res.status === 200) {
        console.log("Successfully deleted report");
      } else {
        alert("Could not delete report");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
