const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

// ── GET /api/contracts/:bookingId — get contract data ──
router.get('/:bookingId', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('apartment');
    if (!booking) return res.status(404).json({ success: false, message: 'الحجز غير موجود' });

    const contract = {
      contractNumber:  booking.contractNumber,
      contractDate:    booking.createdAt.toLocaleDateString('ar-EG'),
      // Broker
      broker: {
        name:  'شركة نور الله للتسويق العقاري',
        phone: process.env.WHATSAPP_NUMBER || '201503244665'
      },
      // Tenant
      tenant: {
        name:  booking.guestName,
        phone: booking.guestPhone
      },
      // Property
      property: {
        title:     booking.apartment.title,
        city:      booking.apartment.city,
        area:      booking.apartment.area,
        size:      booking.apartment.size,
        rooms:     booking.apartment.rooms,
        persons:   booking.apartment.persons
      },
      // Period
      checkIn:       booking.checkIn.toLocaleDateString('ar-EG'),
      checkOut:      booking.checkOut.toLocaleDateString('ar-EG'),
      nights:        booking.nights,
      persons:       booking.persons,
      // Financials
      basePrice:     booking.basePrice,
      extrasTotal:   booking.extrasTotal,
      totalAmount:   booking.totalAmount,
      commission:    booking.commission,
      penaltyAmount: booking.commission * 3,
      paymentMethod: booking.paymentMethod,
      // Status
      status:        booking.status,
      paymentStatus: booking.paymentStatus
    };

    res.json({ success: true, data: contract });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
