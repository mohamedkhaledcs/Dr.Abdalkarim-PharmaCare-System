

-- Sample medicine data for Egyptian pharmacy system
-- Inserting common medicines with approximate current prices in EGP

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
('Propecia 1mg', 'Finasteride for hair loss', '1mg daily', 'Hair growth', 'Sexual dysfunction', 'Women avoid handling', 'Men''s Health', 150.00, 22.00, 28, 20),

-- Pediatrics
('Calpol 120mg', 'Paracetamol for children', '120mg every 4-6 hours', 'Fever and pain relief', 'None usually', 'Accurate dosing critical', 'Pediatrics', 18.00, 3.00, 10, 100),
('Nurofen for Children', 'Ibuprofen suspension', '5ml every 6-8 hours', 'Pain and fever', 'Stomach upset', 'Not for children under 3 months', 'Pediatrics', 35.00, 35.00, 1, 60),

-- Mental Health
('Prozac 20mg', 'Fluoxetine for depression', '20mg daily', 'Antidepressant', 'Nausea, insomnia', 'Monitor mood changes', 'Mental Health', 75.00, 12.00, 14, 40),
('Xanax 0.5mg', 'Alprazolam for anxiety', '0.5mg as needed', 'Anti-anxiety', 'Drowsiness, dependence', 'Short-term use only', 'Mental Health', 45.00, 7.00, 30, 30),

-- Oncology
('Tamoxifen 20mg', 'For breast cancer treatment', '20mg daily', 'Hormone therapy', 'Hot flashes, blood clots', 'Regular monitoring', 'Oncology', 200.00, 30.00, 30, 10),
('Methotrexate 2.5mg', 'For cancer and autoimmune diseases', '2.5mg weekly', 'Chemotherapy agent', 'Nausea, liver toxicity', 'Folic acid supplementation', 'Oncology', 85.00, 12.00, 10, 15),

-- Vaccines and Immunization
('Influenza Vaccine', 'Annual flu vaccine', 'Single dose yearly', 'Flu prevention', 'Soreness at injection site', 'Not for egg allergy', 'Vaccines', 150.00, 150.00, 1, 50),
('Hepatitis B Vaccine', 'For hepatitis B prevention', '3-dose series', 'Viral hepatitis prevention', 'Pain, fever', 'Complete all doses', 'Vaccines', 120.00, 120.00, 1, 40),

-- Herbal and Alternative
('Ginkgo Biloba 120mg', 'For memory and circulation', '120mg twice daily', 'Herbal supplement', 'Headache, dizziness', 'May interact with blood thinners', 'Herbal', 55.00, 8.50, 10, 70),
('Echinacea 300mg', 'For immune support', '300mg three times daily', 'Herbal remedy', 'Allergic reactions', 'Not for autoimmune diseases', 'Herbal', 40.00, 6.50, 10, 80),

-- Dental Care
('Chlorhexidine Mouthwash', 'Antiseptic mouth rinse', '10ml twice daily', 'Oral hygiene', 'Staining, altered taste', 'Not for long-term use', 'Dental', 25.00, 25.00, 1, 90),
('Sensodyne Toothpaste', 'For sensitive teeth', 'Brush twice daily', 'Toothpaste', 'None', 'Consult dentist for pain', 'Dental', 35.00, 35.00, 1, 100),

-- Weight Management
('Xenical 120mg', 'Orlistat for weight loss', '120mg with meals', 'Weight management', 'Oily stools, gas', 'Low-fat diet required', 'Weight Management', 280.00, 40.00, 21, 20),
('Phentermine 30mg', 'Appetite suppressant', '30mg daily', 'Weight loss aid', 'Insomnia, dry mouth', 'Short-term use only', 'Weight Management', 95.00, 14.00, 30, 25),

-- Thyroid
('Synthroid 50mcg', 'Levothyroxine for hypothyroidism', '50mcg daily', 'Thyroid hormone', 'Weight changes, hair loss', 'Take on empty stomach', 'Thyroid', 45.00, 7.00, 30, 50),
('Propylthiouracil 50mg', 'For hyperthyroidism', '50mg three times daily', 'Antithyroid drug', 'Rash, liver toxicity', 'Regular blood tests', 'Thyroid', 35.00, 5.50, 10, 40),

-- Urology
('Cialis 5mg', 'Tadalafil for BPH and ED', '5mg daily', 'Urological medication', 'Headache, back pain', 'Not with nitrates', 'Urology', 220.00, 32.00, 28, 15),
('Flomax 0.4mg', 'Tamsulosin for prostate enlargement', '0.4mg daily', 'BPH treatment', 'Dizziness, runny nose', 'Take at bedtime', 'Urology', 85.00, 12.00, 30, 35),

-- Emergency/First Aid
('Adrenaline Auto-Injector', 'Epinephrine for allergic reactions', '0.3mg injection', 'Emergency allergy treatment', 'Tremor, anxiety', 'Seek medical help immediately', 'Emergency', 350.00, 350.00, 1, 10),
('Burn Cream', 'Silver sulfadiazine for burns', 'Apply twice daily', 'Burn treatment', 'Skin irritation', 'Keep wound clean', 'Emergency', 45.00, 45.00, 1, 60),

-- More additions for larger collection
('Amoxicillin 500mg', 'Broad-spectrum antibiotic', '500mg three times daily', 'Bacterial infections', 'Diarrhea, rash', 'Complete course', 'Antibiotics', 28.00, 4.50, 10, 100),
('Diclofenac 50mg', 'NSAID for pain and inflammation', '50mg twice daily', 'Pain relief', 'Stomach upset', 'Take with food', 'Pain Relief', 18.00, 3.00, 10, 90),
('Losartan 50mg', 'For hypertension', '50mg daily', 'Blood pressure control', 'Dizziness, fatigue', 'Monitor potassium levels', 'Cardiovascular', 35.00, 5.50, 10, 70),
('Simvastatin 20mg', 'Cholesterol lowering', '20mg daily', 'Statin medication', 'Muscle pain, liver changes', 'Regular liver tests', 'Cardiovascular', 40.00, 6.50, 10, 60),
('Metoprolol 50mg', 'Beta blocker for heart conditions', '50mg twice daily', 'Heart medication', 'Fatigue, slow heart rate', 'Don''t stop suddenly', 'Cardiovascular', 25.00, 4.00, 10, 80),
('Warfarin 5mg', 'Anticoagulant', '5mg daily (adjusted)', 'Blood thinner', 'Bleeding risk', 'Regular INR monitoring', 'Cardiovascular', 30.00, 5.00, 10, 50),
('Furosemide 40mg', 'Diuretic for edema', '40mg daily', 'Water pill', 'Increased urination, dizziness', 'Monitor electrolytes', 'Cardiovascular', 15.00, 2.50, 10, 100),
('Digoxin 0.25mg', 'For heart failure', '0.25mg daily', 'Cardiac glycoside', 'Nausea, vision changes', 'Monitor heart rate', 'Cardiovascular', 20.00, 3.50, 10, 60),
('Spironolactone 25mg', 'Diuretic and aldosterone antagonist', '25mg daily', 'Heart failure treatment', 'Increased urination, hyperkalemia', 'Potassium monitoring', 'Cardiovascular', 22.00, 3.50, 10, 70),
('Hydrochlorothiazide 25mg', 'Thiazide diuretic', '25mg daily', 'Hypertension treatment', 'Electrolyte imbalance', 'Sun protection', 'Cardiovascular', 12.00, 2.00, 10, 120),

-- More antibiotics
('Cephalexin 500mg', 'Cephalosporin antibiotic', '500mg four times daily', 'Skin and urinary infections', 'Diarrhea, nausea', 'Allergy to penicillin', 'Antibiotics', 35.00, 5.50, 10, 80),
('Doxycycline 100mg', 'Tetracycline antibiotic', '100mg twice daily', 'Various infections', 'Sun sensitivity, nausea', 'Not for children under 8', 'Antibiotics', 28.00, 4.50, 10, 90),
('Clindamycin 300mg', 'Antibiotic for serious infections', '300mg four times daily', 'Anaerobic infections', 'Diarrhea, nausea', 'C. difficile risk', 'Antibiotics', 65.00, 10.00, 10, 40),
('Trimethoprim-Sulfamethoxazole', 'Bactrim for UTIs', '800/160mg twice daily', 'Urinary tract infections', 'Rash, nausea', 'Sulfa allergy', 'Antibiotics', 25.00, 4.00, 10, 100),

-- More pain relief
('Tramadol 50mg', 'Opioid analgesic', '50mg every 4-6 hours', 'Moderate pain', 'Dizziness, constipation', 'Dependence risk', 'Pain Relief', 35.00, 5.50, 10, 60),
('Codeine Phosphate 30mg', 'Opioid for cough and pain', '30mg every 4 hours', 'Cough suppression', 'Drowsiness, constipation', 'Not for children', 'Pain Relief', 20.00, 3.50, 10, 70),
('Naproxen 250mg', 'NSAID for pain and inflammation', '250mg twice daily', 'Arthritis pain', 'Stomach upset, dizziness', 'GI bleeding risk', 'Pain Relief', 22.00, 3.50, 10, 80),

-- More vitamins
('Vitamin D3 1000IU', 'Cholecalciferol for bone health', '1000IU daily', 'Vitamin D supplement', 'None usually', 'Monitor calcium levels', 'Vitamins', 30.00, 5.00, 10, 100),
('B Complex Vitamins', 'B vitamin complex', 'One tablet daily', 'Energy metabolism', 'None usually', 'Water soluble', 'Vitamins', 25.00, 4.00, 10, 90),
('Iron Sulfate 325mg', 'For iron deficiency anemia', '325mg daily', 'Iron supplement', 'Constipation, stomach upset', 'Take with vitamin C', 'Vitamins', 15.00, 2.50, 10, 110),
('Zinc 50mg', 'Zinc supplement for immunity', '50mg daily', 'Immune support', 'Nausea, metallic taste', 'Not with copper deficiency', 'Vitamins', 20.00, 3.50, 10, 80),

-- More diabetes medications
('Gliclazide 80mg', 'Sulfonylurea for diabetes', '80mg daily', 'Blood sugar control', 'Hypoglycemia, weight gain', 'Regular monitoring', 'Diabetes', 28.00, 4.50, 10, 70),
('Pioglitazone 30mg', 'Thiazolidinedione for diabetes', '30mg daily', 'Insulin sensitizer', 'Weight gain, edema', 'Heart failure risk', 'Diabetes', 45.00, 7.00, 10, 50),
('Sitagliptin 100mg', 'DPP-4 inhibitor', '100mg daily', 'Diabetes management', 'Upper respiratory infection', 'Pancreatitis risk', 'Diabetes', 85.00, 12.00, 28, 40),

-- More respiratory
('Montelukast 10mg', 'Leukotriene receptor antagonist', '10mg daily', 'Asthma and allergies', 'Headache, stomach pain', 'Not for acute attacks', 'Respiratory', 75.00, 11.00, 10, 60),
('Salbutamol Syrup', 'Bronchodilator syrup', '5ml every 6 hours', 'Asthma treatment', 'Tremor, tachycardia', 'Measure dose carefully', 'Respiratory', 25.00, 25.00, 1, 80),
('Budesonide Inhaler', 'Corticosteroid inhaler', '200mcg twice daily', 'Asthma control', 'Hoarse voice, thrush', 'Rinse mouth after use', 'Respiratory', 95.00, 95.00, 1, 30),

-- More gastrointestinal
('Lansoprazole 30mg', 'Proton pump inhibitor', '30mg daily', 'Acid reflux treatment', 'Headache, diarrhea', 'Take before food', 'Gastrointestinal', 50.00, 8.00, 10, 70),
('Domperidone 10mg', 'Prokinetic for nausea', '10mg three times daily', 'Nausea and vomiting', 'Dry mouth, headache', 'Not for GI obstruction', 'Gastrointestinal', 18.00, 3.00, 10, 90),
('Mebeverine 135mg', 'Antispasmodic for IBS', '135mg three times daily', 'Irritable bowel syndrome', 'Dizziness, headache', 'Take with food', 'Gastrointestinal', 35.00, 5.50, 10, 60),

-- More dermatology
('Hydrocortisone Cream 1%', 'Topical steroid', 'Apply twice daily', 'Skin inflammation', 'Skin thinning, irritation', 'Short-term use only', 'Dermatology', 15.00, 15.00, 1, 100),
('Ketoconazole Cream 2%', 'Antifungal cream', 'Apply twice daily', 'Fungal skin infections', 'Skin irritation', 'Not for eyes', 'Dermatology', 25.00, 25.00, 1, 80),
('Permethrin Cream 5%', 'For scabies treatment', 'Apply once, wash off after 8-14 hours', 'Parasitic infections', 'Skin irritation, burning', 'Whole body application', 'Dermatology', 45.00, 45.00, 1, 40),

-- More eye care
('Timolol Eye Drops 0.5%', 'Beta blocker for glaucoma', '1 drop twice daily', 'Intraocular pressure reduction', 'Stinging, blurred vision', 'Monitor heart rate', 'Eye Care', 55.00, 55.00, 1, 50),
('Ciprofloxacin Eye Drops', 'Antibiotic eye drops', '1-2 drops every 2 hours', 'Bacterial eye infections', 'Stinging, redness', 'Complete course', 'Eye Care', 35.00, 35.00, 1, 70),
('Artificial Tears Preservative Free', 'Lubricating eye drops', '1-2 drops as needed', 'Dry eye relief', 'Temporary blur', 'Compatible with contacts', 'Eye Care', 75.00, 75.00, 1, 60),

-- More women's health
('Clomiphene 50mg', 'For infertility treatment', '50mg daily for 5 days', 'Ovulation induction', 'Hot flashes, mood changes', 'Ovarian monitoring', 'Women''s Health', 85.00, 12.00, 10, 30),
('Medroxyprogesterone 10mg', 'Progestin for menstrual disorders', '10mg daily', 'Hormone therapy', 'Breakthrough bleeding, weight gain', 'Not for pregnancy', 'Women''s Health', 40.00, 6.50, 10, 50),
('Estradiol Patches 50mcg', 'Hormone replacement therapy', 'One patch weekly', 'Menopause symptoms', 'Skin irritation, breast tenderness', 'Increased thrombosis risk', 'Women''s Health', 150.00, 150.00, 4, 25),

-- More pediatrics
('Amoxicillin Suspension', 'Antibiotic for children', 'Based on weight', 'Pediatric infections', 'Diarrhea, rash', 'Accurate dosing', 'Pediatrics', 35.00, 35.00, 1, 80),
('Ibuprofen Suspension', 'Pain relief for children', 'Based on weight', 'Fever and pain', 'Stomach upset', 'Not for dehydration', 'Pediatrics', 28.00, 28.00, 1, 90),
('Cetirizine Syrup', 'Antihistamine for children', '5ml daily', 'Allergy relief', 'Drowsiness', 'Measure carefully', 'Pediatrics', 22.00, 22.00, 1, 100),

-- More mental health
('Sertraline 50mg', 'SSRI for depression/anxiety', '50mg daily', 'Antidepressant', 'Nausea, insomnia', 'Gradual discontinuation', 'Mental Health', 55.00, 8.50, 14, 50),
('Escitalopram 10mg', 'SSRI for depression', '10mg daily', 'Mood stabilizer', 'Nausea, sexual dysfunction', 'Monitor suicidal thoughts', 'Mental Health', 65.00, 10.00, 14, 45),
('Lorazepam 1mg', 'Benzodiazepine for anxiety', '1mg as needed', 'Anti-anxiety', 'Drowsiness, dependence', 'Short-term use', 'Mental Health', 35.00, 6.00, 30, 40),

-- More oncology
('Anastrozole 1mg', 'Aromatase inhibitor', '1mg daily', 'Breast cancer treatment', 'Joint pain, hot flashes', 'Bone density monitoring', 'Oncology', 250.00, 35.00, 30, 12),
('Letrozole 2.5mg', 'Aromatase inhibitor', '2.5mg daily', 'Hormone-sensitive breast cancer', 'Fatigue, dizziness', 'Pregnancy prevention', 'Oncology', 220.00, 32.00, 30, 10),

-- More herbal
('Milk Thistle 150mg', 'Liver support supplement', '150mg twice daily', 'Liver health', 'Diarrhea, nausea', 'Bile duct obstruction', 'Herbal', 45.00, 7.00, 10, 70),
('Valerian Root 300mg', 'Sleep aid', '300mg before bed', 'Insomnia relief', 'Drowsiness, headache', 'Driving caution', 'Herbal', 35.00, 5.50, 10, 80),

-- More dental
('Fluoride Mouthwash', 'Cavity protection', '10ml daily', 'Oral health', 'None usually', 'Swish and spit', 'Dental', 20.00, 20.00, 1, 120),
('Peroxide Mouthwash', 'Antiseptic rinse', '10ml twice daily', 'Oral hygiene', 'Irritation, staining', 'Dilute if needed', 'Dental', 15.00, 15.00, 1, 100),

-- More weight management
('Orlistat 60mg', 'Weight loss medication', '60mg with meals', 'Obesity treatment', 'Fatty stools, gas', 'Multivitamin supplementation', 'Weight Management', 180.00, 25.00, 21, 25),
('Sibutramine 10mg', 'Appetite suppressant', '10mg daily', 'Weight management', 'Dry mouth, insomnia', 'Cardiovascular monitoring', 'Weight Management', 75.00, 11.00, 30, 20),

-- More thyroid
('Liothyronine 25mcg', 'T3 thyroid hormone', '25mcg daily', 'Thyroid replacement', 'Tremor, sweating', 'Heart monitoring', 'Thyroid', 55.00, 8.50, 30, 35),
('Methimazole 5mg', 'Antithyroid medication', '5mg three times daily', 'Hyperthyroidism', 'Rash, nausea', 'Liver function tests', 'Thyroid', 25.00, 4.00, 10, 60),

-- More urology
('Tamsulosin 0.4mg', 'Alpha blocker for BPH', '0.4mg daily', 'Prostate enlargement', 'Dizziness, retrograde ejaculation', 'Blood pressure monitoring', 'Urology', 70.00, 10.00, 30, 40),
('Finasteride 5mg', '5-alpha reductase inhibitor', '5mg daily', 'BPH treatment', 'Sexual dysfunction, gynecomastia', 'PSA monitoring', 'Urology', 85.00, 12.00, 30, 35),

-- More emergency
('Bandages Assorted', 'First aid bandages', 'As needed', 'Wound dressing', 'None', 'Keep clean and dry', 'Emergency', 25.00, 25.00, 1, 150),
('Antiseptic Solution', 'Wound cleaning', 'Apply as needed', 'Infection prevention', 'Stinging', 'Dilute for sensitive skin', 'Emergency', 18.00, 18.00, 1, 120);

