# Pharmacy Management System - Database Setup Guide

## 🚀 Deployment Steps

### 1. Supabase Database Setup

Your Supabase project is already configured in `.env.local`. Now you need to:

1. **Go to your Supabase Dashboard**: <https://supabase.com/dashboard>
2. **Select your project**: `oiljvuygrwnzsqhrykju`
3. **Go to SQL Editor** (left sidebar)

### 2. Run Schema Creation

Copy and paste the entire content of `schema.sql` into the SQL Editor and click "Run":

```sql
-- This will create all tables: users, products, orders, order_items, sales, returns, notifications
```

### 3. Populate with Medicine Data

After the schema is created, copy and paste the entire content of `data.sql` into the SQL Editor and click "Run":

```sql
-- This will insert 100+ medicines with current Egyptian prices
```

### 4. Enable Row Level Security (Optional but Recommended)

In Supabase Dashboard, go to Authentication > Policies and create policies for your tables.

### 5. Test the System

After database setup, run:

```bash
npm run dev
```

Then visit:

- **Dashboard**: <http://localhost:3000/dashboard> (login as admin)
- **Products**: <http://localhost:3000/products>
- **Search**: <http://localhost:3000/search>

## 📊 Database Features

- **Users**: Admin, Cashier, Regular users with role-based access
- **Products**: 100+ medicines with categories, pricing, and stock
- **Orders**: Complete order management system
- **Real-time**: Notifications and order updates

## 🔐 Default Admin Account

Create an admin user through the registration, then update their role in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

## 🛠️ System Status

✅ Build successful
✅ All APIs implemented
✅ User management complete
✅ Dashboard enhanced
✅ Medicine data ready
✅ Code optimizations applied
⏳ Database deployment needed
