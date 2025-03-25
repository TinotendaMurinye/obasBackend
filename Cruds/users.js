const pool = require("../poolfile"); // Adjust path as necessary

let usersCrud = {};

// Create a new user
usersCrud.postUser = async (username, name, surname, passcode, bar_code, status) => {
  const query = `
    INSERT INTO users (username, name, surname, passcode, bar_code, status) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [username, name, surname, passcode, bar_code, status];

  try {
    await pool.execute(query, values);
    return { status: "200", message: "User created successfully" };
  } catch (error) {
    console.error("Error inserting user:", JSON.stringify(error, null, 2));
    throw new Error("Failed to save user");
  }
};
usersCrud.getUserByBarcode = async (barcode) => {
  const [results] = await pool.execute("SELECT * FROM users WHERE bar_code = ?", [barcode]);
  return results[0]; // Return the first matching user
};

// Get all users
usersCrud.getUsers = async () => {
  const [results] = await pool.execute("SELECT * FROM users");
  return results; // Ensure this returns an array
};
// Get user by ID
usersCrud.getUserById = async (id) => {
  const [results] = await pool.execute("SELECT * FROM users WHERE user_id = ?", [id]);
  return results[0];
};

// Update user
usersCrud.updateUser = async (id, updatedValues) => {
  const setExpressions = Object.keys(updatedValues)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(updatedValues), id];
  const query = `UPDATE users SET ${setExpressions} WHERE user_id = ?`;
  await pool.execute(query, values);
  return { status: "200", message: "User updated successfully" };
};

// Delete user
usersCrud.deleteUser = async (id) => {
  await pool.execute("DELETE FROM users WHERE user_id = ?", [id]);
  return { status: "200", message: "User deleted successfully" };
};

module.exports = usersCrud;