const pool = require("../poolfile"); // Adjust path as necessary

let attendanceCrud = {};

// Log attendance entry
attendanceCrud.logEntry = async (userId) => {
  const query = `
    INSERT INTO Attendance_Log (Emp_id, date, In_time, status) 
    VALUES (?, CURDATE(), CURTIME(), 'Present')`;

  const values = [userId];

  try {
    await pool.execute(query, values);
    return { status: "200", message: "Entry logged successfully" };
  } catch (error) {
    console.error("Error logging entry:", JSON.stringify(error, null, 2));
    throw new Error("Failed to log entry");
  }
};

attendanceCrud.logExit = async (userId) => {
  const query = `
    UPDATE Attendance_Log 
    SET out_time = CURTIME(), status = 'Exited' 
    WHERE Emp_id = ? AND date = CURDATE() `;

  const values = [userId];

  try {
    const [result] = await pool.execute(query, values);

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      throw new Error("No attendance record found for the user on the current date.");
    }

    return { status: "200", message: "Exit logged successfully" };
  } catch (error) {
    console.error("Error logging exit:", JSON.stringify(error, null, 2));
    throw new Error("Failed to log exit: " + error.message);
  }
};

// Get attendance logs for a specific user
attendanceCrud.getAttendanceByUserId = async (userId) => {
  const [results] = await pool.execute("SELECT * FROM Attendance_Log WHERE Emp_id = ?", [userId]);
  return results;
};

// Get all attendance logs
attendanceCrud.getAllAttendance = async () => {
  const [results] = await pool.execute("SELECT * FROM Attendance_Log");
  return results;
};

module.exports = attendanceCrud;