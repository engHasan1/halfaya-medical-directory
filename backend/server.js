const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// تحميل متغيرات البيئة
dotenv.config();

// استيراد الروتات
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const pharmacyRoutes = require('./routes/pharmacies');
const pharmacistRoutes = require('./routes/pharmacists');

// إنشاء تطبيق Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ربط قاعدة البيانات
const connectDB = require('./config/database');

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/pharmacists', pharmacistRoutes);

// Route رئيسي للاختبار
app.get('/', (req, res) => {
  res.json({
    message: 'مرحباً بك في API نظام إدارة الأطباء والصيدليات',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      doctors: '/api/doctors',
      pharmacies: '/api/pharmacies',
      pharmacists: '/api/pharmacists'
    }
  });
});

// معالجة الأخطاء 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'الصفحة المطلوبة غير موجودة'
  });
});

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حدث خطأ في الخادم',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// تشغيل الخادم
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});

module.exports = app;

