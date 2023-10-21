// Dependencies
const express = require("express");
const fs = require("fs");

// Create an instance of the express app
const app = express();

// Define the port for the server
const PORT = process.env.PORT || 8080;

// Middleware to parse request data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (e.g., CSS, JavaScript, images)
app.use("/public/assets", express.static(__dirname + "/public/assets"));

// Define and use routes
const htmlRoutes = require("./routes/html-routes");
const apiRoutes = require("./routes/api-routes");
htmlRoutes(app);
apiRoutes(app);

// Start the server
app.listen(PORT, () => {
  console.log(`App is listening on PORT ${PORT}`);
});
