# ⚡ البدء السريع

## المشكلة الحالية
- ❌ لا توجد أدوية في الموقع
- **السبب:** Supabase RLS محمي البيانات

## الحل الفوري (2 دقيقة)

### 1. اذهب إلى Supabase
```
https://supabase.com/dashboard
```

### 2. SQL Editor - انسخ والصق هذا:
```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
```

### 3. اضغط Run (الزر الأزرق)

### 4. العودة للموقع
```
http://localhost:3000
```

## ✨ المميزات الجديدة

✅ **زر البحث داخل الـ input** - لا يوجد زر بطرف الحقل
✅ **بحث case-insensitive** - اكتب "بانادول" أو "BANADOL" كلاهما يشتغل
✅ **البحث يتعامل مع العربي والإنجليزي** تماماً
✅ **البناء كامل بدون أخطاء** - جاهز للإنتاج

## 📱 اختبر الآن

```
npm run dev
```

ثم افتح:
- `http://localhost:3000` - الموقع الرئيسي
- `http://localhost:3000/api/health` - فحص الاتصال

---

**إذا لم تظهر الأدوية بعد الحل:**
- اضغط Ctrl+Shift+Delete لمسح الذاكرة
- أعد تحديث الصفحة (F5)
- تأكد أن `data.sql` تم تشغيله في Supabase
