const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  city:        { type: String, required: true },
  area:        { type: String, required: true },
  type:        { type: String, enum: ['مصيف','طالب','عائلي'], required: true },
  price:       { type: Number, required: true },
  priceUnit:   { type: String, default: 'ليلة' },
  size:        { type: Number, required: true },
  rooms:       { type: Number, required: true },
  bathrooms:   { type: Number, required: true },
  persons:     { type: Number, required: true },
  floor:       { type: Number, default: 0 },
  rating:      { type: Number, default: 5.0 },
  reviews:     { type: Number, default: 0 },
  available:   { type: Boolean, default: true },
  images:      [{ type: String }], // array of image paths
  badges:      [{ type: String }],
  description: { type: String },
  amenities:   [{ type: String }],
  extraServices: [{
    name:  { type: String },
    price: { type: Number }
  }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Apartment', apartmentSchema);
