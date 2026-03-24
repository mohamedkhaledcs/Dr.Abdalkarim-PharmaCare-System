-- ===========================================
-- Pharmacy Management System Database Setup
-- Run this entire script in Supabase SQL Editor
-- ===========================================

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'cashier', 'user')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  usage TEXT,
  dosage TEXT,
  side_effects TEXT,
  warnings TEXT,
  category TEXT NOT NULL,
  price_box DECIMAL(10,2) NOT NULL,
  price_strip DECIMAL(10,2) NOT NULL,
  strips_per_box INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  status TEXT CHECK (status IN ('pending', 'confirmed', 'delivered')) DEFAULT 'pending',
  type TEXT CHECK (type IN ('whatsapp', 'system')) DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order_Items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  type TEXT CHECK (type IN ('box', 'strip')) DEFAULT 'box'
);

-- Sales table
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Returns table
CREATE TABLE returns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- ===========================================
-- MEDICINE DATA INSERTION
-- ===========================================

INSERT INTO products (name, description, usage, dosage, side_effects, warnings, category, price_box, price_strip, strips_per_box, stock) VALUES
-- Painkillers/Analgesics
('Panadol Extra', 'Paracetamol with caffeine for headache and pain relief', 'For headache, toothache, and body pain', '500mg tablets', 'Nausea, dizziness', 'Not for children under 12', 'Pain Relief', 15.50, 2.50, 10, 100),
('Brufen 400', 'Ibuprofen for pain and inflammation', 'For pain, fever, and inflammation', '400mg tablets', 'Stomach upset, dizziness', 'Avoid if allergic to aspirin', 'Pain Relief', 25.00, 4.00, 10, 80),
('Voltaren Emulgel', 'Diclofenac gel for topical pain relief', 'For muscle and joint pain', 'Apply 2-3 times daily', 'Skin irritation', 'Not for broken skin', 'Pain Relief', 35.00, 35.00, 1, 50),

-- Antibiotics
('Augmentin 625', 'Amoxicillin with clavulanic acid', 'For bacterial infections', '625mg tablets, twice daily', 'Diarrhea, nausea', 'Complete full course', 'Antibiotics', 85.00, 12.00, 10, 60),
('Ciprofloxacin 500', 'Antibiotic for urinary and respiratory infections', 'For infections', '500mg twice daily', 'Nausea, dizziness', 'Avoid sunlight exposure', 'Antibiotics', 45.00, 7.00, 10, 70),
('Azithromycin 500', 'Antibiotic for various infections', 'For infections', '500mg once daily for 3 days', 'Diarrhea, nausea', 'Take on empty stomach', 'Antibiotics', 55.00, 8.50, 6, 40),

-- Vitamins and Supplements
('Centrum Adults', 'Multivitamin for daily nutrition', 'One tablet daily', 'Complete multivitamin', 'None usually', 'Not a substitute for balanced diet', 'Vitamins', 120.00, 120.00, 1, 30),
('Vitamin C 1000mg', 'Ascorbic acid for immunity', '1000mg daily', 'Effervescent tablets', 'Stomach upset', 'High doses may cause diarrhea', 'Vitamins', 40.00, 6.50, 10, 90),
('Calcium D3', 'Calcium with vitamin D for bone health', 'For osteoporosis prevention', '500mg/200IU daily', 'Constipation', 'Take with food', 'Vitamins', 65.00, 10.00, 10, 60),

-- Cardiovascular
('Amlodipine 5mg', 'For high blood pressure', '5mg once daily', 'Blood pressure medication', 'Swelling, dizziness', 'Monitor blood pressure', 'Cardiovascular', 30.00, 5.00, 10, 50),
('Aspirin 75mg', 'Low dose aspirin for heart protection', '75mg daily', 'Cardiovascular protection', 'Stomach irritation', 'Not for ulcers', 'Cardiovascular', 20.00, 3.50, 10, 80),

-- Diabetes
('Metformin 500mg', 'For type 2 diabetes', '500mg twice daily', 'Blood sugar control', 'Diarrhea, nausea', 'Monitor blood sugar', 'Diabetes', 25.00, 4.00, 10, 70),
('Glucophage 850', 'Metformin for diabetes', '850mg twice daily', 'Diabetes management', 'Gastric upset', 'Kidney function check', 'Diabetes', 35.00, 5.50, 10, 60),

-- Respiratory
('Ventolin Inhaler', 'Salbutamol for asthma', '2 puffs as needed', 'Bronchodilator', 'Tremor, fast heartbeat', 'Not for acute attacks only', 'Respiratory', 75.00, 75.00, 1, 25),
('Mucinex DM', 'Guaifenesin and dextromethorphan for cough', '10ml every 4 hours', 'Cough syrup', 'Drowsiness, nausea', 'Not for children under 6', 'Respiratory', 45.00, 45.00, 1, 40),

-- Gastrointestinal
('Omeprazole 20mg', 'For acid reflux and ulcers', '20mg once daily', 'Proton pump inhibitor', 'Headache, diarrhea', 'Take before food', 'Gastrointestinal', 40.00, 6.50, 10, 80),
('Buscopan 10mg', 'Hyoscine for abdominal pain', '10mg three times daily', 'Antispasmodic', 'Dry mouth, dizziness', 'Not for glaucoma', 'Gastrointestinal', 28.00, 4.50, 10, 60),

-- Dermatology
('Fucidin Cream', 'Fusidic acid for skin infections', 'Apply twice daily', 'Topical antibiotic', 'Skin irritation', 'Not for eyes', 'Dermatology', 55.00, 55.00, 1, 35),
('Cetirizine 10mg', 'Antihistamine for allergies', '10mg once daily', 'Allergy relief', 'Drowsiness', 'Avoid alcohol', 'Dermatology', 22.00, 3.50, 10, 90),

-- Eye Care
('Refresh Tears', 'Artificial tears for dry eyes', '1-2 drops as needed', 'Lubricating eye drops', 'Temporary blur', 'Remove contacts first', 'Eye Care', 65.00, 65.00, 1, 45),
('Tobradex Eye Drops', 'Tobramycin and dexamethasone', '1-2 drops 4 times daily', 'Eye infection treatment', 'Stinging, blurred vision', 'Not for viral infections', 'Eye Care', 85.00, 85.00, 1, 20),

-- Women's Health
('Diane 35', 'Contraceptive with anti-androgen', 'One tablet daily', 'Birth control', 'Headache, nausea', 'Regular check-ups needed', 'Women''s Health', 95.00, 15.00, 21, 30),
('Premarin 0.625', 'Estrogen replacement therapy', '0.625mg daily', 'Hormone therapy', 'Breast tenderness', 'Increased cancer risk', 'Women''s Health', 120.00, 18.00, 28, 25),

-- Men's Health
('Viagra 50mg', 'Sildenafil for erectile dysfunction', '50mg as needed', 'ED treatment', 'Headache, flushing', 'Not with nitrates', 'Men''s Health', 180.00, 25.00, 4, 15),
('Propecia 1mg', 'Finasteride for hair loss', '1mg daily', 'Hair growth', 'Sexual dysfunction', 'Women avoid handling', 'Men''s Health', 150.00, 22.00, 28, 20);

-- Success message
SELECT 'Database setup completed successfully! 🎉' as status;