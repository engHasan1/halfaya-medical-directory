const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// تحميل متغيرات البيئة
dotenv.config();

// استيراد نموذج الطبيب
const Doctor = require('../models/Doctor');

// مسار ملف JSON
const doctorsFilePath = path.join(__dirname, '../../assets/data/doctors.json');

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

// دالة تطبيع التخصص (للمطابقة مع التخصصات الموجودة)
function normalizeSpecialty(specialty) {
  if (!specialty) return '';
  return specialty
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .replace(/[ًٌٍَُِّْ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// دالة مطابقة التخصص مع القائمة
function matchSpecialty(inputSpecialty) {
  if (!inputSpecialty || !inputSpecialty.trim()) {
    return inputSpecialty.trim();
  }
  
  const specialtyList = [
    'أطفال',
    'نسائية',
    'عظمية',
    'قلبية',
    'داخلية',
    'عصبية',
    'عينية',
    'أنف أذن حنجرة',
    'طب طوارئ',
    'أشعة',
    'أسنان'
  ];
  
  const normalizedInput = normalizeSpecialty(inputSpecialty);
  
  // Check for exact match first
  for (const specialty of specialtyList) {
    const normalizedSpecialty = normalizeSpecialty(specialty);
    if (normalizedSpecialty === normalizedInput) {
      return specialty;
    }
  }
  
  // Check for partial match
  for (const specialty of specialtyList) {
    const normalizedSpecialty = normalizeSpecialty(specialty);
    if (normalizedInput.includes(normalizedSpecialty) || normalizedSpecialty.includes(normalizedInput)) {
      if (normalizedInput.length >= 3 || normalizedSpecialty.length >= 3) {
        const lengthDiff = Math.abs(normalizedInput.length - normalizedSpecialty.length);
        if (lengthDiff <= 2) {
          return specialty;
        }
      }
    }
  }
  
  // Special handling for "أنف أذن حنجرة" variations
  const anfVariations = ['انف اذن حنجرة', 'انف اذن حنجره', 'أذن أنف حنجرة', 'أذن، أنف، حنجرة'];
  const normalizedAnfInput = normalizeSpecialty(inputSpecialty);
  for (const variation of anfVariations) {
    if (normalizeSpecialty(variation) === normalizedAnfInput) {
      return 'أنف أذن حنجرة';
    }
  }
  
  // If no match found, return the original input (trimmed)
  return inputSpecialty.trim();
}

// دالة إضافة الأطباء
const importDoctors = async () => {
  try {
    // قراءة ملف JSON
    const doctorsData = JSON.parse(fs.readFileSync(doctorsFilePath, 'utf8'));
    
    console.log(`📋 تم قراءة ${doctorsData.length} طبيب من الملف`);
    
    // التحقق من وجود أطباء في قاعدة البيانات
    const existingDoctors = await Doctor.find();
    console.log(`📊 عدد الأطباء الموجودين حالياً: ${existingDoctors.length}`);
    
    let added = 0;
    let skipped = 0;
    let errors = 0;
    
    // إضافة كل طبيب
    for (const doctorData of doctorsData) {
      try {
        // تنظيف الاسم (إزالة "الطبيب" أو "الطبيبة" من البداية)
        let cleanName = doctorData.name.trim();
        cleanName = cleanName.replace(/^الطبيب\s+/i, '').replace(/^الطبيبة\s+/i, '').trim();
        
        // التحقق من وجود طبيب بنفس الاسم أو رقم الهاتف
        const existing = await Doctor.findOne({
          $or: [
            { name: cleanName },
            { phone: doctorData.phone }
          ]
        });
        
        if (existing) {
          console.log(`⏭️  تم تخطي: ${cleanName} (موجود بالفعل)`);
          skipped++;
          continue;
        }
        
        // تطبيع التخصص
        const normalizedSpecialty = matchSpecialty(doctorData.speciality);
        
        // إنشاء طبيب جديد
        await Doctor.create({
          name: cleanName,
          phone: doctorData.phone,
          speciality: normalizedSpecialty,
          gender: doctorData.gender || 'ذكر',
          address: doctorData.address || 'غير متوفر حالياً'
        });
        
        console.log(`✅ تمت إضافة: ${cleanName} - ${normalizedSpecialty}`);
        added++;
      } catch (error) {
        console.error(`❌ خطأ في إضافة: ${doctorData.name} - ${error.message}`);
        errors++;
      }
    }
    
    console.log('\n📊 ملخص العملية:');
    console.log(`   ✅ تمت إضافة: ${added} طبيب`);
    console.log(`   ⏭️  تم تخطي: ${skipped} طبيب (موجود بالفعل)`);
    console.log(`   ❌ أخطاء: ${errors} طبيب`);
    console.log(`   📋 إجمالي: ${doctorsData.length} طبيب`);
    
    // حذف الملف بعد إضافة البيانات بنجاح
    if (added > 0 || skipped > 0) {
      try {
        fs.unlinkSync(doctorsFilePath);
        console.log(`\n🗑️  تم حذف الملف: ${doctorsFilePath}`);
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
  await importDoctors();
};

run();

