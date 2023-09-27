const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const lspCase = require('../models/case');
const user = require("../models/user");
const { successResponse, errorResponse } = require("../utils");

const login = async (req, res) => {
  try {
    const emailID = req.body.emailID;
    const password = req.body.password;
    const role = req.body.role

    // check for email exist or not
    const userData = await user.findOne({ emailID: emailID, role: role });
    if (!userData) {
      return res.render("login", { message: 'Wrong Credentials !!' });
    }

    // check for the password
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.render("login", { message: 'Wrong Credentials !!' });

      // return errorResponse(req, res, 'Invalid credentials!', 404);
    } else {
      // jwt token created
      let accessToken = userData.getToken({
        exp: 60 * 60,
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      res.cookie("accessToken", accessToken);
      await userData.save();

      if(role === 'customer') {
        if(userData.address === '') return res.redirect("/customerProfile");
        else return res.redirect('/mycases');
      } else if(role === 'service provider') {
        if(userData.address === '') return res.redirect("/profile");
        else return res.redirect('/reques');
      }
    }
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, "something went wrong!", 400, {
      err: error,
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, emailID, password, role } = new user(req.body);

    // check if email id allready exist
    const userData = await user.findOne({ emailID: emailID });

    if (userData) {
      return errorResponse(req, res, "email id allready exist", 400);
    } else {
      // creating payload
      const payload = {
        username,
        emailID,
        password,
        role,
      };

      // register new user
      const newUser = new user(payload);
      const insertUser = await newUser.save();

      console.log("Registration Successful");
      res.render("login", { message: ''});
      // return successResponse(req, res, insertUser, 200);
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const loginView = async (req, res) => {
  return res.render("login", { message: '' });
};

const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.render("login", { message: ''});
  } catch (error) {
    return errorResponse(req, res, "Error while logging out", 500);
  }
};

const viewProfile = async (req, res) => {
  try {
    const id = req.user._id;
    console.log(id);
    let userData = await user.findOne({ _id: id });
    // console.log(userData);
    res.render("userProfile", { users: userData });

  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const viewCustomerProfile = async (req, res) => {
  try {
    const id = req.user._id;
    console.log(id);
    let userData = await user.findOne({ _id: id });
    // console.log(userData);
    res.render("userProfileCostumer", { users: userData });

  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const updateProfile = async (req, res) => {
  try {
    let userId = req.user._id;
    let userRoleData = await user.findOne({ _id: userId });
    console.log('userRole-->', userRoleData);
    let role = await userRoleData.role;
    console.log('role-->', role);

    if(role === 'customer') {
        const updateDetails = await user.findByIdAndUpdate(userId, {
        username : req.body.username,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
      });

      const userData = await user.findOne({ _id: userId });
      if (!userData) {
        return errorResponse(req, res, "User Not Found", 404);
      } else {
        res.render("userProfileCostumer", { users: userData });
      }
    }

    if(role === 'service provider') {
        const updateDetails = await user.findByIdAndUpdate(userId, {
        username : req.body.username,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        licenceNumber: req.body.licenceNumber,
        practiceLocation : req.body.practiceLocation,
        experience: req.body.experience,
        college: req.body.college,
        specialization: req.body.specialization,
        fees: req.body.fees,
        shortIntro : req.body.shortIntro,
      });
      
      const userData = await user.findOne({ _id: userId });
      if (!userData) {
        return errorResponse(req, res, "User Not Found", 404);
      } else {
        res.render("userProfile", { users: userData });
      }
    }

  } catch (error) {
    console.log(error.message)
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const viewProfileOfLSP = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    let userData = await user.findOne({ _id: id });
    console.log(userData);

    let status = 'accepted';
    const examData = await lspCase.find({ lspId: id, status: status }).populate("costumerId");
    console.log(examData);

    res.render("lspProfile", { users: userData, exams: examData });

  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

module.exports = {
  login,
  register,
  logout,
  loginView,
  viewProfile,
  viewCustomerProfile,
  updateProfile,
  viewProfileOfLSP,
};
