# 📋 نظرة شاملة على المشروع - دليل حلفايا الطبي

## 🎯 وصف المشروع

هذا مشروع **نظام إدارة دليل طبي** لمدينة حلفايا يتكون من:
- **Backend API** مبني بـ Node.js و Express.js
- **Frontend** مبني بـ HTML/CSS/JavaScript (Vanilla JS)

المشروع يسمح بإدارة وعرض:
- 👨‍⚕️ **الأطباء** (Doctors) - مع معلوماتهم وتخصصاتهم
- 💊 **الصيدليات** (Pharmacies) - مع نظام المناوبة
- 👨‍🔬 **الصيادلة** (Pharmacists) - مع معلوماتهم
- 👤 **المديرين** (Admins) - لإدارة النظام

---

## 🏗️ هيكل المشروع

```
hasan/
├── backend/                    # Backend API
│   ├── config/
│   │   └── database.js        # إعدادات قاعدة البيانات
│   ├── middleware/
│   │   └── auth.js            # Middleware للمصادقة (JWT)
│   ├── models/                # نماذج MongoDB
│   │   ├── Admin.js
│   │   ├── Doctor.js
│   │   ├── Pharmacy.js
│   │   └── Pharmacist.js
│   ├── routes/                # Routes للـ API
│   │   ├── auth.js
│   │   ├── doctors.js
│   │   ├── pharmacies.js
│   │   └── pharmacists.js
│   ├── scripts/
│   │   └── createAdmin.js     # سكربت إنشاء حساب مدير
│   ├── utils/
│   │   └── jwtToken.js        # دوال JWT
│   ├── server.js              # نقطة بداية الخادم
│   ├── package.json
│   └── .env                   # متغيرات البيئة (يجب إنشاؤه)
│
└── frontend/                  # Frontend
    ├── assets/
    │   ├── css/
    │   │   └── style.css
    │   └── js/
    │       ├── config.js      # إعدادات API
    │       ├── api.js         # دوال API
    │       └── main.js        # الدوال الرئيسية
    ├── index.html             # الصفحة الرئيسية
    ├── doctors.html           # صفحة الأطباء والصيادلة
    ├── categories.html        # صفحة التصنيفات
    ├── on-duty.html           # صفحة صيدليات المناوبة
    ├── add.html               # صفحة إضافة طبيب/صيدلي
    ├── admin-login.html       # صفحة تسجيل دخول المدير
    └── admin.html             # لوحة تحكم المدير
```

---

## 🔧 التقنيات المستخدمة

### Backend:
- **Node.js** - بيئة التشغيل
- **Express.js** - إطار العمل
- **MongoDB** - قاعدة البيانات
- **Mongoose** - ODM لـ MongoDB
- **JWT (jsonwebtoken)** - المصادقة
- **bcryptjs** - تشفير كلمات المرور
- **dotenv** - إدارة متغيرات البيئة
- **cors** - السماح بالطلبات من Frontend

### Frontend:
- **HTML5** - البنية
- **CSS3** - التصميم
- **JavaScript (Vanilla)** - الوظائف (بدون إطارات عمل)
- **Fetch API** - التواصل مع Backend
- **LocalStorage** - حفظ Token

---

## 📊 النماذج (Models)

### 1. Admin (المدير)
```javascript
{
  username: String (required, unique),
  password: String (required, min: 6, hashed),
  email: String (required, unique),
  timestamps: true
}
```

### 2. Doctor (الطبيب)
```javascript
{
  name: String (required),
  phone: String (required),
  speciality: String (required),
  gender: String (enum: ['ذكر', 'أنثى']),
  address: String (required),
  timestamps: true
}
```

### 3. Pharmacy (الصيدلية)
```javascript
{
  name: String (required),
  phone: String (required),
  address: String (required),
  isOnDuty: Boolean (default: false),
  timestamps: true
}
```

### 4. Pharmacist (الصيدلاني)
```javascript
{
  name: String (required),
  phone: String (required),
  gender: String (enum: ['ذكر', 'أنثى']),
  address: String (required),
  email: String (required, unique),
  password: String (required, min: 6, hashed),
  timestamps: true
}
```

---

## 🔐 نظام المصادقة

- يستخدم **JWT (JSON Web Tokens)** للمصادقة
- Token صالح لمدة **7 أيام** (قابل للتعديل)
- جميع عمليات **CRUD** (Create, Read, Update, Delete) محمية
- عمليات **القراءة فقط** (GET) متاحة للجميع
- Token يُرسل في Header: `Authorization: Bearer <token>`

---

## 🌐 API Endpoints

### المصادقة (Auth)
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - التحقق من حالة تسجيل الدخول (محمي)

### الأطباء (Doctors)
- `GET /api/doctors` - الحصول على جميع الأطباء
- `GET /api/doctors/:id` - الحصول على طبيب واحد
- `POST /api/doctors` - إنشاء طبيب جديد (محمي)
- `PUT /api/doctors/:id` - تحديث طبيب (محمي)
- `DELETE /api/doctors/:id` - حذف طبيب (محمي)

### الصيدليات (Pharmacies)
- `GET /api/pharmacies` - الحصول على جميع الصيدليات
- `GET /api/pharmacies/on-duty` - الحصول على الصيدليات المناوبة
- `GET /api/pharmacies/:id` - الحصول على صيدلية واحدة
- `POST /api/pharmacies` - إنشاء صيدلية جديدة (محمي)
- `PUT /api/pharmacies/:id` - تحديث صيدلية (محمي)
- `DELETE /api/pharmacies/:id` - حذف صيدلية (محمي)

### الصيادلة (Pharmacists)
- `GET /api/pharmacists` - الحصول على جميع الصيادلة
- `GET /api/pharmacists/:id` - الحصول على صيدلاني واحد
- `POST /api/pharmacists` - إنشاء صيدلاني جديد (محمي)
- `PUT /api/pharmacists/:id` - تحديث صيدلاني (محمي)
- `DELETE /api/pharmacists/:id` - حذف صيدلاني (محمي)

---

## 🎨 صفحات Frontend

1. **index.html** - الصفحة الرئيسية مع البحث وعرض صيدلية المناوبة
2. **doctors.html** - عرض جميع الأطباء والصيادلة مع البحث والفلترة
3. **categories.html** - تصفح حسب التخصص
4. **on-duty.html** - عرض الصيدليات المناوبة
5. **add.html** - تقديم طلب إضافة طبيب/صيدلي
6. **admin-login.html** - تسجيل دخول المدير
7. **admin.html** - لوحة تحكم المدير (إدارة كاملة)

---

## 📝 ملاحظات مهمة

1. **قاعدة البيانات**: المشروع يستخدم MongoDB (محلي أو MongoDB Atlas)
2. **المنفذ الافتراضي**: Backend يعمل على المنفذ `5000`
3. **حساب المدير الافتراضي**: 
   - Username: `admin`
   - Password: `12345` (يجب تغييره بعد أول تسجيل دخول)
4. **CORS**: مفعّل للسماح بالطلبات من Frontend
5. **البيئة**: يستخدم `.env` لإدارة المتغيرات الحساسة

---

## 🚀 خطوات التشغيل

راجع ملف `SETUP_GUIDE.md` للتعليمات التفصيلية.

---

## 📄 الرخصة

ISC

