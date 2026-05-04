const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Who booked
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestName:  { type: String, required: true },
  guestPhone: { type: String, required: true },
  idCardImage:{ type: String }, // uploaded ID photo path

  // What they booked
  apartment:  { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment' },
  
  // Dates
  checkIn:    { type: Date, required: true },
  checkOut:   { type: Date, required: true },
  nights:     { type: Number, required: true },
  persons:    { type: Number, required: true },

  // Extras chosen
  extraServices: [{ name: String, price: Number }],

  // Financials
  basePrice:  { type: Number, required: true }, // nights * pricePerNight
  extrasTotal:{ type: Number, default: 0 },
  totalAmount:{ type: Number, required: true },
  commission: { type: Number, required: true }, // 5% of total

  // Payment
  paymentMethod: { type: String, enum: ['bank','visa','vodafone'], required: true },
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },

  // Booking status
  status: { type: String, enum: ['pending','confirmed','cancelled','completed'], default: 'pending' },

  // Contract
  contractNumber: { type: String, unique: true },

  createdAt: { type: Date, default: Date.now }
});

// Auto-generate contract number before save
bookingSchema.pre('save', function(next) {
  if (!this.contractNumber) {
    this.contractNumber = 'NR-' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
