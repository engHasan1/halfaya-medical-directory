# دليل الإعداد السريع

## الخطوة 1: تثبيت المكتبات

```bash
cd backend
npm install
```

## الخطوة 2: إنشاء ملف .env

قم بإنشاء ملف `.env` في مجلد `backend` وأضف:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/halfaya_medical_directory
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d
```

**أو انسخ ملف `.env.example` إلى `.env` وقم بتعديله:**

```bash
copy .env.example .env
```

**ملاحظة**: تأكد من تغيير `JWT_SECRET` إلى قيمة سرية قوية في بيئة الإنتاج!

## الخطوة 3: التأكد من تشغيل MongoDB

تأكد من أن MongoDB يعمل على جهازك، أو قم بتغيير `MONGODB_URI` في ملف `.env` ليشير إلى MongoDB Atlas أو أي خادم MongoDB آخر.

### لتثبيت MongoDB محلياً:
- Windows: [تحميل MongoDB](https://www.mongodb.com/try/download/community)
- أو استخدم MongoDB Atlas (مجاني): [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### ⚠️ حل مشكلة IP Whitelist في MongoDB Atlas:

إذا ظهرت رسالة خطأ تتعلق بـ "IP whitelist" عند استخدام MongoDB Atlas:

1. افتح [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. اختر مشروعك (Project)
3. اضغط على **"Network Access"** من القائمة الجانبية
4. اضغط على **"Add IP Address"**
5. اختر أحد الخيارات:
   - **"Add Current IP Address"** لإضافة IP الحالي (موصى به)
   - **"Allow Access from Anywhere"** (0.0.0.0/0) للسماح بجميع IPs (للتطوير فقط - غير آمن للإنتاج)
6. انتظر دقيقة ثم أعد تشغيل الخادم

## الخطوة 4: إنشاء حساب المدير

```bash
node scripts/createAdmin.js
```

سيكون حساب المدير:
- **اسم المستخدم**: admin
- **كلمة المرور**: 12345
- **البريد الإلكتروني**: admin@halfaya.com

## الخطوة 5: تشغيل الخادم

**وضع التطوير**:
```bash
npm run dev
```

**وضع الإنتاج**:
```bash
npm start
```

## الخطوة 6: اختبار API

### تسجيل الدخول:
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "12345"
}
```

سيعود لك `token` استخدمه في جميع الطلبات المحمية.

### مثال على إضافة طبيب:
```bash
POST http://localhost:5000/api/doctors
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "الطبيب أحمد محمد",
  "phone": "0931234567",
  "speciality": "أطفال",
  "gender": "ذكر",
  "address": "الشارع الرئيسي"
}
```

## 🔗 الروابط المفيدة

- الخادم: http://localhost:5000
- API الرئيسي: http://localhost:5000/api
- الأطباء: http://localhost:5000/api/doctors
- الصيدليات: http://localhost:5000/api/pharmacies
- الصيادلة: http://localhost:5000/api/pharmacists

## 📝 ملاحظات مهمة

1. جميع عمليات CRUD (إضافة، تعديل، حذف) محمية بـ JWT Authentication
2. عمليات القراءة (GET) متاحة للجميع
3. يجب إرسال Token في Header: `Authorization: Bearer <token>`
4. Token صالح لمدة 7 أيام (يمكن تغييرها في `.env`)

