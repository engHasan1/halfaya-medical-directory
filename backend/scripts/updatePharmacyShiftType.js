const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pharmacy = require('../models/Pharmacy');

// تحميل متغيرات البيئة
dotenv.config();

// تحديث قاعدة البيانات
const updatePharmacyShiftType = async () => {
  try {
    // الاتصال بقاعدة البيانات
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://elrecephasan_db_user:UvZfCHbYUzY5FPsY@cluster0.yslk68w.mongodb.net/HalafayaDB';
    await mongoose.connect(mongoUri);

    console.log('✅ متصل بقاعدة البيانات');

    // تحديث جميع الصيدليات التي لا تحتوي على shiftType
    const result = await Pharmacy.updateMany(
      { shiftType: { $exists: false } },
      { $set: { shiftType: 'صباحية' } }
    );

    console.log(`✅ تم تحديث ${result.modifiedCount} صيدلية بإضافة نوع المناوبة الافتراضي (صباحية)`);

    // إغلاق الاتصال
    await mongoose.connection.close();
    console.log('✅ تم إغلاق الاتصال بقاعدة البيانات');
    process.exit(0);
  } catch (error) {
    console.error('❌ حدث خطأ:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// تشغيل السكريبت
updatePharmacyShiftType();

