const express = require("express");
const { auth } = require('../middlewares/auth');
const {
  login,
  register,
  logout,
  loginView,
  viewProfile,
  viewCustomerProfile,
  updateProfile,
  viewProfileOfLSP
} = require("../controllers/user.controller");
const {
  createOrder
} = require("../controllers/paymentController");

const route = express.Router();

route.get('/', loginView);
route.post('/login', login);
route.post('/register', register);
route.get('/logout', logout);
route.get('/profile', auth, viewProfile);
route.get('/customerProfile', auth, viewCustomerProfile);
route.post('/profile', auth, updateProfile);
route.get('/profil/:id', auth, viewProfileOfLSP);
route.post('/createOrder', createOrder);



module.exports = route;
