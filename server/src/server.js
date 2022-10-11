require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const attendanceRoute = require("./routes/attendance");
const userRoute = require("./routes/user");
const authenticationRoute = require("./routes/authentication");
const app = express();

// konfigurasi cors
const corsOptions = {
    origin: "http://localhost:3000",
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.use("/api/attendance", attendanceRoute);
app.use("/api/users", userRoute);
app.use("/api/user", authenticationRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT: ${process.env.PORT}`);
});
