var express = require("express");
var app = express();
const port = 4001;

//Starts the server
var server = app.listen(port, function (error) {
  if (error) throw error;
  console.log("Express server listening on port, ", port);
});

//Retrieves the functions used to fetch and push both weather and news data
const { newsFile } = require("./news.js");
const { weatherFile } = require("./weather.js");
//Retrieves a scheduling library
const schedule = require("node-schedule");

//Schedules the job to run every hour
const job = schedule.scheduleJob("0 * * * *", async function () {
  console.log("Running the job");
  await newsFile();
  await weatherFile();
});
