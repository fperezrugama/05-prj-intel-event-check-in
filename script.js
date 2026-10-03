
// Find the elements we need from the HTML.
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");
const teamsGrid = document.querySelector(".teams-grid");

// The attendance goal for the event.
const attendanceGoal = 50;

// Store all attendees in one array.
// Each attendee will have a name and a team.
let attendees = [];

// --------------------------------------------------
// CREATE THE ATTENDEE LIST
// --------------------------------------------------

// Create the attendee list below the team counters.
const attendeeListSection = document.createElement("div");
attendeeListSection.style.marginTop = "25px";
attendeeListSection.style.paddingTop = "20px";
attendeeListSection.style.borderTop = "1px solid #e2e8f0";

// Create the "Attendees" heading.
const attendeeListHeading = document.createElement("h3");
attendeeListHeading.textContent = "Attendees";
attendeeListHeading.style.color = "#64748b";
attendeeListHeading.style.fontSize = "16px";
attendeeListHeading.style.marginBottom = "12px";

// Create the unordered list that will contain the attendees.
const attendeeList = document.createElement("ul");
attendeeList.style.listStyle = "none";
attendeeList.style.margin = "0";
attendeeList.style.padding = "0";

// Put the heading and list inside the attendee section.
attendeeListSection.appendChild(attendeeListHeading);
attendeeListSection.appendChild(attendeeList);

// Place the attendee list underneath the team counters.
teamsGrid.parentElement.appendChild(attendeeListSection);

// --------------------------------------------------
// LOAD SAVED DATA
// --------------------------------------------------

// Check if there is an attendee list saved in localStorage.
const savedAttendees = localStorage.getItem("attendees");

// If saved attendees exist, convert them from JSON back into an array.
// Otherwise, start with an empty array.
if (savedAttendees) {
  attendees = JSON.parse(savedAttendees);
}

// --------------------------------------------------
// UPDATE COUNTS
// --------------------------------------------------

// Calculate the total and individual team counts
// using the attendee list.
function updateCountsFromList() {
  let waterAttendance = 0;
  let zeroAttendance = 0;
  let powerAttendance = 0;

  // Look at every attendee in the list.
  attendees.forEach(function (attendee) {
    if (attendee.team === "Team Water Wise") {
      waterAttendance = waterAttendance + 1;
    } else if (attendee.team === "Team Net Zero") {
      zeroAttendance = zeroAttendance + 1;
    } else if (attendee.team === "Team Renewables") {
      powerAttendance = powerAttendance + 1;
    }
  });

  // Return all of the updated counts so other functions can use them.
  return {
    total: attendees.length,
    water: waterAttendance,
    zero: zeroAttendance,
    power: powerAttendance,
  };
}

// --------------------------------------------------
// UPDATE ATTENDEE LIST
// --------------------------------------------------

// Recreate the attendee list on the webpage.
function updateAttendeeList() {
  // Clear the existing list before rebuilding it.
  attendeeList.innerHTML = "";

  // Add each attendee to the list.
  attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");

    listItem.style.display = "flex";
    listItem.style.justifyContent = "space-between";
    listItem.style.gap = "15px";
    listItem.style.padding = "10px 0";
    listItem.style.borderBottom = "1px solid #f1f5f9";

    // Create the attendee's name.
    const nameElement = document.createElement("span");
    nameElement.textContent = attendee.name;
    nameElement.style.fontWeight = "500";
    nameElement.style.color = "#334155";

    // Create the attendee's team.
    const teamElement = document.createElement("span");
    teamElement.textContent = attendee.team;
    teamElement.style.color = "#64748b";
    teamElement.style.textAlign = "right";

    // Add the name and team to the list item.
    listItem.appendChild(nameElement);
    listItem.appendChild(teamElement);

    // Add the list item to the attendee list.
    attendeeList.appendChild(listItem);
  });
}

// --------------------------------------------------
// UPDATE CELEBRATION
// --------------------------------------------------

// Display a celebration when the attendance goal is reached.
function updateCelebration(counts) {
  // Do not show the celebration until the goal is reached.
  if (counts.total < attendanceGoal) {
    return;
  }

  // Find the highest team attendance.
  const highestCount = Math.max(
    counts.water,
    counts.zero,
    counts.power
  );

  // Store the names of all teams that have the highest count.
  const winningTeams = [];

  if (counts.water === highestCount) {
    winningTeams.push("Team Water Wise");
  }

  if (counts.zero === highestCount) {
    winningTeams.push("Team Net Zero");
  }

  if (counts.power === highestCount) {
    winningTeams.push("Team Renewables");
  }

  // Make the greeting visible.
  greeting.style.display = "block";
  greeting.className = "success-message";

  // Handle a tie.
  if (winningTeams.length > 1) {
    greeting.textContent =
      `🎉 Celebration! The attendance goal has been reached! ` +
      `There is a tie between ${winningTeams.join(" and ")}.`;
  } else {
    // Handle a single winning team.
    greeting.textContent =
      `🎉 Celebration! The attendance goal has been reached! ` +
      `${winningTeams[0]} is the winning team!`;
  }
}

// --------------------------------------------------
// UPDATE PAGE DISPLAY
// --------------------------------------------------

function updateDisplay() {
  // Calculate the current attendance counts.
  const counts = updateCountsFromList();

  // Update the total attendance displayed on the page.
  attendeeCount.textContent = counts.total;

  // Update each team's counter.
  waterCount.textContent = counts.water;
  zeroCount.textContent = counts.zero;
  powerCount.textContent = counts.power;

  // Calculate the percentage of the attendance goal completed.
  const progressPercentage =
    (counts.total / attendanceGoal) * 100;

  // Make sure the progress bar does not go beyond 100%.
  const limitedProgress = Math.min(progressPercentage, 100);

  // Update the progress bar width.
  progressBar.style.width = `${limitedProgress}%`;

  // Update the attendee list.
  updateAttendeeList();

  // Show the celebration if the goal has been reached.
  updateCelebration(counts);
}

// --------------------------------------------------
// SAVE DATA
// --------------------------------------------------

// Save the attendee list to localStorage.
function saveAttendees() {
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// --------------------------------------------------
// CHECK-IN FORM
// --------------------------------------------------

// Run this code when the check-in form is submitted.
checkInForm.addEventListener("submit", function (event) {
  // Prevent the browser from refreshing the page.
  event.preventDefault();

  // Get the name entered by the attendee.
  const name = attendeeNameInput.value.trim();

  // Get the full team name from the selected dropdown option.
  const selectedTeam =
    teamSelect.options[teamSelect.selectedIndex].textContent;

  // Add the new attendee to the attendee array.
  attendees.push({
    name: name,
    team: selectedTeam,
  });

  // Save the updated attendee list to localStorage.
  saveAttendees();

  // Update the counters, progress bar, attendee list,
  // and celebration message.
  updateDisplay();

  // If the goal has not been reached yet,
  // show the normal personalized welcome message.
  if (attendees.length < attendanceGoal) {
    greeting.style.display = "block";
    greeting.className = "success-message";
    greeting.textContent =
      `Welcome, ${name}! You have joined ${selectedTeam}.`;
  }

  // Reset the form so it is ready for the next attendee.
  checkInForm.reset();

  // Confirm that the form was submitted.
  console.log("The check-in form was submitted.");
});

// --------------------------------------------------
// INITIAL PAGE LOAD
// --------------------------------------------------

// Display saved data when the page first loads.
updateDisplay();
