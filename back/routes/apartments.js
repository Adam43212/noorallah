const express = require('express');
const router = express.Router();
const Apartment = require('../models/Apartment');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadApartmentImages } = require('../middleware/upload');

// ── GET /api/apartments — public, with filters ──
router.get('/', async (req, res) => {
  try {
    const { city, type, persons, available, minPrice, maxPrice } = req.query;
    const filter = {};
    if (city)      filter.city = city;
    if (type)      filter.type = type;
    if (available !== undefined) filter.available = available === 'true';
    if (persons)   filter.persons = { $gte: parseInt(persons) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    const apartments = await Apartment.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: apartments.length, data: apartments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/apartments/:id — single apartment ──
router.get('/:id', async (req, res) => {
  try {
    const apt = await Apartment.findById(req.params.id);
    if (!apt) return res.status(404).json({ success: false, message: 'الشقة غير موجودة' });
    res.json({ success: true, data: apt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/apartments — admin only ──
router.post('/', protect, adminOnly, (req, res, next) => {
  uploadApartmentImages(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    try {
      const images = req.files?.map(f => `/uploads/apartments/${f.filename}`) || [];
      const apt = await Apartment.create({ ...req.body, images, owner: req.user._id });
      res.status(201).json({ success: true, data: apt });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });
});

// ── PUT /api/apartments/:id — admin only ──
router.put('/:id', protect, adminOnly, (req, res, next) => {
  uploadApartmentImages(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    try {
      const update = { ...req.body };
      if (req.files?.length) {
        update.images = req.files.map(f => `/uploads/apartments/${f.filename}`);
      }
      const apt = await Apartment.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
      if (!apt) return res.status(404).json({ success: false, message: 'الشقة غير موجودة' });
      res.json({ success: true, data: apt });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });
});

// ── DELETE /api/apartments/:id — admin only ──
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const apt = await Apartment.findByIdAndDelete(req.params.id);
    if (!apt) return res.status(404).json({ success: false, message: 'الشقة غير موجودة' });
    res.json({ success: true, message: 'تم حذف الشقة' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/apartments/:id/availability ──
router.patch('/:id/availability', protect, adminOnly, async (req, res) => {
  try {
    const apt = await Apartment.findByIdAndUpdate(
      req.params.id,
      { available: req.body.available },
      { new: true }
    );
    res.json({ success: true, data: apt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
