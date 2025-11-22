const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

// to run it : node createAdmin.js

// تحميل متغيرات البيئة
dotenv.config();

// إنشاء حساب مدير افتراضي
const createDefaultAdmin = async () => {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect('mongodb+srv://elrecephasan_db_user:UvZfCHbYUzY5FPsY@cluster0.yslk68w.mongodb.net/HalafayaDB');

    console.log('✅ متصل بقاعدة البيانات');

    // التحقق من وجود مدير
    const existingAdmin = await Admin.findOne({ username: 'admin' });

    if (existingAdmin) {
      console.log('⚠️ حساب المدير موجود بالفعل');
      process.exit(0);
    }

    // إنشاء مدير جديد
    const admin = await Admin.create({
      // to do : change the username and password and email
      username: 'admin',
      password: '12345678',
      email: 'elrecephasan@gmail.com'
    });
  
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في إنشاء حساب المدير:', error.message);
    process.exit(1);
  }
};

createDefaultAdmin();

