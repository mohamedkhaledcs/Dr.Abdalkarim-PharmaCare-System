import pandas as pd
import json
import pathlib
import datetime
import difflib
import math

def normalize_string(s):
    """Trim strings and handle NaN/None gracefully."""
    if pd.isna(s) or s is None:
        return ""
    # Ensure string representation and remove multiple inner spaces
    s = str(s).strip()
    return " ".join(s.split())

def normalize_category(c):
    """Title-case categories and handle empty cases."""
    c = normalize_string(c)
    if not c:
        return "Uncategorized"
    return c.title()

def clean_name(n):
    """Standardize name casing (Title Case for drugs usually looks best)."""
    n = normalize_string(n)
    return n.title() if n else ""

def safe_float(val, default=0.0):
    """Convert safely to float."""
    try:
        val = float(val)
        if math.isnan(val):
            return default
        return val
    except (ValueError, TypeError):
        return default

def safe_int(val, default=0):
    """Convert safely to int."""
    try:
        val = int(float(val))
        return val
    except (ValueError, TypeError):
        return default

def process_data(products_path_str, excel_path_str, pdf_path_str=None):
    print("--- Starting Data Pipeline Ingestion ---\n")
    products_path = pathlib.Path(products_path_str)
    
    # Load existing data
    if products_path.exists():
        try:
            products = json.loads(products_path.read_text(encoding='utf-8'))
        except json.JSONDecodeError:
            print(f"Error: {products_path} contains invalid JSON. Starting fresh.")
            products = []
    else:
        products = []
        
    next_id = 1
    existing_names = set()
    if products:
        for p in products:
            if 'id' in p:
                next_id = max(next_id, int(p['id']) + 1)
            if 'name' in p:
                existing_names.add(p['name'].strip().lower())
                
    def is_duplicate(name):
        """Check for exact matches or fuzzy similarity."""
        name_lower = name.lower()
        if name_lower in existing_names:
            return True, name_lower
        
        # Check fuzzy match
        matches = difflib.get_close_matches(name_lower, existing_names, n=1, cutoff=0.85)
        if matches:
            return True, matches[0]
            
        return False, None

    print(f"Loaded {len(products)} existing products.")
    
    # Process Excel Data
    added_excel = 0
    skipped_excel_dupe = 0
    error_excel = 0
    
    try:
        print(f"\n--- Processing Excel: {excel_path_str} ---")
        df = pd.read_excel(excel_path_str)
        print(f"Found {len(df)} rows in Excel.")
        
        # Replace NaN with empty strings to avoid float 'nan' polluting strings
        df = df.fillna('')
        
        for index, row in df.iterrows():
            # Use 1-indexed row matching Excel UI (add 2 to include header and 0-index offset)
            row_num = index + 2
            
            try:
                raw_name = row.get('name', '')
                name = clean_name(raw_name)
                
                if not name:
                    print(f"[Row {row_num}] Skipped: Missing or empty name.")
                    error_excel += 1
                    continue
                    
                is_dup, matched_name = is_duplicate(name)
                if is_dup:
                    print(f"[Row {row_num}] Skipped Duplicate: '{name}' (matched existing '{matched_name}')")
                    skipped_excel_dupe += 1
                    continue
                    
                category = normalize_category(row.get('category'))
                price_box = safe_float(row.get('price_box'), 0.0)
                price_strip = safe_float(row.get('price_strip'), 0.0)
                usage = normalize_string(row.get('usage'))
                dosage = normalize_string(row.get('dosage'))
                stock = safe_int(row.get('stock'), 0)
                strips_per_box = safe_int(row.get('strips_per_box'), 10)
                
                # Validation checks
                if strips_per_box <= 0:
                    strips_per_box = 10
                    
                if price_strip == 0.0 and price_box > 0:
                    price_strip = round(price_box / strips_per_box, 2)
                    
                # Setup product object
                created_at = datetime.datetime.now(datetime.timezone.utc).isoformat().replace('+00:00', 'Z')
                new_product = {
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
                    'image': f'https://via.placeholder.com/280x280.png?text={name.replace(" ", "+")}',
                    'created_at': created_at
                }
                
                products.append(new_product)
                existing_names.add(name.lower())
                next_id += 1
                added_excel += 1
                print(f"[Row {row_num}] Added: '{name}' | Category: '{category}'")
                
            except Exception as e:
                print(f"[Row {row_num}] Error processing row: {str(e)}")
                error_excel += 1
                
    except Exception as e:
        print(f"Failed to read Excel file '{excel_path_str}': {e}")
        
    print(f"\n[Excel Summary] Adding completed. Added: {added_excel}, Skipped (Dup): {skipped_excel_dupe}, Errors: {error_excel}")

    # Process PDF Data (Fallback)
    added_pdf = 0
    skipped_pdf_dupe = 0
    error_pdf = 0
    
    if pdf_path_str and pathlib.Path(pdf_path_str).exists():
        try:
            print(f"\n--- Processing PDF: {pdf_path_str} ---")
            import pdfplumber
            with pdfplumber.open(pdf_path_str) as pdf:
                text = ''
                for page in pdf.pages:
                    text += page.extract_text() + '\n'
            
            lines = text.split('\n')
            for index, line in enumerate(lines):
                line = line.strip()
                if not line or len(line) < 5:
                    continue
                    
                try:
                    parts = line.split(' - ')
                    if len(parts) >= 3:
                        raw_name = parts[0]
                        name = clean_name(raw_name)
                        
                        if not name:
                            continue
                            
                        is_dup, matched_name = is_duplicate(name)
                        if is_dup:
                            # Too much noise to log every skipped duplicate in PDF, just count it
                            skipped_pdf_dupe += 1
                            continue
                            
                        category = normalize_category(parts[1])
                        price_box = safe_float(parts[2], 0.0)
                        price_strip = round(price_box / 10, 2)
                        
                        created_at = datetime.datetime.now(datetime.timezone.utc).isoformat().replace('+00:00', 'Z')
                        new_product = {
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
                            'image': f'https://via.placeholder.com/280x280.png?text={name.replace(" ", "+")}',
                            'created_at': created_at
                        }
                        
                        products.append(new_product)
                        existing_names.add(name.lower())
                        next_id += 1
                        added_pdf += 1
                        print(f"[PDF Line {index}] Added: '{name}'")
                except Exception as e:
                    print(f"[PDF Line {index}] Error processing line: {e}")
                    error_pdf += 1
                    
        except ImportError:
            print(f"\nSkipping PDF: 'pdfplumber' not installed. Use 'pip install pdfplumber'.")
        except Exception as e:
            print(f"Failed to process PDF '{pdf_path_str}': {e}")
            
        print(f"\n[PDF Summary] Added: {added_pdf}, Skipped (Dup): {skipped_pdf_dupe}, Errors: {error_pdf}")

    # Save to JSON
    print(f"\n--- Saving ---")
    print(f"Total products ready to save: {len(products)}")
    try:
        products_path.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f"Success: Data successfully written to {products_path_str}")
    except Exception as e:
        print(f"Error saving to JSON: {e}")

if __name__ == '__main__':
    process_data(
        products_path_str='data/products.json',
        excel_path_str='drugs list files/drugs sheet .xlsx',
        pdf_path_str='drugs list files/pharmacy_drugs_list.pdf'
    )