const router = require("express").Router();
// import access token checker
const tokenChecker = require("../tokenize/tokenChecker");
// import handler request
const { getAttendanceList, createAttendance, getUserAttendance, getDetailAttendance, editAttendance, attendanceAnalysis } = require("../api/attendance");

router.get("/list/:filter", tokenChecker, getAttendanceList);
router.get("/list/detail/:id", tokenChecker, getDetailAttendance);
router.get("/list/my/:id", tokenChecker, getUserAttendance);
router.post("/create/:id?", tokenChecker, createAttendance);
router.put("/update/:id", tokenChecker, editAttendance);

router.get("/analysis", tokenChecker, attendanceAnalysis);

module.exports = router;
