// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

// Your code here!
// 1. DOM Elements
const stateInput = document.getElementById("state-input");
const fetchBtn = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

// Create and append the loading spinner dynamically since it's in the CSS but not the HTML
const loadingSpinner = document.createElement("div");
loadingSpinner.id = "loading-spinner";
loadingSpinner.innerHTML = `<p>Loading alerts...</p>`; // You can replace this text with an <img> tag if you have a spinner gif
document.body.insertBefore(loadingSpinner, alertsDisplay);

// 2. Event Listener
fetchBtn.addEventListener("click", () => {
  const stateValue = stateInput.value.trim().toUpperCase();

  // Step 5: Input Validation (Ensure it's exactly 2 letters)
  const stateRegex = /^[A-Z]{2}$/;
  if (!stateRegex.test(stateValue)) {
    showError(
      "Please enter a valid 2-letter state abbreviation (e.g., MN, TX).",
    );
    return;
  }

  // Step 3: Clear UI and reset errors before fetching
  clearUI();

  // Trigger the fetch sequence
  fetchWeatherAlerts(stateValue);
});

// 3. Step 1: Fetch Alerts for a State from the API
function fetchWeatherAlerts(state) {
  // Show loading indicator
  loadingSpinner.style.display = "block";

  fetch(`${weatherApi}${state}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("API Data received:", data); // Logging for testing

      // Hide loading indicator
      loadingSpinner.style.display = "none";

      // Step 2: Display the Alerts on the Page
      displayAlerts(data, state);
    })
    .catch((errorObject) => {
      // Hide loading indicator
      loadingSpinner.style.display = "none";

      // Step 4: Implement Error Handling
      console.log(errorObject.message);
      showError(`Failed to fetch alerts: ${errorObject.message}`);
    });
}

// 4. Step 2: Display the Alerts on the Page
function displayAlerts(data, state) {
  const alerts = data.features || [];
  const alertCount = alerts.length;

  // Create Summary Message
  const summaryHeader = document.createElement("h2");
  summaryHeader.textContent = `${data.title}: ${alertCount}`;
  alertsDisplay.appendChild(summaryHeader);

  // If there are no alerts, let the user know cleanly
  if (alertCount === 0) {
    const noAlertsMsg = document.createElement("p");
    noAlertsMsg.textContent = "No active weather alerts for this area.";
    alertsDisplay.appendChild(noAlertsMsg);
    return;
  }

  // Create List of Alert Headlines
  const alertList = document.createElement("ul");

  alerts.forEach((alert) => {
    const listItem = document.createElement("li");
    // Accessing properties.headline as instructed
    const headline =
      alert.properties.headline || "No headline provided for this alert.";
    listItem.textContent = headline;
    alertList.appendChild(listItem);
  });

  alertsDisplay.appendChild(alertList);
}

// 5. Step 3 & 4: Helper Functions for UI State Management
function clearUI() {
  // Clear the inputs and previous displays
  stateInput.value = "";
  alertsDisplay.innerHTML = "";

  // Hide and clear error messages safely
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

function showError(message) {
  // Clear any leftover data displays
  alertsDisplay.innerHTML = "";

  // Unhide and show error styling
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}
