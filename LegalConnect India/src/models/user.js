const mongoose = require("mongoose");
const Schema = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    default: '',
  },
  emailID: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
  licenceNumber: {
    type: String,
    default: '',
  },
  practiceLocation : {
    type: String,
    default: '',
  },
  experience: {
    type: String,
    default: '',
  },
  college: {
    type: String,
    default: '',
  },
  specialization: {
    type: [],
  },
  fees: {
    type: String,
    default: '',
  },
  shortIntro : {
    type: String,
    default: '',
  },
});

userSchema.methods.getToken = function ({ exp, secret }) {
  let token;
  if (exp) {
    token = jwt.sign({ id: this._id }, secret, {
      expiresIn: exp,
    });
  } else {
    token = jwt.sign({ id: this._id }, secret);
  }

  return token;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const user = new mongoose.model("user", userSchema);

module.exports = user;
