"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const { Product } = require("./models");
const jwtAuth = passport.authenticate("jwt", { session: false });
const router = express.Router();

const jsonParser = bodyParser.json();

router.get("/", (req, res) => {
  Product.find()
    .sort({
      when: 1
    })
    .then(product => {
      res.json(product.map(product => product.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went terribly wrong" });
    });
});

router.get("/:id", (req, res) => {
  Product.findById(req.params.id)
    .then(product => res.json(product.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went horribly awry" });
    });
});

router.post("/", jsonParser, jwtAuth, (req, res) => {
  const requiredFields = [
    "name",
    "imageUrl",
    "price",
    "shortDescription",
    "details",
    "style",
    "url",
    "secondImage",
    "thirdImage"
  ];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Product.create({
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    shortDescription: req.body.shortDescription,
    details: req.body.details,
    style: req.body.style,
    url: req.body.url,
    secondImage: req.body.secondImage,
    thirdImage: req.body.thirdImage
  })
    .then(product => res.status(201).json(product.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

router.delete("/:id", jwtAuth, (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went terribly wrong" });
    });
});

router.put("/:id", jsonParser, jwtAuth, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }

  const updated = {};
  const updateableFields = [
    "name",
    "imageUrl",
    "price",
    "shortDescription",
    "details",
    "style",
    "url",
    "secondImage",
    "thirdImage"
  ];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Product.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedProduct => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Something went wrong" }));
});

module.exports = { router };
