const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/halfaya_medical_directory';
    
    // إعدادات الاتصال المحسّنة
    const options = {
      serverSelectionTimeoutMS: 5000, // انتظار 5 ثواني قبل الفشل
      socketTimeoutMS: 45000, // إغلاق الاتصال بعد 45 ثانية من عدم النشاط
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB متصل: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`\n❌ خطأ في الاتصال بقاعدة البيانات: ${error.message}\n`);
    
    // إرشادات محددة لمشكلة IP Whitelist
    if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.error('📋 حل مشكلة IP Whitelist في MongoDB Atlas:\n');
      console.error('1. افتح MongoDB Atlas Dashboard: https://cloud.mongodb.com/');
      console.error('2. اختر مشروعك (Project)');
      console.error('3. اضغط على "Network Access" من القائمة الجانبية');
      console.error('4. اضغط على "Add IP Address"');
      console.error('5. اختر أحد الخيارات:');
      console.error('   - "Add Current IP Address" لإضافة IP الحالي');
      console.error('   - "Allow Access from Anywhere" (0.0.0.0/0) للسماح بجميع IPs (للتطوير فقط)\n');
      console.error('6. انتظر دقيقة ثم أعد تشغيل الخادم\n');
    }
    
    // إرشادات لمشاكل أخرى
    if (error.message.includes('authentication failed')) {
      console.error('🔐 تحقق من صحة اسم المستخدم وكلمة المرور في MONGODB_URI\n');
    }
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('🌐 تحقق من صحة رابط الاتصال (MONGODB_URI) في ملف .env\n');
    }
    
    console.error('💡 نصيحة: تأكد من وجود ملف .env في مجلد backend مع MONGODB_URI صحيح\n');
    
    process.exit(1);
  }
};

module.exports = connectDB;

