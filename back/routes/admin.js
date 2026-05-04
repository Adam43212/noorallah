const express = require('express');
const router = express.Router();
const User     = require('../models/User');
const Apartment= require('../models/Apartment');
const Land     = require('../models/Land');
const Booking  = require('../models/Booking');
const Inquiry  = require('../models/Inquiry');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// ── GET /api/admin/stats ──
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalApts,
      availableApts,
      totalLands,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalInquiries
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Apartment.countDocuments(),
      Apartment.countDocuments({ available: true }),
      Land.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Inquiry.countDocuments()
    ]);

    // Total revenue (confirmed bookings)
    const revenueData = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, commission: { $sum: '$commission' } } }
    ]);
    const revenue = revenueData[0] || { total: 0, commission: 0 };

    res.json({
      success: true,
      data: {
        users:            totalUsers,
        apartments:       totalApts,
        availableApts,
        lands:            totalLands,
        bookings:         totalBookings,
        pendingBookings,
        confirmedBookings,
        inquiries:        totalInquiries,
        totalRevenue:     revenue.total,
        totalCommission:  revenue.commission
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/admin/users ──
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/admin/users/:id/toggle ── block/unblock
router.patch('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/admin/inquiries ──
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().populate('land', 'title city price').sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/admin/inquiries/:id ── update status
router.patch('/inquiries/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/admin/seed ── seed DB with sample data
router.post('/seed', async (req, res) => {
  try {
    await Apartment.deleteMany();
    await Land.deleteMany();

    const apts = await Apartment.insertMany([
      { title:'شقة فاخرة على الكورنيش', city:'الإسكندرية', area:'سيدي بشر', type:'مصيف', price:1200, size:120, rooms:3, bathrooms:2, persons:6, floor:5, rating:4.9, reviews:124, available:true, badges:['مميزة','إطلالة بحرية'], description:'شقة فاخرة بإطلالة بانورامية على البحر المتوسط.', amenities:['🌊 إطلالة بحرية','❄️ تكييف مركزي','📶 واي فاي','🍳 مطبخ','🅿️ موقف','🔐 أمن 24/7'], images:['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'], extraServices:[{name:'غسيل ملابس',price:150},{name:'تنظيف يومي',price:200}] },
      { title:'شقة الطلاب - قرب الجامعة', city:'القاهرة', area:'مدينة نصر', type:'طالب', price:350, size:75, rooms:2, bathrooms:1, persons:4, floor:2, rating:4.7, reviews:89, available:true, badges:['للطلاب','قريب من الجامعة'], description:'شقة مريحة للطلاب قريبة من الجامعات.', amenities:['📶 واي فاي فائق','❄️ تكييف','🍳 مطبخ','📚 مكتب دراسة'], images:['https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80'], extraServices:[{name:'إنترنت إضافي',price:50}] },
      { title:'فيلا الساحل الشمالي', city:'الساحل الشمالي', area:'سيدي عبد الرحمن', type:'مصيف', price:3500, size:280, rooms:5, bathrooms:3, persons:10, floor:0, rating:5.0, reviews:56, available:true, badges:['VIP','حمام سباحة خاص'], description:'فيلا فاخرة في قلب الساحل مع حمام سباحة خاص.', amenities:['🏊 حمام سباحة','🌴 حديقة','❄️ تكييف','📶 واي فاي'], images:['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80'], extraServices:[{name:'باربيكيو',price:500},{name:'طباخ خاص',price:1000}] },
      { title:'شقة عائلية هادئة', city:'الإسكندرية', area:'العجمي', type:'عائلي', price:800, size:140, rooms:3, bathrooms:2, persons:7, floor:3, rating:4.8, reviews:201, available:true, badges:['عائلي','هادئة'], description:'شقة عائلية فسيحة في منطقة هادئة.', amenities:['❄️ تكييف','📶 واي فاي','🍳 مطبخ كامل'], images:['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'], extraServices:[{name:'تنظيف مع الخروج',price:150}] },
      { title:'شقة الغردقة الفاخرة', city:'الغردقة', area:'الممشى السياحي', type:'مصيف', price:1800, size:100, rooms:2, bathrooms:2, persons:4, floor:7, rating:4.6, reviews:73, available:true, badges:['إطلالة بانورامية'], description:'شقة فاخرة مع إطلالة على البحر الأحمر.', amenities:['🌊 إطلالة','❄️ تكييف','📶 واي فاي'], images:['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80'], extraServices:[{name:'رحلة غوص',price:400}] },
      { title:'شقة شرم الشيخ - نعمة باي', city:'شرم الشيخ', area:'نعمة باي', type:'مصيف', price:2200, size:90, rooms:2, bathrooms:1, persons:4, floor:4, rating:4.9, reviews:167, available:false, badges:['محجوزة','الأكثر طلباً'], description:'شقة رائعة في قلب نعمة باي.', amenities:['🌊 قريب من البحر','❄️ تكييف','📶 واي فاي'], images:['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80'], extraServices:[{name:'رحلة بحرية',price:600}] }
    ]);

    const lands = await Land.insertMany([
      { title:'أرض زراعية على ترعة النيل', city:'دمياط', area:'كفر البطيخ', type:'زراعية', price:85000, size:3, sizeUnit:'فدان', rating:4.8, reviews:12, available:true, badges:['زراعية','على ترعة'], description:'أرض زراعية خصبة على ترعة مياه.', features:['💧 مياه ري وفيرة','🌱 تربة خصبة','🛣️ طريق ممهد','📋 أوراق رسمية'], images:['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80'] },
      { title:'قطعة أرض بناء', city:'الإسكندرية', area:'برج العرب', type:'بناء', price:450000, size:300, sizeUnit:'م²', rating:4.9, reviews:8, available:true, badges:['للبناء','موقع مميز'], description:'قطعة أرض مميزة تصلح للبناء.', features:['🏗️ تصلح للبناء','🛣️ على طريق رئيسي','💡 كهرباء وصرف'], images:['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'] },
      { title:'أراضي نخيل وبستان', city:'دمياط', area:'دمياط الجديدة', type:'زراعية', price:120000, size:5, sizeUnit:'فدان', rating:4.7, reviews:15, available:true, badges:['نخيل','استثمارية'], description:'أرض مزروعة بالنخيل والأشجار المثمرة.', features:['🌴 نخيل مثمر','💰 دخل سنوي','💧 ري بالتنقيط'], images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'] }
    ]);

    res.json({ success: true, message: `تم إدراج ${apts.length} شقة و ${lands.length} أرض`, apartments: apts.length, lands: lands.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
