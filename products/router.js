'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Product} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  Product
    .find()
    .then(product => {
      res.json(product.map(product => product.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

router.get('/:id', (req, res) => {
  Product
    .findById(req.params.id)
    .then(product => res.json(product.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['name', 'imageUrl', 'price', 'shortDescription', 'details', 'style','url'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Product
    .create({
      name: req.body.name,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      shortDescription: req.body.shortDescription,
      details: req.body.details,
      style: req.body.style,
      url: req.body.url
    })
    .then(product => res.status(201).json(product.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});


router.delete('/:id', (req, res) => {
  Product
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


router.put('/:id',jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['name', 'imageUrl', 'price', 'shortDescription', 'details', 'style', 'url'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Product
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedProduct => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


router.delete('/:id', (req, res) => {
  Product
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.id}\``);
      res.status(204).end();
    });
});



module.exports = {router};
