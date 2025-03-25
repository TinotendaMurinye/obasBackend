const express = require("express");
const attendanceCrud = require("../Cruds/attendance"); // Adjust path as necessary
const usersCrud = require("../Cruds/users"); // For user validation
const attendanceRouter = express.Router();

// Log entry
attendanceRouter.post("/entry", async (req, res) => {
  const { username, passcode } = req.body;

  try {
    const users = await usersCrud.getUsers(); // Await the result
    const user = users.find(u => u.username === username && u.passcode === passcode); // Now find the user
    if (!user) return res.status(404).json({ status: "404", message: "User not found" });

    const response = await attendanceCrud.logEntry(user.user_id);
    res.status(200).json(response);
  } catch (err) {
    console.error(err); // Log the error for better debugging
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Log exit
attendanceRouter.post("/exit", async (req, res) => {
  const { username, passcode } = req.body;

  try {
    const users = await usersCrud.getUsers();
    const user = users.find(u => u.username === username && u.passcode === passcode);
    if (!user) return res.status(404).json({ status: "404", message: "User not found" });

    const response = await attendanceCrud.logExit(user.user_id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get attendance logs for a specific user
attendanceRouter.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const results = await attendanceCrud.getAttendanceByUserId(id);
    if (results.length === 0) return res.status(404).json({ status: "404", message: "No attendance logs found for this user" });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all attendance logs
attendanceRouter.get("/", async (req, res) => {
  try {
    const results = await attendanceCrud.getAllAttendance();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});
// Verify user by barcode and log entry or exit
attendanceRouter.post("/verify", async (req, res) => {
  const { barcode, action } = req.body; // Expecting action to be either 'entry' or 'exit'

  try {
    const user = await usersCrud.getUserByBarcode(barcode);
    if (!user) return res.status(404).json({ status: "404", message: "User not found" });

    let response;
    if (action === 'entry') {
      response = await attendanceCrud.logEntry(user.user_id); // Log entry
    } else if (action === 'exit') {
      response = await attendanceCrud.logExit(user.user_id); // Log exit
    } else {
      return res.status(400).json({ status: "400", message: "Invalid action. Use 'entry' or 'exit'." });
    }

    res.status(200).json({ status: "200", message: response.message, userId: user.user_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = attendanceRouter;