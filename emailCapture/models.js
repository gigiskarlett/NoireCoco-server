"use strict";
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const EmailCaptureSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  }
});

EmailCaptureSchema.methods.serialize = function() {
  return {
    id: this.id,
    email: this.email
  };
};

const EmailCapture = mongoose.model("EmailCapture", EmailCaptureSchema);

module.exports = { EmailCapture };
