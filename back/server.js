// ===== NOOR ALLAH — SERVER =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ── Middleware ──
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static files (uploaded images) ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Serve frontend in production ──
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Routes ──
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/apartments', require('./routes/apartments'));
app.use('/api/lands',      require('./routes/lands'));
app.use('/api/bookings',   require('./routes/bookings'));
app.use('/api/contracts',  require('./routes/contracts'));
app.use('/api/admin',      require('./routes/admin'));

// ── Health check ──
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Noor Allah API running 🏠' }));

// ── Catch-all → frontend ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'خطأ في السيرفر',
  });
});

// ── Connect DB & Start ──
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
