'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true
  },
  url:{
    type: String,
    required:true
  },
  secondImage:{
    type: String,
    required:true
  },
  thirdImage:{
    type: String,
    required: true
  }
});

ProductSchema.methods.serialize = function() {
  return {
    id: this.id,
    name: this.name || '',
    imageUrl: this.imageUrl || '',
    price: this.price || '',
    shortDescription: this.shortDescription || '',
    details: this.details || '',
    style: this.style || '',
    url: this.url,
    secondImage: this.secondImage,
    thirdImage: this.thirdImage
  };
};


const Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};
