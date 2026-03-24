# 🔴 حل مشكلة الأدوية - RLS Policy

## المشكلة
```
[HealthCheck] Error fetching products: permission denied for schema public
```

هذا يعني: **جدول المنتجات محمي بـ RLS ولا أحد يستطيع قراءته**

---

## ✅ الحل في 3 خطوات

### الخطوة 1️⃣: اذهب إلى Supabase Dashboard
https://supabase.com/dashboard

### الخطوة 2️⃣: اذهب إلى Authentication → Policies

**لجدول products:**
1. اضغط على جدول `products`
2. ابحث عن `RLS` toggle على اليمين
3. **أطفئ RLS** (اضغط لتحويل Toggle)
   - أو اترك RLS مفعول وأضف Policy جديدة:
   - اضغط "New Policy"
   - اختر "SELECT"
   - اختر "For authenticated users OR unauthenticated users"
   - اضغط "Create"

### الخطوة 3️⃣: افعل الشيء ذاته لـ:
- [ ] `users` - SELECT policy
- [ ] `orders` - SELECT policy  
- [ ] `order_items` - SELECT policy
- [ ] `categories` - SELECT policy

---

## ⚡ الطريقة السريعة (تعطيل RLS)

في Supabase SQL Editor، شغّل هذا:

```sql
-- تعطيل RLS للمنتجات
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- تعطيل RLS للمستخدمين
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- تعطيل RLS للطلبات
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- تعطيل RLS لتفاصيل الطلبات
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
```

---

## ✨ بعد الحل

1. عد للمتصفح
2. أعد تحميل الصفحة (F5)
3. يجب الآن أن تظهر الأدوية في الموقع! 🎉

---

## 🔍 للتأكد من نجاح الحل

افتح هذا الرابط:
```
http://localhost:3000/api/health
```

يجب أن ترى:
```json
{
  "status": "ok",
  "database": "connected",
  "totalProducts": 45,
  "sampleProducts": [...]
}
```

إذا كان `totalProducts > 0` = نجح! ✅
