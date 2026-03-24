# 💊 Dr. Abdalkarim PharmaCare System

A fullstack pharmacy management system built with Next.js, TypeScript, and Supabase.

---

## 🚀 Features

* 🛒 Online ordering system
* 💬 WhatsApp order integration
* 🧾 POS (Cashier Mode)
* 📊 Admin Dashboard
* 🔄 Offline support (IndexedDB)
* 🔁 Sync system (Local ↔ Online)
* 🔐 Role-based authentication (Admin / Cashier / User)

---

## 🛠️ Tech Stack

* Frontend: Next.js + React + TypeScript
* Backend: Next.js API Routes
* Database: Supabase (PostgreSQL)
* Offline DB: IndexedDB
* State Management: Zustand

---

## 📦 Installation

```bash
git clone https://github.com/mohamedkhaledcs/Dr.Abdalkarim-PharmaCare-System.git
cd Dr.Abdalkarim-PharmaCare-System
npm install
```

---

## ⚙️ Environment Variables

Create a file named `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 🗄️ Database Setup

1. Go to Supabase Dashboard
2. Open SQL Editor
3. Run:

   * schema.sql
   * data.sql

---

## ▶️ Run Project

```bash
npm run dev
```

---

## 🌐 Access

* Frontend: http://localhost:3000
* API: http://localhost:3000/api/products

---

## 📌 Notes

* Prices are dynamic and may vary
* Designed to be reusable for any pharmacy

---

## 🧠 Future Improvements

* Advanced search system
* Real-time sync
* Payment integration
* Mobile app version

---

## 👨‍💻 Author

Mohamed Khaled
