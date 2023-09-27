const mongoose = require("mongoose");
const Schema = require("mongoose");

const caseSchema = new mongoose.Schema({
  costumerId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  lspId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    trim: true,
  },
  reqLSP : {
    type: [Schema.Types.ObjectId],
  },
  text: {
    type: String,
    default: 'No Review Yet',
    trim: true,
  }
});

const lspCase = new mongoose.model('lspCase', caseSchema);

module.exports = lspCase;