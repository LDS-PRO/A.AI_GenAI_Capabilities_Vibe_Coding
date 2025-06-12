const express = require("express");
const app = express();
const database = require("./database");

// Serve static files from the "public" directory (CSS, JS, images)
app.use(express.static("public"));

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine for rendering HTML templates
app.set("view engine", "ejs");

// Handle GET requests to the root path "/"
app.get("/", function (request, response) {
  // Initialize default values for the template
  const cluster = 2;  // Default cluster value
  const PC = [];      // Empty array for postcodes
  
  // Render the index.ejs template with these values
  response.render("index", { cluster, PC });
});

// Handle POST requests to "/update/"
app.post("/update/", async function (request, response) {
  try {
    // Extract the request body containing cluster and PC values
    const requestData = request.body;
    
    // Call the database function to update Google Spreadsheet
    // Pass the entire request body and the PC (postcodes) separately
    const updateResult = await database.accessSpreadsheet2(requestData, requestData.PC);
    
    // Send success response back to client
    response.status(200).send("Update successful");
  } catch (error) {
    // Log error and send error response
    console.error("Update error:", error);
    response.status(500).send("Update failed");
  }
});

// Start the server and listen on the specified port
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

