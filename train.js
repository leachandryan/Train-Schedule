// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// Firebase Config
var config = {
    apiKey: "AIzaSyAm-6pQlqs6_EIa8hjpyQdzcw1Wze97yyw",
    authDomain: "train-schedule-4d3e2.firebaseapp.com",
    databaseURL: "https://train-schedule-4d3e2.firebaseio.com",
    projectId: "train-schedule-4d3e2",
    storageBucket: "train-schedule-4d3e2.appspot.com",
    messagingSenderId: "216833892028"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#addButton").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var frequency = $("#frequency").val().trim();
  var departure = $("#departureTime").val().trim();

  // Creates local "temporary" object for holding employee data
  var newEmp = {
    name: trainName,
    destination: destination,
    frequency: frequency,
    rate: departure
  };

  // Uploads employee data to the database
  database.ref().push(newEmp);

  // Logs everything to console
  console.log(newEmp.name);
  console.log(newEmp.destination);
  console.log(newEmp.frequency);
  console.log(newEmp.rate);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#trainName").val("");
  $("#destination").val("");
  $("#frequency").val("");
  $("#departureTime").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var frequency = childSnapshot.val().frequency;
  var departure = childSnapshot.val().rate;

  // Employee Info
  console.log(trainName);
  console.log(destination);
  console.log(frequency);
  console.log(departure);

  var tFrequency = frequency;
  // Time is 3:30 AM
  var firstTime = departure;
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);
  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);
  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);
  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(departure),
    $("<td>").text(nextTrain),
    $("<td>").text(tMinutesTillTrain)
  );

  // Append the new row to the table
  $("#employee-table > tbody").append(newRow);
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case