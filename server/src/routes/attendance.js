const router = require("express").Router();
// import access token checker
const tokenChecker = require("../tokenize/tokenChecker");
// import handler request
const { getAttendanceList, createAttendance, getDetailAttendance } = require("../api/attendance");

router.get("/list/", tokenChecker, getAttendanceList);
router.get("/list/my/:id", tokenChecker, getDetailAttendance);
router.post("/create/:id?", tokenChecker, createAttendance);

module.exports = router;
