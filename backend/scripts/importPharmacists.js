const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// تحميل متغيرات البيئة
dotenv.config();

// استيراد نموذج الصيدلي
const Pharmacist = require('../models/Pharmacist');

// مسار ملف JSON
const pharmacistsFilePath = path.join(__dirname, '../../assets/data/pharmacists.json');

// دالة ربط قاعدة البيانات
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/halfaya_medical_directory';
    
    // إعدادات الاتصال المحسّنة
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(mongoURI, options);
    console.log(`✅ MongoDB متصل: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ خطأ في الاتصال بقاعدة البيانات: ${error.message}`);
    process.exit(1);
  }
};

// دالة إضافة الصيادلة
const importPharmacists = async () => {
  try {
    // التحقق من وجود الملف
    if (!fs.existsSync(pharmacistsFilePath)) {
      console.error(`❌ الملف غير موجود: ${pharmacistsFilePath}`);
      process.exit(1);
    }

    // قراءة ملف JSON
    const pharmacistsData = JSON.parse(fs.readFileSync(pharmacistsFilePath, 'utf8'));
    
    console.log(`📋 تم قراءة ${pharmacistsData.length} صيدلاني من الملف`);
    
    // التحقق من وجود صيادلة في قاعدة البيانات
    const existingPharmacists = await Pharmacist.find();
    console.log(`📊 عدد الصيادلة الموجودين حالياً: ${existingPharmacists.length}`);
    
    let added = 0;
    let skipped = 0;
    let errors = 0;
    
    // إضافة كل صيدلاني
    for (const pharmacistData of pharmacistsData) {
      try {
        // تنظيف الاسم (إزالة "الصيدلاني" أو "الصيدلانية" من البداية)
        let cleanName = pharmacistData.name.trim();
        cleanName = cleanName.replace(/^الصيدلاني\s+/i, '').replace(/^الصيدلانية\s+/i, '').trim();
        
        // التحقق من وجود صيدلاني بنفس الاسم أو رقم الهاتف
        const existing = await Pharmacist.findOne({
          $or: [
            { name: cleanName },
            { phone: pharmacistData.phone }
          ]
        });
        
        if (existing) {
          console.log(`⏭️  تم تخطي: ${cleanName} (موجود بالفعل)`);
          skipped++;
          continue;
        }
        
        // التحقق من صحة البيانات المطلوبة
        if (!pharmacistData.phone || !pharmacistData.gender) {
          console.log(`⚠️  تحذير: بيانات ناقصة لـ ${cleanName} - تم التخطي`);
          skipped++;
          continue;
        }
        
        // إنشاء صيدلاني جديد
        await Pharmacist.create({
          name: cleanName,
          phone: pharmacistData.phone.trim(),
          gender: pharmacistData.gender.trim(),
          address: pharmacistData.address ? pharmacistData.address.trim() : 'غير متوفر حالياً'
        });
        
        console.log(`✅ تمت إضافة: ${cleanName} - ${pharmacistData.phone}`);
        added++;
      } catch (error) {
        console.error(`❌ خطأ في إضافة: ${pharmacistData.name} - ${error.message}`);
        errors++;
      }
    }
    
    console.log('\n📊 ملخص العملية:');
    console.log(`   ✅ تمت إضافة: ${added} صيدلاني`);
    console.log(`   ⏭️  تم تخطي: ${skipped} صيدلاني (موجود بالفعل أو بيانات ناقصة)`);
    console.log(`   ❌ أخطاء: ${errors} صيدلاني`);
    console.log(`   📋 إجمالي: ${pharmacistsData.length} صيدلاني`);
    
    // حذف الملف بعد إضافة البيانات بنجاح
    if (added > 0 || skipped > 0) {
      try {
        fs.unlinkSync(pharmacistsFilePath);
        console.log(`\n🗑️  تم حذف الملف: ${pharmacistsFilePath}`);
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
  await importPharmacists();
};

run();

