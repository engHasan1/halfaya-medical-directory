# Backend API - نظام إدارة الأطباء والصيدليات

## 📋 المتطلبات

- Node.js (الإصدار 14 أو أحدث)
- MongoDB (محلي أو MongoDB Atlas)
- npm أو yarn

## 🚀 التثبيت والتشغيل

### 1. تثبيت المكتبات المطلوبة

```bash
npm install
```

### 2. إعداد متغيرات البيئة

قم بإنشاء ملف `.env` في مجلد `backend` وأضف المتغيرات التالية:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/halfaya_medical_directory
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

### 3. إنشاء حساب المدير الافتراضي

```bash
node scripts/createAdmin.js
```

سيكون:
- **اسم المستخدم**: admin
- **كلمة المرور**: 12345

### 4. تشغيل الخادم

**وضع التطوير** (مع nodemon):
```bash
npm run dev
```

**وضع الإنتاج**:
```bash
npm start
```

الخادم سيعمل على المنفذ 5000 (أو المنفذ المحدد في ملف `.env`)

## 📚 API Endpoints

### 🔐 المصادقة (Auth)

#### تسجيل الدخول
```
POST /api/auth/login
Body: {
  "username": "admin",
  "password": "12345"
}
```

#### التحقق من حالة تسجيل الدخول
```
GET /api/auth/me
Headers: {
  "Authorization": "Bearer <token>"
}
```

### 🧑‍⚕️ الأطباء (Doctors)

#### الحصول على جميع الأطباء
```
GET /api/doctors
```

#### الحصول على طبيب واحد
```
GET /api/doctors/:id
```

#### إنشاء طبيب جديد (محمي)
```
POST /api/doctors
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "name": "الاسم الكامل",
  "phone": "رقم الهاتف",
  "speciality": "التخصص",
  "gender": "ذكر" | "أنثى",
  "address": "العنوان"
}
```

#### تحديث طبيب (محمي)
```
PUT /api/doctors/:id
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "name": "الاسم الكامل",
  "phone": "رقم الهاتف",
  ...
}
```

#### حذف طبيب (محمي)
```
DELETE /api/doctors/:id
Headers: {
  "Authorization": "Bearer <token>"
}
```

### 💊 الصيدليات (Pharmacies)

#### الحصول على جميع الصيدليات
```
GET /api/pharmacies
```

#### الحصول على الصيدليات المناوبة
```
GET /api/pharmacies/on-duty
```

#### الحصول على صيدلية واحدة
```
GET /api/pharmacies/:id
```

#### إنشاء صيدلية جديدة (محمي)
```
POST /api/pharmacies
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "name": "اسم الصيدلية",
  "phone": "رقم الهاتف",
  "address": "العنوان",
  "isOnDuty": false
}
```

#### تحديث صيدلية (محمي)
```
PUT /api/pharmacies/:id
Headers: {
  "Authorization": "Bearer <token>"
}
```

#### حذف صيدلية (محمي)
```
DELETE /api/pharmacies/:id
Headers: {
  "Authorization": "Bearer <token>"
}
```

### 👨‍🔬 الصيادلة (Pharmacists)

#### الحصول على جميع الصيادلة
```
GET /api/pharmacists
```

#### الحصول على صيدلاني واحد
```
GET /api/pharmacists/:id
```

#### إنشاء صيدلاني جديد (محمي)
```
POST /api/pharmacists
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "name": "الاسم الكامل",
  "phone": "رقم الهاتف",
  "gender": "ذكر" | "أنثى",
  "address": "العنوان",
  "email": "البريد الإلكتروني",
  "password": "كلمة المرور"
}
```

#### تحديث صيدلاني (محمي)
```
PUT /api/pharmacists/:id
Headers: {
  "Authorization": "Bearer <token>"
}
```

#### حذف صيدلاني (محمي)
```
DELETE /api/pharmacists/:id
Headers: {
  "Authorization": "Bearer <token>"
}
```

## 🔒 حماية الروتات

جميع عمليات CRUD (Create, Read, Update, Delete) محمية بـ JWT Authentication. يجب إرسال Token في Header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 النماذج (Models)

### Doctor
- name (String, required)
- phone (String, required)
- speciality (String, required)
- gender (String, enum: ['ذكر', 'أنثى'], required)
- address (String, required)

### Pharmacy
- name (String, required)
- phone (String, required)
- address (String, required)
- isOnDuty (Boolean, default: false)

### Pharmacist
- name (String, required)
- phone (String, required)
- gender (String, enum: ['ذكر', 'أنثى'], required)
- address (String, required)
- email (String, required, unique)
- password (String, required, minlength: 6)

### Admin
- username (String, required, unique)
- password (String, required, minlength: 6)
- email (String, required, unique)

## 🛠️ التقنيات المستخدمة

- **Node.js** - بيئة التشغيل
- **Express.js** - إطار العمل
- **MongoDB** - قاعدة البيانات
- **Mongoose** - ODM لـ MongoDB
- **JWT** - المصادقة
- **bcryptjs** - تشفير كلمات المرور

## 📄 الرخصة

ISC

