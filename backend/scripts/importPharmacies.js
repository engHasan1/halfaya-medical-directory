const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// تحميل متغيرات البيئة
dotenv.config();

// استيراد نموذج الصيدلية
const Pharmacy = require('../models/Pharmacy');

// مسار ملف JSON
const pharmaciesFilePath = path.join(__dirname, '../../assets/data/pharmacies.json');

// دالة ربط قاعدة البيانات
const connectDB = async () => {
  try {
    // استخدام نفس الاتصال المستخدم في createAdmin.js
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://elrecephasan_db_user:UvZfCHbYUzY5FPsY@cluster0.yslk68w.mongodb.net/HalafayaDB';
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB متصل: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ خطأ في الاتصال بقاعدة البيانات: ${error.message}`);
    process.exit(1);
  }
};

// دالة إضافة الصيدليات
const importPharmacies = async () => {
  try {
    // قراءة ملف JSON
    const pharmaciesData = JSON.parse(fs.readFileSync(pharmaciesFilePath, 'utf8'));
    
    console.log(`📋 تم قراءة ${pharmaciesData.length} صيدلية من الملف`);
    
    // التحقق من وجود صيدليات في قاعدة البيانات
    const existingPharmacies = await Pharmacy.find();
    console.log(`📊 عدد الصيدليات الموجودة حالياً: ${existingPharmacies.length}`);
    
    let added = 0;
    let skipped = 0;
    
    // إضافة كل صيدلية
    for (const pharmacyData of pharmaciesData) {
      // التحقق من وجود صيدلية بنفس الاسم أو رقم الهاتف
      const existing = await Pharmacy.findOne({
        $or: [
          { name: pharmacyData.name },
          { phone: pharmacyData.phone }
        ]
      });
      
      if (existing) {
        console.log(`⏭️  تم تخطي: ${pharmacyData.name} (موجودة بالفعل)`);
        skipped++;
        continue;
      }
      
      // إنشاء صيدلية جديدة
      await Pharmacy.create({
        name: pharmacyData.name,
        phone: pharmacyData.phone,
        address: pharmacyData.address,
        isOnDuty: pharmacyData.isOnDuty || false
      });
      
      console.log(`✅ تمت إضافة: ${pharmacyData.name}`);
      added++;
    }
    
    console.log('\n📊 ملخص العملية:');
    console.log(`   ✅ تمت إضافة: ${added} صيدلية`);
    console.log(`   ⏭️  تم تخطي: ${skipped} صيدلية (موجودة بالفعل)`);
    console.log(`   📋 إجمالي: ${pharmaciesData.length} صيدلية`);
    
    // حذف الملف بعد إضافة البيانات بنجاح
    if (added > 0 || skipped > 0) {
      try {
        fs.unlinkSync(pharmaciesFilePath);
        console.log(`\n🗑️  تم حذف الملف: ${pharmaciesFilePath}`);
      } catch (error) {
        console.error(`⚠️  تحذير: لم يتم حذف الملف: ${error.message}`);
      }
    }
    
    console.log('\n✨ تمت العملية بنجاح!');
    process.exit(0);
    
  } catch (error) {
    console.error(`❌ خطأ في إضافة البيانات: ${error.message}`);
    process.exit(1);
  }
};

// تشغيل السكربت
const run = async () => {
  await connectDB();
  await importPharmacies();
};

run();

