const mongoose = require('mongoose');
const dotenv = require('dotenv');

// تحميل متغيرات البيئة
dotenv.config();

// استيراد النموذج
const Pharmacist = require('../models/Pharmacist');

// إصلاح قاعدة البيانات
const fixPharmacistSchema = async () => {
  try {
    // الاتصال بقاعدة البيانات
    // استخدام نفس الاتصال من createAdmin.js أو من .env
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://elrecephasan_db_user:UvZfCHbYUzY5FPsY@cluster0.yslk68w.mongodb.net/HalafayaDB';
    await mongoose.connect(mongoUri);

    console.log('✅ متصل بقاعدة البيانات');

    // الحصول على Collection مباشرة
    const db = mongoose.connection.db;
    const collection = db.collection('pharmacists');

    // 1. حذف فهرس email إذا كان موجوداً
    try {
      await collection.dropIndex('email_1');
      console.log('✅ تم حذف فهرس email_1');
    } catch (error) {
      if (error.code === 27 || error.message.includes('index not found')) {
        console.log('ℹ️ فهرس email_1 غير موجود (لا بأس)');
      } else {
        throw error;
      }
    }

    // 2. حذف فهرس email_1_unique إذا كان موجوداً
    try {
      await collection.dropIndex('email_1_unique');
      console.log('✅ تم حذف فهرس email_1_unique');
    } catch (error) {
      if (error.code === 27 || error.message.includes('index not found')) {
        console.log('ℹ️ فهرس email_1_unique غير موجود (لا بأس)');
      } else {
        throw error;
      }
    }

    // 3. حذف حقول email و password من جميع السجلات القديمة
    const result = await collection.updateMany(
      {},
      {
        $unset: {
          email: "",
          password: ""
        }
      }
    );

    console.log(`✅ تم تحديث ${result.modifiedCount} سجل (حذف حقول email و password)`);

    // 4. عرض جميع الفهارس المتبقية للتأكد
    const indexes = await collection.indexes();
    console.log('\n📋 الفهارس المتبقية في Collection:');
    indexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n✅ تم إصلاح قاعدة البيانات بنجاح!');
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في إصلاح قاعدة البيانات:', error.message);
    process.exit(1);
  }
};

fixPharmacistSchema();

