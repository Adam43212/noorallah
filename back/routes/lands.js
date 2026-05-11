const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  city:        { type: String, required: true },
  area:        { type: String, required: true },
  type:        { type: String, enum: ['زراعية','بناء','صناعية'], required: true },
  price:       { type: Number, required: true },
  priceUnit:   { type: String, default: 'الفدان' },
  size:        { type: Number, required: true },
  sizeUnit:    { type: String, default: 'فدان' },
  rating:      { type: Number, default: 5.0 },
  reviews:     { type: Number, default: 0 },
  available:   { type: Boolean, default: true },
  images:      [{ type: String }],
  badges:      [{ type: String }],
  description: { type: String },
  features:    [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Land', landSchema);
