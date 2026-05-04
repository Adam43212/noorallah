# 🏠 نور الله — دليل التشغيل الكامل

## هيكل المشروع
```
noorallah/
├── backend/
│   ├── server.js          ← نقطة الدخول الرئيسية
│   ├── .env               ← الإعدادات السرية
│   ├── package.json
│   ├── models/
│   │   ├── User.js        ← نموذج المستخدمين
│   │   ├── Apartment.js   ← نموذج الشقق
│   │   ├── Land.js        ← نموذج الأراضي
│   │   ├── Booking.js     ← نموذج الحجوزات
│   │   └── Inquiry.js     ← نموذج استفسارات الأراضي
│   ├── routes/
│   │   ├── auth.js        ← تسجيل الدخول/إنشاء حساب
│   │   ├── apartments.js  ← CRUD الشقق
│   │   ├── lands.js       ← CRUD الأراضي
│   │   ├── bookings.js    ← الحجوزات
│   │   ├── contracts.js   ← العقود
│   │   └── admin.js       ← لوحة الأدمن
│   ├── middleware/
│   │   ├── auth.js        ← JWT حماية المسارات
│   │   └── upload.js      ← رفع الصور
│   └── uploads/           ← الصور المرفوعة
└── frontend/
    ├── index.html
    ├── styles.css
    ├── app.js             ← (استخدم frontend_app.js)
    └── data.js            ← بيانات احتياطية
```

---

## ⚡ تشغيل محلي (خطوة بخطوة)

### 1. تثبيت MongoDB
- حمّل من: https://www.mongodb.com/try/download/community
- شغّله: `mongod --dbpath /data/db`

### 2. إعداد الباك-اند
```bash
cd backend
npm install
# عدّل .env حسب إعداداتك
node server.js
# أو للتطوير:
npx nodemon server.js
```

### 3. إعداد الفرونت-اند
```bash
# انسخ frontend_app.js إلى frontend/app.js
cp frontend_app.js ../frontend/app.js
# في app.js: غيّر
const API = '/api';
# إلى:
const API = 'http://localhost:5000/api';
```

### 4. seed البيانات (شقق + أراضي أولية)
```bash
# أول حاجة: سجّل أدمن
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"أدمن","phone":"01503244665","password":"admin123"}'

# خذ التوكن من الرد وعدّل role في MongoDB يدوياً إلى "admin"
# ثم seed:
curl -X POST http://localhost:5000/api/admin/seed \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🌐 نشر على السيرفر (Render / Railway / VPS)

### على Render (مجاني)
1. ارفع الكود على GitHub
2. اعمل Web Service جديد
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. أضف Environment Variables من `.env`
6. في `app.js` الفرونت-اند: غيّر `API` لرابط Render

### على VPS (Ubuntu)
```bash
# تثبيت
apt install nodejs npm mongodb-org

# تشغيل مستمر
npm install -g pm2
pm2 start server.js --name noorallah
pm2 save && pm2 startup

# Nginx كـ Reverse Proxy
# /etc/nginx/sites-available/noorallah
server {
    listen 80;
    server_name yourdomain.com;
    location / { proxy_pass http://localhost:5000; }
}
```

---

## 📡 جميع API Endpoints

| الوظيفة | Method | Endpoint | Auth |
|---------|--------|----------|------|
| تسجيل مستخدم | POST | `/api/auth/register` | ❌ |
| تسجيل دخول | POST | `/api/auth/login` | ❌ |
| بياناتي | GET | `/api/auth/me` | ✅ |
| كل الشقق | GET | `/api/apartments` | ❌ |
| تفاصيل شقة | GET | `/api/apartments/:id` | ❌ |
| إضافة شقة | POST | `/api/apartments` | 🔐 أدمن |
| تعديل شقة | PUT | `/api/apartments/:id` | 🔐 أدمن |
| حذف شقة | DELETE | `/api/apartments/:id` | 🔐 أدمن |
| كل الأراضي | GET | `/api/lands` | ❌ |
| إضافة أرض | POST | `/api/lands` | 🔐 أدمن |
| استفسار أرض | POST | `/api/lands/:id/inquiry` | ❌ |
| إنشاء حجز | POST | `/api/bookings` | ❌ |
| حجوزاتي | GET | `/api/bookings/my` | ✅ |
| تفاصيل حجز | GET | `/api/bookings/:id` | ✅ |
| تأكيد حجز | PATCH | `/api/bookings/:id/confirm` | 🔐 أدمن |
| إلغاء حجز | PATCH | `/api/bookings/:id/cancel` | ✅ |
| بيانات عقد | GET | `/api/contracts/:bookingId` | ✅ |
| إحصائيات | GET | `/api/admin/stats` | 🔐 أدمن |
| المستخدمين | GET | `/api/admin/users` | 🔐 أدمن |
| seed البيانات | POST | `/api/admin/seed` | 🔐 أدمن |

---

## 🔧 تغيير الإعدادات

### نسبة العمولة
في `.env`:
```
COMMISSION_RATE=0.05
```

### رقم الواتساب
في `.env`:
```
WHATSAPP_NUMBER=201503244665
```

### إنشاء أول أدمن
```javascript
// في MongoDB Compass أو mongosh:
db.users.updateOne(
  { phone: "01503244665" },
  { $set: { role: "admin" } }
)
```
