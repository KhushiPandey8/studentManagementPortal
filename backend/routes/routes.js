import express from "express";
import { login, getAttendance, authenticateJWT, logout, getBatchTimings,getBatch, getFeeDetails,updateProfile,getBatchTimetable,getCourse, getMarks} from "../controllers/student.Controllers.js";


const router = express.Router();

router.post("/login", login);
router.get("/attendance", authenticateJWT, getAttendance);
router.get("/batch-timings", authenticateJWT, getBatchTimings); 
router.get("/get-batch", authenticateJWT, getBatch);
router.get("/get-timings", authenticateJWT, getBatchTimetable);
router.get("/get-marks", authenticateJWT, getMarks);
router.post("/logout", logout);
router.get("/fee-details", authenticateJWT, getFeeDetails);
router.get("/course-details", authenticateJWT, getCourse);
router.post('/update-profile', authenticateJWT, updateProfile)


export default router;
