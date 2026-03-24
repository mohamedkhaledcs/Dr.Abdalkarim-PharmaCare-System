# 🔧 دليل تشغيل واختبار النظام

## 📋 المتطلبات

1. **Supabase Project**
   - اذهب إلى: https://supabase.com/dashboard
   - تأكد من وجود مشروع نشط

2. **متغيرات البيئة (.env.local)**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

## ⚡ خطوات التشغيل

### 1. إعداد قاعدة البيانات

```bash
# 1. في لوحة Supabase، اذهب إلى SQL Editor
# 2. النسخ والالصق محتوى schema.sql
# 3. ثم النسخ والالصق محتوى data.sql (بعد schema)
# 4. شغّل كل script
```

### 2. تشغيل المشروع

```bash
npm run dev
```

الخادم سيبدأ على http://localhost:3000

### 3. فحص الاتصال

افتح هذا الرابط في المتصفح:

```
http://localhost:3000/api/health
```

**النتيجة المتوقعة:**
```json
{
  "status": "ok",
  "database": "connected",
  "totalProducts": 45,
  "sampleProducts": [...],
  "message": "Database connected successfully. Total products: 45"
}
```

### 4. اختبار المنتجات

افتح هذا الرابط:

```
http://localhost:3000/api/products
```

يجب أن ترى مصفوفة من المنتجات.

## 🐛 استكشاف الأخطاء

### لا توجد منتجات

1. **تحقق من الاتصال:**
   ```
   http://localhost:3000/api/health
   ```

2. **تحقق من RLS (Row Level Security)**
   - في Supabase: Authentication → Policies
   - تأكد أن `public` يمكنه قراءة جدول `products`

3. **أعد تشغيل قاعدة البيانات:**
   - احذف جميع الصفوف من `products`
   - أعد تشغيل `schema.sql` ثم `data.sql`

### خطأ في تحميل الصورة

- اللوجو موجود في `/public/pharmacy-logo.svg`
- يتم تحميله تلقائياً عند `npm run dev`

### استغرق الوقت الطويل في التحميل

- جرّب Ctrl+Shift+Delete (مسح ذاكرة التخزين المؤقت)
- أعد تحديث الصفحة

## ✅ ميزات جديدة

- ✨ Skeleton placeholders أثناء التحميل
- 🎨 لوجو صيدلية SVG احترافي
- 🔘 أزرار مع hover effects وظلال ناعمة
- 🔍 فئات عربية 100%
- 🛠️ Health check endpoint للتشخيص
- 📱 واجهة استجابة كاملة

## 📞 للدعم

تحقق من:
- ملفات السجل في المتصفح (F12 → Console)
- حالة Supabase (https://supabase.com/dashboard)
- رسائل الخطأ في `/api/health`
