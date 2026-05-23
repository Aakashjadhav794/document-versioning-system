const mongoose = require("mongoose");
const conflictSchema = new mongoose.Schema({
  field: String,
  oldValue: String,
  newValue: String,
});

const documentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  documentType: {
    type: String,
    required: true,
  },

  fullName: {
    type: String,
    default: "",
  },

  documentNumber: {
    type: String,
    default: "",
  },

  expiryDate: {
    type: String,
    default: "",
  },

  dob: {
    type: String,
    default: "",
  },

  nationality: {
    type: String,
    default: "",
  },

  extractedText: {
    type: [String],
    default: [],
  },

  version: {
    type: Number,
    default: 1,
  },

  isLatest: {
    type: Boolean,
    default: true,
  },

  conflict: {
    type: Boolean,
    default: false,
  },

  conflictDetails: {
    type: [conflictSchema],
    default: [],
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Document", documentSchema);
