const router = require("express").Router();
// import access token checker
const tokenChecker = require("../tokenize/tokenChecker");
// import handler request
const { getAttendanceList, createAttendance, editAttendance } = require("../api/attendance");

router.get("/list/:id?", tokenChecker, getAttendanceList);
router.post("/create/:id?", tokenChecker, createAttendance);

module.exports = router;
