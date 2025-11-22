# Frontend - دليل حلفايا الطبي

## 📋 المتطلبات

- متصفح ويب حديث (Chrome, Firefox, Safari, Edge)
- Backend API يعمل على `http://localhost:5000`

## 🚀 التشغيل

### 1. التأكد من تشغيل Backend

تأكد من أن Backend يعمل على المنفذ 5000:
```bash
cd backend
npm start
```

### 2. فتح Frontend

افتح ملف `index.html` في المتصفح مباشرة، أو استخدم خادم محلي:

**باستخدام Python:**
```bash
python -m http.server 8000
```

**باستخدام Node.js (http-server):**
```bash
npx http-server -p 8000
```

ثم افتح المتصفح على: `http://localhost:8000`

### 3. تكوين رابط API

إذا كان Backend يعمل على منفذ أو عنوان مختلف، قم بتعديل `API_CONFIG.BASE_URL` في ملف `assets/js/config.js`:

```javascript
const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api', // قم بتغيير هذا إذا لزم الأمر
  // ...
};
```

## 📁 هيكل الملفات

```
frontend/
├── assets/
│   ├── css/
│   │   └── style.css          # ملفات CSS
│   └── js/
│       ├── config.js          # إعدادات API
│       ├── api.js             # دوال API
│       └── main.js            # الدوال الرئيسية
├── index.html                 # الصفحة الرئيسية
├── doctors.html               # صفحة الأطباء والصيادلة
├── categories.html            # صفحة التصنيفات
├── on-duty.html               # صفحة صيدليات المناوبة
├── add.html                   # صفحة إضافة طبيب/صيدلي
├── admin-login.html           # صفحة تسجيل دخول المدير
└── admin.html                 # لوحة تحكم المدير
```

## 🔐 تسجيل الدخول

### حساب المدير الافتراضي:
- **اسم المستخدم**: `admin`
- **كلمة المرور**: `12345`

## 🔑 نظام المصادقة

- يستخدم Frontend **JWT Authentication** للتواصل مع Backend
- Token يتم حفظه في `localStorage` تلقائياً
- جميع طلبات API المحمية تتطلب Token في Header

## 📝 الميزات

### الصفحات العامة:
- **الصفحة الرئيسية**: عرض صيدلية المناوبة الحالية
- **جميع الأطباء والصيادلة**: البحث والفلترة
- **التصنيفات**: تصفح حسب التخصص
- **صيدليات المناوبة**: عرض الصيدليات المناوبة
- **إضافة طبيب/صيدلي**: تقديم طلب إضافة

### لوحة التحكم (Admin Panel):
- إدارة الأطباء (إضافة، تعديل، حذف)
- إدارة الصيدليات (إضافة، تعديل، حذف)
- إدارة الصيادلة (إضافة، تعديل، حذف)
- إدارة طلبات الإضافة المعلقة
- تحديث صيدلية المناوبة

## 🔧 API Endpoints المستخدمة

جميع الطلبات ترسل إلى `/api/`:
- `/api/auth/login` - تسجيل الدخول
- `/api/auth/me` - التحقق من المصادقة
- `/api/doctors` - إدارة الأطباء
- `/api/pharmacies` - إدارة الصيدليات
- `/api/pharmacists` - إدارة الصيادلة

## 📱 التوافق

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Chrome Mobile)
- ✅ Tablet
- ✅ Responsive Design

## 🛠️ التقنيات المستخدمة

- HTML5
- CSS3
- JavaScript (Vanilla JS - بدون إطارات عمل)
- Fetch API للتواصل مع Backend
- JWT Authentication

## 📄 الرخصة

ISC

