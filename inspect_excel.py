import pandas as pd
import json
import pathlib
import datetime

# Read current products
products_path = pathlib.Path('data/products.json')
products = json.loads(products_path.read_text(encoding='utf-8'))
existing_names = {prod['name'].strip().lower() for prod in products}
next_id = max(int(prod['id']) for prod in products) + 1

# Read Excel
excel_path = 'drugs list files/drugs sheet .xlsx'
try:
    df = pd.read_excel(excel_path)
    print('Excel columns:', list(df.columns))
    print('Number of rows:', len(df))
    added = 0
    for _, row in df.iterrows():
        name = str(row.get('name', '')).strip()
        if not name or name.lower() in existing_names:
            continue
        category = str(row.get('category', ''))
        price_box = float(row.get('price_box', 0))
        price_strip = float(row.get('price_strip', 0))
        usage = str(row.get('usage', ''))
        dosage = str(row.get('dosage', ''))
        stock = int(row.get('stock', 0))
        strips_per_box = int(row.get('strips_per_box', 10))
        if strips_per_box <= 0:
            strips_per_box = 10
        if price_strip == 0 and price_box > 0:
            price_strip = round(price_box / strips_per_box, 2)
        created_at = (datetime.datetime(2026,3,24,12,0,0) + datetime.timedelta(minutes=next_id)).isoformat() + 'Z'
        products.append({
            'id': str(next_id),
            'name': name,
            'description': usage,
            'usage': usage,
            'dosage': dosage,
            'category': category,
            'price_box': price_box,
            'price_strip': price_strip,
            'strips_per_box': strips_per_box,
            'stock': stock,
            'image': f'https://via.placeholder.com/280x280.png?text={name.replace(" ","+")}',
            'created_at': created_at
        })
        existing_names.add(name.lower())
        next_id += 1
        added += 1
    print('Added from Excel:', added)
except Exception as e:
    print('Error reading Excel:', e)

# Read PDF
pdf_path = 'drugs list files/pharmacy_drugs_list.pdf'
try:
    import pdfplumber
    with pdfplumber.open(pdf_path) as pdf:
        text = ''
        for page in pdf.pages:
            text += page.extract_text() + '\n'
    print('PDF text length:', len(text))
    # Assume text is list of drugs, parse lines
    lines = text.split('\n')
    added_pdf = 0
    for line in lines:
        line = line.strip()
        if not line or len(line) < 5:
            continue
        # Assume format like "Name - Category - Price"
        parts = line.split(' - ')
        if len(parts) >= 3:
            name = parts[0].strip()
            if name.lower() in existing_names:
                continue
            category = parts[1].strip()
            price_str = parts[2].strip()
            try:
                price_box = float(price_str)
                price_strip = round(price_box / 10, 2)
                created_at = (datetime.datetime(2026,3,24,12,0,0) + datetime.timedelta(minutes=next_id)).isoformat() + 'Z'
                products.append({
                    'id': str(next_id),
                    'name': name,
                    'description': '',
                    'usage': '',
                    'dosage': '',
                    'category': category,
                    'price_box': price_box,
                    'price_strip': price_strip,
                    'strips_per_box': 10,
                    'stock': 50,
                    'image': f'https://via.placeholder.com/280x280.png?text={name.replace(" ","+")}',
                    'created_at': created_at
                })
                existing_names.add(name.lower())
                next_id += 1
                added_pdf += 1
            except:
                pass
    print('Added from PDF:', added_pdf)
except Exception as e:
    print('Error reading PDF:', e)

# Save
products_path.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding='utf-8')
print('Total products now:', len(products))