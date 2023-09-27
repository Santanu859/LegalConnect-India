const lspCase = require("../models/case");
const user = require("../models/user");
const { successResponse, errorResponse } = require("../utils");
let globalCaseId;
let caseIdGlobal;


const viewCase = async (req, res) => {
  try {
    let userId = req.user._id;
    const examData = await lspCase.find({
      costumerId: userId,
      status: "pending",
    });
    console.log(examData);
    res.render("viewCaseCostumer", { exams: examData });
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400, { err: error });
  }
};


const viewCompleteCase = async (req, res) => {
  try {
    let userId = req.user._id;
    let status = "accepted";
    const examData = await lspCase
      .find({
        costumerId: userId,
        status: status,
      })
      .populate("lspId");
    console.log(examData);
    res.render("viewAcceptedForCostumer", { exams: examData });
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, "something went wrong", 400, { err: error });
  }
};


const addExam = async (req, res) => {
  try {
    console.log("req.body", req.body);
    let userId = req.user._id;

    const payload = {
      costumerId: userId,
      description: req.body.description,
      type: req.body.specialization,
      location: req.body.location,
    };

    // register new user
    const newExam = new lspCase(payload);
    const insertExam = await newExam.save();
    console.log("insert", insertExam);
    console.log("Case Added Successful");
    res.redirect("/mycases");
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, "something went wrong", 500, { err: error });
  }
};

const addExamView = async (req, res) => {
  res.render("addCase");
};


const viewLSP = async (req, res) => {
  try {
    let lspId = req.params.id;
    globalCaseId = lspId;
    const examData = await lspCase.findOne({ _id: lspId });
    console.log(examData);

    let city = examData.location;
    const voluteerData = await user.find({
      practiceLocation: city,
      specialization: {
        $in: [examData.type],
      },
    });
    console.log("voluteerData-->", voluteerData);
    res.render("viewLSPByCostumer", { volunteers: voluteerData });
  } catch (error) {
    console.log(error.message);
  }
};


const addRequest = async (req, res) => {
  try {
    let lspId = req.params.id;

    let examData = await lspCase.findOne({ _id: globalCaseId });

    if (!examData.reqLSP.includes(lspId)) {
      examData.reqLSP.push(lspId);
      examData.save();
    }
    res.redirect("/mycases");
  } catch (error) {
    console.log(error.message);
  }
};


const viewRequest = async (req, res) => {
  try {
    let userId = req.user._id;
    let status = "pending";
    const examData = await lspCase
      .find({
        reqLSP: { $in: userId },
        status: status,
      })
      .populate("costumerId");
    console.log(examData);
    res.render("viewRequest", { exams: examData });
  } catch (error) {
    console.log(error.message);
  }
};


const acceptRequest = async (req, res) => {
  try {
    let userId = req.user._id;
    let caseId = req.params.id;
    let status = "accepted";
    const examData = await lspCase.findByIdAndUpdate(caseId, {
      lspId: userId,
      status: status,
    });
    console.log(examData);
    res.redirect("/upcoming");
  } catch (error) {
    console.log(error.message);
  }
};


const upcomingCases = async (req, res) => {
  try {
    let userId = req.user._id;
    console.log(userId);
    let status = "accepted";
    const examData = await lspCase
      .find({ lspId: userId, status: status })
      .populate("costumerId");
    console.log(examData);
    res.render("viewUpcoming", { exams: examData });
  } catch (error) {
    console.log(error.message);
  }
};

const viewOwnReview = async (req, res) => {
  try {
    let userId = req.user._id;

    const examData = await lspCase
      .find({ volunteerId: userId })
      .populate("constumerId");
    console.log(examData);
    res.render("viewOwnReview", { exams: examData });
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400, { err: error });
  }
};

const addReview = async (req, res) => {
  try {
    let caseId = caseIdGlobal;
    let text = req.body.text;
    const examData = await lspCase.findByIdAndUpdate(caseId, { text: text });
    console.log(examData);
    res.redirect("/accept");
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, "something went wrong", 500, { err: error });
  }
};

const addReviewView = async (req, res) => {
  caseIdGlobal = req.params.id;
  res.render("addReview");
};

module.exports = {
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
  addReview,
};
