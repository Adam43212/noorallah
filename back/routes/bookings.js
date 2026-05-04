const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Apartment = require('../models/Apartment');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadIdCard } = require('../middleware/upload');

// ── POST /api/bookings — create a booking ──
router.post('/', (req, res) => {
  uploadIdCard(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    try {
      const {
        apartmentId, guestName, guestPhone,
        checkIn, checkOut, persons,
        paymentMethod, extraServices
      } = req.body;

      // Validate apartment
      const apt = await Apartment.findById(apartmentId);
      if (!apt)          return res.status(404).json({ success: false, message: 'الشقة غير موجودة' });
      if (!apt.available) return res.status(400).json({ success: false, message: 'الشقة محجوزة حالياً' });

      // Calculate nights & price
      const checkInDate  = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkOutDate <= checkInDate) {
        return res.status(400).json({ success: false, message: 'تواريخ غير صحيحة' });
      }
      const nights = Math.round((checkOutDate - checkInDate) / 86400000);
      const basePrice = nights * apt.price;

      // Extras
      let extrasList = [];
      let extrasTotal = 0;
      if (extraServices) {
        const parsed = typeof extraServices === 'string' ? JSON.parse(extraServices) : extraServices;
        extrasList = parsed;
        extrasTotal = parsed.reduce((sum, e) => sum + (e.price || 0), 0);
      }

      const totalAmount = basePrice + extrasTotal;
      const commission  = Math.round(totalAmount * (parseFloat(process.env.COMMISSION_RATE) || 0.05));

      const booking = await Booking.create({
        apartment:     apt._id,
        guestName,
        guestPhone,
        idCardImage:   req.file ? `/uploads/ids/${req.file.filename}` : null,
        checkIn:       checkInDate,
        checkOut:      checkOutDate,
        nights,
        persons:       parseInt(persons),
        extraServices: extrasList,
        basePrice,
        extrasTotal,
        totalAmount,
        commission,
        paymentMethod,
        user: req.user?._id
      });

      // Mark apartment as unavailable (optional — toggle based on your workflow)
      // await Apartment.findByIdAndUpdate(apt._id, { available: false });

      res.status(201).json({ success: true, data: booking });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
});

// ── GET /api/bookings/my — user's own bookings ──
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('apartment', 'title city area images price')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/bookings/:id — single booking ──
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('apartment');
    if (!booking) return res.status(404).json({ success: false, message: 'الحجز غير موجود' });
    // Only owner or admin
    if (booking.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'غير مصرح' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/bookings/:id/confirm — admin confirms payment ──
router.patch('/:id/confirm', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed', paymentStatus: 'paid' },
      { new: true }
    );
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/bookings/:id/cancel ──
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'الحجز غير موجود' });
    if (booking.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'غير مصرح' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/bookings — admin: all bookings ──
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    const bookings = await Booking.find(filter)
      .populate('apartment', 'title city')
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
