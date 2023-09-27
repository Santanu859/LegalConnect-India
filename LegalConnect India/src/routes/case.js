const express = require('express');
const { auth } = require("../middlewares/auth");

const {
  viewCase, 
  viewCompleteCase, 
  addExam, 
  addExamView, 
  viewLSP, 
  addRequest, 
  viewRequest, 
  acceptRequest, 
  upcomingCases, 
  addReviewView, 
  viewOwnReview, 
  addReview
} = require('../controllers/case.controller');

const route = express.Router();

route.get('/mycases', auth, viewCase);
route.get('/accept', auth, viewCompleteCase);
route.post('/case', auth, addExam);
route.get('/addcase', auth, addExamView);
route.get('/lsp/:id', auth, viewLSP);
route.get('/request/:id', auth, addRequest);
route.get('/reques', auth, viewRequest);
route.get('/requestAccept/:id', auth, acceptRequest);
route.get('/upcoming', auth, upcomingCases);
route.get("/myreview", auth, viewOwnReview);
route.post('/review', auth, addReview);
route.get('/addreview/:id', auth, addReviewView);

module.exports = route;