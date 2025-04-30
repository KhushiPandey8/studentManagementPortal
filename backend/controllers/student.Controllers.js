import db from "../utils/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";



dotenv.config();

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const SECRET_KEY = process.env.JWT_SECRET || "mysecretkey";

// Login endpoint
export const login = async (req, res) => {
  const { username, password, captchaToken } = req.body; // Using username
  console.log("Login data received:", username);

  // 1) basic payload check
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }
  if (!captchaToken) {
    return res.status(400).json({ message: "CAPTCHA token missing." });
  }

  // 2) verify reCAPTCHA
  try {
    const params = new URLSearchParams();
    params.append("secret", RECAPTCHA_SECRET);
    params.append("response", captchaToken);

    const r = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      { method: "POST", body: params }
    );
    const captchaRes = await r.json();
    if (!captchaRes.success) {
      console.warn("reCAPTCHA failed:", captchaRes["error-codes"]);
      return res
        .status(401)
        .json({ message: "CAPTCHA failed—are you a robot?" });
    }
  } catch (err) {
    console.error("CAPTCHA verification error:", err);
    return res
      .status(500)
      .json({ message: "CAPTCHA verification service error." });
  }

  // 3) credential check
  const sql =
    "SELECT id, username, password, contact, date12, name, branch, course, address, EmailId, status, name_contactid FROM student WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (result.length === 0) {
      return res
        .status(401)
        .json({ message: "Invalid Username or Password." });
    }

    const user = result[0];
    const token = jwt.sign(
      { id: user.id, name_contactid: user.name_contactid },
      SECRET_KEY,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username, // Returning username instead of contact
        name: user.name,
        name_contactid: user.name_contactid,
        branch: user.branch,
        course: user.course,
        password: user.password,
        address: user.address,
        EmailId: user.EmailId,
        status: user.status,
        date12: user.date12,
        contact: user.contact,
      },
    });
  });
};

export const logout = (req, res) => {
  return res.status(200).json({
    message: "Logged out successfully.",
    success: true,
  });
};
// JWT authentication middleware
export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
export const getBatch = (req, res) => {
  const { name_contactid } = req.user; // Extracted from token

  const sql = `
    SELECT DISTINCT
      s.subjectname, 
      s.coursename AS course, 
      COALESCE(fs2.status, 'Pending') AS status,
      fs.batch_time,
      fs.faculty,
      fs.startdate,
      fs.endate
    FROM 
      subject s
    JOIN 
      faculty_student fs 
      ON s.coursename COLLATE utf8mb4_unicode_ci = fs.course COLLATE utf8mb4_unicode_ci
      AND fs.nameid = ?
    LEFT JOIN 
      faculty_student fs2 
      ON s.subjectname COLLATE utf8mb4_unicode_ci = fs2.subject COLLATE utf8mb4_unicode_ci
      AND fs2.nameid = ?
    WHERE 
      s.coursename IS NOT NULL
  `;

  db.query(sql, [name_contactid, name_contactid], (err, results) => {
    if (err) {
      console.error("Error fetching course details:", err);
      return res.status(500).send("Server error");
    }
    console.log("Fetched Data:", results);
    res.json(results);
  });
};


// Get Batch Timings
export const getBatchTimings = (req, res) => {
  const { name_contactid } = req.user; // Get logged-in student details

  if (!name_contactid) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const query =
    "SELECT DISTINCT batchtime, Subject, course FROM attendence WHERE name = ?";
  db.query(query, [name_contactid], (err, results) => {
    if (err) {
      console.error("Error fetching batch timings:", err);
      return res.status(500).json({ message: "Database error" });
    }
    const batchTimings = results.map((row) => row.batchtime);
    res.json(batchTimings);
  });
};

export const getBatchTimetable = (req, res) => {
  if (!req.user || !req.user.name_contactid) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const { name_contactid } = req.user;

  const query = `SELECT DISTINCT batch_time, faculty, course, subject, startdate, enddate 
                 FROM faculty_student WHERE nameid = ?`;

  db.query(query, [name_contactid], (err, results) => {
    if (err) {
      console.error("Error fetching batch timings:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

export const getAttendance = (req, res) => {
  const { batchtime, Subject } = req.query;
  const { name_contactid } = req.user; 

  if (!batchtime || !name_contactid || !Subject) {
    return res
      .status(400)
      .json({ message: "Missing batchtime, subject, or user info." });
  }

  console.log("Received:", { name_contactid, batchtime, Subject });

  const query = `
    SELECT DISTINCT
  a.date, 
  a.topic, 
  a.attendence, 
  a.Subject AS subject_name, 
  a.batchtime, 
  fs.faculty, 
  fs.startdate, 
  fs.endate
FROM attendence a
JOIN faculty_student fs 
  ON a.batchtime = fs.batch_time 
  AND a.Subject = fs.subject
WHERE a.batchtime = ? 
  AND a.name = ? 
  AND a.Subject = ?
GROUP BY a.date, a.topic, a.attendence, a.Subject, a.batchtime, fs.faculty, fs.startdate, fs.endate;

  `;

  console.log("Executing Query:", query);
  console.log("Query Parameters:", [batchtime, name_contactid, Subject]);

  db.query(query, [batchtime, name_contactid, Subject], (err, results) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      console.log("No attendance records found.");
      return res.status(404).json({ message: "No attendance records found." });
    }

    console.log("Query Results:", JSON.stringify(results, null, 2));
    res.json(results);
  });
};

// API route

// Get Fee Details
export const getFeeDetails = (req, res) => {
  const { name_contactid } = req.user; // Get authenticated user

  if (!name_contactid) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const query = `
    SELECT DISTINCT
      Receipt, name, course, Recieve, Dates, ModeOfPayement, 
      courseFees, Paid, Balance, status, totalfees, course
    FROM payement 
    WHERE name_contactid = ?`;

  db.query(query, [name_contactid], (err, results) => {
    if (err) {
      console.error("Error fetching fee details:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

export const getCourse = (req, res) => {
  const { name_contactid } = req.user;
  if (!name_contactid) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const query = `
    SELECT DISTINCT
        s.subjectname, 
        s.coursename AS course, 
        COALESCE(fs2.status, 'Pending') AS status
    FROM subject s
    JOIN faculty_student fs 
        ON s.coursename COLLATE utf8mb4_unicode_ci = fs.course COLLATE utf8mb4_unicode_ci
        AND fs.nameid = ?
    LEFT JOIN faculty_student fs2 
        ON s.subjectname COLLATE utf8mb4_unicode_ci = fs2.subject COLLATE utf8mb4_unicode_ci
        AND fs2.nameid = ?
  `;

  db.query(query, [name_contactid, name_contactid], (err, results) => {
    if (err) {
      console.error("Error fetching course details:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

export const getMarks = (req, res) => {
  const { name_contactid } = req.user;
  if (!name_contactid) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const query = `
    SELECT DISTINCT fs.course FROM faculty_student fs WHERE fs.nameid = ?;
  `;

  db.query(query, [name_contactid], (err, courseResults) => {
    if (err) {
      console.error("Error fetching courses:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const courses = courseResults.map((row) => row.course);

    const marksQuery = `
      SELECT 
          fs.subject AS subjectname, 
          fs.course, 
          sm.subject AS sm_subject,
          sm.marks_outoff,
          DATE_FORMAT(sm.exam_date, '%d-%m-%Y') AS exam_date,  
          sm.marks_obtain
      FROM faculty_student fs
      LEFT JOIN student_marks sm 
          ON fs.subject COLLATE utf8mb4_unicode_ci = sm.subject COLLATE utf8mb4_unicode_ci
          AND sm.nameid = ?
      WHERE fs.nameid = ?;
    `;

    db.query(
      marksQuery,
      [name_contactid, name_contactid],
      (err, marksResults) => {
        if (err) {
          console.error("Error fetching marks:", err);
          return res.status(500).json({ message: "Database error" });
        }

        const subjects = marksResults.map((row) => ({
          subjectname: row.subjectname,
          course: row.course,
          status: row.sm_subject ? "Completed" : "Pending",
          exam_date: row.exam_date || null,
          marks_obtain: row.marks_obtain || null,
          marks_outoff: row.marks_outoff || null,
        }));

        res.json({ courses, subjects });
      }
    );
  });
};

export const updateProfile = (req, res) => {
  const { name, contact, course, address, branch, password, status, EmailId, username } = req.body;

  let updateFields = [];
  let updateValues = [];

  if (name) {
    updateFields.push("name = ?");
    updateValues.push(name);
  }
  if (contact) {
    updateFields.push("contact = ?");
    updateValues.push(contact);
  }
  if (username) {
    updateFields.push("username = ?");
    updateValues.push(username);
  }
  if (course) {
    updateFields.push("course = ?");
    updateValues.push(course);
  }
  if (address) {
    updateFields.push("address = ?");
    updateValues.push(address);
  }
  if (branch) {
    updateFields.push("branch = ?");
    updateValues.push(branch);
  }
  if (password) {
    updateFields.push("password = ?");
    updateValues.push(password);
  }
  if (status) {
    updateFields.push("status = ?");
    updateValues.push(status);
  }
  if (EmailId) {
    updateFields.push("EmailId = ?");
    updateValues.push(EmailId);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateValues.push(req.user.id);

  const sql = `UPDATE student SET ${updateFields.join(", ")} WHERE id = ?`;

  db.query(sql, updateValues, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database update failed" });
    }
    return res.json({ message: "Profile updated successfully" });
  });
};
