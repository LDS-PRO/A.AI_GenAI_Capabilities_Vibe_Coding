// Import required modules
const express = require("express");
const path = require("path");
const database = require("./database");

// Initialize Express application
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV !== 'production';

// Middleware setup
// Serve static files from the "public" directory with caching
app.use(express.static("public", {
  maxAge: isDevelopment ? 0 : '1d', // Cache for 1 day in production
  etag: true
}));

// Parse JSON bodies (for modern API calls)
app.use(express.json());

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine for rendering HTML templates
app.set("view engine", "ejs");

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Request logging in development
if (isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
// Handle GET requests to the root path "/"
app.get("/", (req, res) => {
  try {
    // Initialize default values for the template
    const cluster = 2;  // Default cluster value
    const PC = [];      // Empty array for postcodes
    
    // Render the index.ejs template with these values
    res.render("index", { cluster, PC });
  } catch (error) {
    console.error("Error rendering index:", error);
    res.status(500).send("Error loading page");
  }
});

// Handle POST requests to "/update/" - Update cluster values
app.post("/update/", async (req, res) => {
  try {
    // Extract and validate request data
    const { cluster, PC } = req.body;
    
    // Validate required fields
    if (!cluster || cluster.toString().trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: "Cluster value is required" 
      });
    }
    
    if (!PC || PC.toString().trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: "Postcodes are required" 
      });
    }
    
    // Log the update request
    console.log(`Update request - Cluster: ${cluster}, Postcodes: ${PC}`);
    
    // Call the database function to update Google Spreadsheet
    const updateResult = await database.accessSpreadsheet2(
      { cluster }, // Pass cluster as object as expected by database.js
      PC           // Pass postcodes as string
    );
    
    // Check if update was successful
    if (updateResult.success) {
      // Send detailed success response
      res.status(200).json({
        success: true,
        message: updateResult.message,
        updatedCount: updateResult.updatedCount
      });
    } else {
      // Send error response with details
      res.status(400).json({
        success: false,
        message: updateResult.message || "Update failed"
      });
    }
    
  } catch (error) {
    // Log detailed error for debugging
    console.error("Update error:", error);
    
    // Send generic error response to client
    res.status(500).json({
      success: false,
      message: "Internal server error during update"
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString() 
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Something went wrong!");
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`
    🚀 Server is running!
    🌍 Environment: ${isDevelopment ? 'development' : 'production'}
    📡 Port: ${PORT}
    🔗 Local: http://localhost:${PORT}
  `);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Export app for testing purposes
module.exports = app;

