const express = require("express");
const usersCrud = require("../Cruds/users"); // Adjust path as necessary
const usersRouter = express.Router();

// Create a new user
usersRouter.post("/", async (req, res) => {
  const { username, name, surname, passcode, bar_code, status } = req.body;

  if (!username || !name || !surname || !passcode || !status) {
    return res.status(400).json({ status: "400", message: "Missing required fields" });
  }

  try {
    const response = await usersCrud.postUser(username, name, surname, passcode, bar_code, status);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all users
usersRouter.get("/", async (req, res) => {
  try {
    const results = await usersCrud.getUsers();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get user by ID
usersRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await usersCrud.getUserById(id);
    if (!result) return res.status(404).json({ status: "404", message: "User not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update user by ID
usersRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedValues = req.body;
  try {
    const response = await usersCrud.updateUser(id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete user by ID
usersRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await usersCrud.deleteUser(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = usersRouter;