const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  land:       { type: mongoose.Schema.Types.ObjectId, ref: 'Land', required: true },
  name:       { type: String, required: true },
  phone:      { type: String, required: true },
  message:    { type: String },
  commission: { type: Number }, // 5% of land price
  status:     { type: String, enum: ['new','contacted','closed'], default: 'new' },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
