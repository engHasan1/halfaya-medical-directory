# 📁 بنية المشروع النهائية

## البنية العامة

```
hasan/
├── 📄 index.html                    # الصفحة الرئيسية
├── 📄 doctors.html                   # صفحة جميع الأطباء والصيادلة
├── 📄 categories.html                # صفحة التصنيفات
├── 📄 on-duty.html                  # صفحة صيدليات المناوبة
├── 📄 add.html                      # صفحة إضافة طبيب/صيدلي
├── 📄 admin.html                    # لوحة تحكم المدير
├── 📄 admin-login.html              # صفحة تسجيل دخول المدير
│
├── 📁 assets/                       # الأصول (CSS, JS)
│   ├── 📁 css/
│   │   └── style.css                # ملف CSS الرئيسي
│   └── 📁 js/
│       ├── config.js                # إعدادات API
│       ├── api.js                   # دوال API
│       ├── main.js                  # الدوال الرئيسية
│       └── footer.js                # تحميل الفوتر
│
├── 📁 backend/                      # Backend API
│   ├── 📁 config/
│   │   └── database.js              # إعدادات قاعدة البيانات
│   ├── 📁 middleware/
│   │   └── auth.js                 # Middleware للمصادقة
│   ├── 📁 models/                   # نماذج MongoDB
│   │   ├── Admin.js
│   │   ├── Doctor.js
│   │   ├── Pharmacist.js
│   │   └── Pharmacy.js
│   ├── 📁 routes/                   # Routes للـ API
│   │   ├── auth.js
│   │   ├── doctors.js
│   │   ├── pharmacies.js
│   │   └── pharmacists.js
│   ├── 📁 scripts/                  # سكريبتات مساعدة
│   │   ├── createAdmin.js
│   │   └── fixPharmacistSchema.js
│   ├── 📁 utils/
│   │   └── jwtToken.js             # دوال JWT
│   ├── 📄 server.js                # نقطة بداية الخادم
│   ├── 📄 package.json
│   ├── 📄 .env                     # متغيرات البيئة (يجب إنشاؤه)
│   └── 📄 README.md
│
├── 📄 PROJECT_OVERVIEW.md           # نظرة شاملة على المشروع
├── 📄 FRONTEND_README.md            # دليل Frontend
└── 📄 PROJECT_STRUCTURE.md          # هذا الملف
```

## 📋 ملاحظات مهمة

### الوصول إلى الملفات:

- **الصفحة الرئيسية**: `domain.com/index.html` أو `domain.com/`
- **جميع الصفحات**: متاحة مباشرة من الجذر
- **Backend API**: يعمل على `domain.com:5000/api` (أو المنفذ المحدد)

### المسارات:

- جميع مسارات CSS و JS في ملفات HTML هي نسبية: `assets/css/style.css`
- مسارات الروابط بين الصفحات هي نسبية: `doctors.html`, `index.html`
- مسارات Backend تبقى كما هي داخل مجلد `backend/`

### ملفات مهمة:

- **`.env`** في `backend/`: يحتوي على متغيرات البيئة (يجب إنشاؤه)
- **`footer.js`**: يحمّل الفوتر تلقائياً في جميع الصفحات
- **`config.js`**: يحتوي على إعدادات API (BASE_URL)

## 🚀 رفع المشروع على السيرفر

### للواجهة الأمامية (Frontend):
- ارفع جميع الملفات من الجذر (HTML, assets) إلى المجلد الجذري للسيرفر
- لا ترفع مجلد `backend` مع ملفات Frontend

### للباك إند (Backend):
- ارفع مجلد `backend` كاملاً إلى السيرفر
- تأكد من تثبيت Node.js و MongoDB على السيرفر
- قم بإنشاء ملف `.env` في مجلد `backend`

## ✅ التحقق من البنية

بعد رفع المشروع، تأكد من:
1. ✅ جميع ملفات HTML في الجذر
2. ✅ مجلد `assets` في الجذر
3. ✅ مجلد `backend` منفصل
4. ✅ جميع المسارات تعمل بشكل صحيح

