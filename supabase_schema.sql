-- Paste this into your Supabase SQL Editor to create the products table

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  usage TEXT,
  dosage TEXT,
  side_effects TEXT,
  warnings TEXT,
  category TEXT NOT NULL,
  price_box NUMERIC NOT NULL DEFAULT 0,
  price_strip NUMERIC NOT NULL DEFAULT 0,
  strips_per_box INTEGER NOT NULL DEFAULT 1,
  stock INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for users to see products)
CREATE POLICY "Allow public read access on products"
  ON public.products FOR SELECT
  USING (true);

-- Allow authenticated admins to do everything
CREATE POLICY "Allow authenticated admins to insert products"
  ON public.products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admins to update products"
  ON public.products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admins to delete products"
  ON public.products FOR DELETE
  USING (auth.role() = 'authenticated');

-- Also create the users table if it doesn't match perfectly
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
