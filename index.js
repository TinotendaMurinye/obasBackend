const express = require("express");
const bodyParser = require("body-parser");
const attendanceRouter = require("./routes/attendance"); // Adjust the path as necessary
const usersRouter = require("./routes/users");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // For parsing URL-encoded data

// API Routes
app.use("/attendance", attendanceRouter);
app.use("/users", usersRouter);

// Health Check Endpoint
app.get("/", (req, res) => {
  res.send("Wrong Location Move Along---This is My Space%");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
