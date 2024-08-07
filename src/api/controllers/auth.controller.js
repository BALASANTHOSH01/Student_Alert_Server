require("dotenv").config();
const jwt = require("jsonwebtoken");
const Staff = require("../models/staff.model.js");
const Institute = require("../models/institute.model.js");
const Student = require("../models/student.model.js");
const uniqueCodeGenerator = require("../utils/uniqueCodeGenerator.js");
const setTokenCookie = require("../utils/setTokenCookie.js");
const tokenGenerator = require("../utils/tokenGenerator.js");

// Staff Register 
exports.staffRegister = async (req, res) => { 
  try {
    const role = "staff";
    const { name, email, password, phoneNumber, department, year, section, institute } = req.body;

    const Details = {
      name,
      email,
      password,
      phoneNumber,
      department,
      institute
    };

    Object.values(Details).map((details)=>{
      console.log("details : "+details);
    })

    if (!name || !email || !password || !department || !phoneNumber || !institute) {
      return res.status(409).send("All fields are required.");
    }

    const isExist = await Staff.findOne({ email });
    if (isExist) {
      return res.status(409).send("User already exists");
    }

    const staffData = await Staff.create({
      name,
      email,
      password,
      phoneNumber,
      role,
      assigned_sections: { department: department, year, section },
      institute,
    });

    const userData = { staff_id: staffData._id, role: "staff" };
    const token = tokenGenerator.generateAccessToken(userData);
    // const refreshToken = tokenGenerator.generateRefreshToken(userData);

    // const saveRefreshToken = await Staff.findOneAndUpdate({email:staffData.email},{refreshToken:refreshToken});

    // if(!saveRefreshToken){
    //   res.status(409).send("refersh Token is not saved.");
    // }

    res.status(201).json({ staffData, token });
  } catch (error) {
    console.log("Staff Register error: " + error.message);
  }
};

// Staff Login
exports.staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send("Invalid user credentials");
    }

    const staffData = await Staff.findOne({ email });
    if (!staffData) {
      return res.status(404).send("User Not Found");
    }

    const isPasswordCorrect = await staffData.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Incorrect password");
    }

    const token = jwt.sign({ staff_id: staffData._id, role: "staff" }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "24h" });


    res.status(200).json({ staffData,token });
  } catch (error) {
    console.log("Staff Login error: " + error.message);
  }
};

// Register Institute
exports.registerInstitute = async (req, res) => {
  try {
    const { name, email, password, pincode, college_code } = req.body;

    if (!name || !email || !password || !pincode) {
      return res.status(400).send("All fields are required.");
    }

    const unique_code = await uniqueCodeGenerator(name, college_code);

    const instituteData = await Institute.create({
      name,
      email,
      password,
      unique_code,
      pincode,
      college_code,
    });

    const token = jwt.sign({ institute_id: instituteData._id, role: "institute" }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "24h" });


    res.status(200).json({ instituteData,token });
  } catch (error) {
    console.error("Account creation error:", error.message);
    res.status(500).send("An error occurred while creating institute account.");
  }
};

// Institute Login
exports.loginInstitute = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send("Email and password fields are required.");
    }

    const instituteData = await Institute.findOne({ email });
    if (!instituteData) {
      return res.status(404).send("User Not Found");
    }

    const isPasswordCorrect = await instituteData.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Incorrect password");
    }

    const token = jwt.sign({ institute_id: instituteData._id, role: "institute" }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "24h" });


    res.status(200).json({ instituteData,token });
  } catch (error) {
    console.error("Account creation error:", error.message);
    res.status(500).send("An error occurred while creating institute account.");
  }
};

// Create Student
exports.createStudent = async (req, res) => { 
  try {
    const { name, rollno, email, password, department, year, section, totalPresent, totalAbsent, phoneNumber, parentNumber, batch, institute } = req.body;

    // if (!name || !rollno || !email || !password || !department || !year || !phoneNumber || !parentNumber || !institute) {
    //   return res.status(409).send("All fields are required.");
    // }

    const isExist = await Student.findOne({ email });
    if (isExist) {
      return res.status(409).send("User already exists.");
    }

    const studentData = await Student.create({
      name,
      rollno,
      email,
      password,
      department,
      year,
      section,
      totalPresent, 
      totalAbsent,
      phoneNumber,
      parentNumber,
      batch,
      institute,
    });

    const token = jwt.sign({ student_id: studentData._id, role: "student" }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "24h" });


    res.status(200).json({ studentData,token });
  } catch (error) {
    console.log("Student creation error: " + error.message);
    res.status(500).send("Server error.");
  }
};

// Login Student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(409).send("Email and password are required.");
    }

    const studentData = await Student.findOne({ email });
    if (!studentData) {
      return res.status(404).send("Email is not present.");
    }

    const isPasswordCorrect = await studentData.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Incorrect password");
    }

    const token = jwt.sign({ student_id: studentData._id, role: "student" }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "24h" });


    res.status(200).json({ studentData,token });
  } catch (error) {
    console.log("Student login error: " + error.message);
    res.status(500).send("Server error.");
  }
};
