"use strict";
const express = require("express");
const bodyParser = require("body-parser");

const { EmailCapture } = require("./models");

const router = express.Router();

const jsonParser = bodyParser.json();

router.post("/", jsonParser, (req, res) => {
  const requiredFields = ["email"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  EmailCapture.create({
    email: req.body.email,
  })
    .then(email => res.status(201).json(email.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

module.exports = { router };