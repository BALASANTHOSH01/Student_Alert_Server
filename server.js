const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require('body-parser');
const connectDB = require("./src/config/db.js"); // db connection
const authRouter = require("./src/api/routes/auth.route.js"); //auth router
const staffRouter = require("./src/api/routes/staff.route.js"); //staff router
const attendanceRouter = require("./src/api/routes/attendance.route.js");
const studentRouter = require("./src/api/routes/student.route.js");
const instituteRouter = require("./src/api/routes/institute.route.js");
const searchRouter = require("./src/api/routes/search.route.js");

// const smsScheduler = require("./src/api/Schedule/smsScheduler.js");
const passwordRouter = require("./src/api/routes/password.route.js");
const { HostAddress } = require("mongodb");

const tokenRouter = require("./src/api/routes/token.route.js");

const app = express();
app.use(express.json());
app.use(cors());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse application/json
app.use(bodyParser.json());

// Parse raw body
app.use(bodyParser.raw());

// Parse text
app.use(bodyParser.text()); 

const port = process.env.PORT || 3000;

// Connect with Database
connectDB();

// Initialize the SMS functionality
// smsScheduler();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});


// Use routers
app.use("/api/staff", staffRouter);
app.use("/api/auth", authRouter);
app.use("/api/students", studentRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/institute", instituteRouter);
app.use("/api", passwordRouter);
app.use("/api/search",searchRouter);

app.get("/",(req,res)=>{
  res.send("hello world.")
})

// Listen to the port
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
