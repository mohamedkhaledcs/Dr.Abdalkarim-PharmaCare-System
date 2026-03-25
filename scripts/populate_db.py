import json
import os
import time
import requests

try:
    from duckduckgo_search import DDGS
except ImportError:
    print("Installing requirements...")
    os.system("pip install duckduckgo-search requests")
    from duckduckgo_search import DDGS

# Comprehensive list of famous Egyptian drugs with accurate data
products_data = [
    {
        "name": "Panadol Extra 24 Tablets",
        "category": "Pain Relief",
        "price_box": 35.0,
        "stock": 100,
        "description": "بنادول اكسترا مسكن فعال للآلام ومخفض للحرارة. يحتوي على باراسيتامول وكافيين لفعالية أقوى.",
        "usage": "2 قرص كل 6 ساعات عند اللزوم، بحد أقصى 8 أقراص يومياً.",
        "dosage": "البالغين والأطفال فوق 12 سنة.",
        "warnings": "لا يستخدم مع أدوية أخرى تحتوي على الباراسيتامول.",
        "side_effects": "نادراً ما تحدث أعراض حساسية."
    },
    {
        "name": "Brufen 400mg 30 Tablets",
        "category": "Pain Relief",
        "price_box": 45.0,
        "stock": 50,
        "description": "بروفين 400 مجم مضاد للالتهابات ومسكن لآلام العظام والمفاصل والأسنان وصداع النصفى.",
        "usage": "قرص واحد 3 مرات يومياً بعد الأكل.",
        "dosage": "البالغين",
        "warnings": "يمنع لمرضى قرحة المعدة وحساسية الصدر.",
        "side_effects": "ألم بالمعدة، غثيان."
    },
    {
        "name": "Cataflam 50mg 20 Tablets",
        "category": "Pain Relief",
        "price_box": 50.0,
        "stock": 80,
        "description": "كاتافلام 50 مجم مسكن سريع المفعول لآلام الأسنان والعظام والالتهابات.",
        "usage": "قرص كل 8 ساعات بعد الأكل.",
        "dosage": "للكبار فوق 14 عام",
        "warnings": "يجب تجنبه لمرضى الضغط المرتفع وقرحة المعدة.",
        "side_effects": "تهيج المعدة."
    },
    {
        "name": "Augmentin 1g 14 Tablets",
        "category": "Antibiotics",
        "price_box": 130.0,
        "stock": 30,
        "description": "مضاد حيوي واسع المجال يعالج التهابات الجهاز التنفسي والمسالك البولية والجلدية.",
        "usage": "قرص كل 12 ساعة لمدة 7-10 أيام حسب إرشادات الطبيب.",
        "dosage": "البالغين",
        "warnings": "لا يستخدم لمن يعانون من حساسية البنسلين.",
        "side_effects": "إسهال، اضطرابات في الهضم."
    },
    {
        "name": "Hibiotic 1g 16 Tablets",
        "category": "Antibiotics",
        "price_box": 110.0,
        "stock": 40,
        "description": "هايبايوتك 1 جرام مضاد حيوي واسع المدى يحتوي على أموكسيسيلين وحمض الكلافولانيك.",
        "usage": "قرص كل 12 ساعة بعد الأكل.",
        "dosage": "البالغين",
        "warnings": "أكمل الجرعة الموصوفة من الطبيب كاملة.",
        "side_effects": "غثيان، إسهال."
    },
    {
        "name": "Zithromax 500mg 3 Tablets",
        "category": "Antibiotics",
        "price_box": 120.0,
        "stock": 25,
        "description": "زيثروماكس 500 مجم مضاد حيوي قوي يؤخذ جرعة واحدة يومياً لمدة 3 أيام.",
        "usage": "قرص واحد يومياً في نفس الميعاد.",
        "dosage": "البالغين",
        "warnings": "يؤخذ قبل الأكل بساعة أو بعد الأكل بساعتين.",
        "side_effects": "ألم بطني خفيف."
    },
    {
        "name": "Centrum Lutein 30 Tablets",
        "category": "Vitamins",
        "price_box": 250.0,
        "stock": 60,
        "description": "سنتروم لوتين مكمل غذائي شامل يحتوي على فيتامينات ومعادن متعددة لدعم الصحة والمناعة.",
        "usage": "قرص واحد يومياً مع كوب ماء ويفضل مع الأكل.",
        "dosage": "البالغين",
        "warnings": "لا تتجاوز الجرعة اليومية الموصى بها.",
        "side_effects": "تغير لون البول."
    },
    {
        "name": "Omega 3 Plus 30 Capsules",
        "category": "Vitamins",
        "price_box": 95.0,
        "stock": 100,
        "description": "أوميجا 3 بلس مكمل غذائي لتعزيز صحة القلب والذاكرة وخفض الكوليسترول.",
        "usage": "كبسولة أو كبسولتين يومياً.",
        "dosage": "البالغين",
        "warnings": "استشر طبيبك إذا كنت تخضع لعملية جراحية قريباً.",
        "side_effects": "طعم غير مستحب."
    },
    {
        "name": "Ferroglobin B12 30 Capsules",
        "category": "Vitamins",
        "price_box": 85.0,
        "stock": 80,
        "description": "فيروجلوبين مكمل حديد وفيتامين ب12 لعلاج الأنيميا وتساقط الشعر.",
        "usage": "كبسولة يومياً بعد الأكل.",
        "dosage": "البالغين",
        "warnings": "يفضل تناوله مع فيتامين سي أو عصير برتقال لزيادة الامتصاص.",
        "side_effects": "إمساك أو تغير لون الإخراج."
    },
    {
        "name": "Concor 5mg 30 Tablets",
        "category": "Cardiovascular",
        "price_box": 65.0,
        "stock": 45,
        "description": "كونكور 5 مجم لعلاج ارتفاع ضغط الدم وتنظيم ضربات القلب.",
        "usage": "قرص واحد يومياً في الصباح.",
        "dosage": "البالغين تحت الإشراف الطبي",
        "warnings": "لا توقف الدواء فجأة بدون استشارة الطبيب.",
        "side_effects": "برودة الأطراف، إرهاق."
    },
    {
        "name": "Capoten 25mg 20 Tablets",
        "category": "Cardiovascular",
        "price_box": 35.0,
        "stock": 50,
        "description": "كابوتين 25 مجم لتوسيع الأوعية الدموية وخفض ضغط الدم.",
        "usage": "حسب إرشادات الطبيب (عادة مرتين إلى 3 مرات يومياً).",
        "dosage": "البالغين",
        "warnings": "يؤخذ قبل الأكل بساعة.",
        "side_effects": "سعال جاف مستمر."
    },
    {
        "name": "Congestal 20 Tablets",
        "category": "Respiratory",
        "price_box": 45.0,
        "stock": 120,
        "description": "الكونجستال من أشهر الأدوية الفعالة فى علاج نزلات البرد والإنفلونزا.",
        "usage": "قرص كل 8 ساعات.",
        "dosage": "الكبار فوق 12 سنة.",
        "warnings": "لا يستخدم لمرضى الضغط المرتفع بدون إشراف طبي.",
        "side_effects": "النعاس، جفاف الفم."
    },
    {
        "name": "Otrivin Adult Nasal Spray",
        "category": "Respiratory",
        "price_box": 25.0,
        "stock": 70,
        "description": "أوتريفين بخاخ للأنف لتقليل احتقان الزكام والبرد بسرعة.",
        "usage": "بخة في كل فتحة أنف مرتين يومياً.",
        "dosage": "البالغين",
        "warnings": "لا تستخدمه لأكثر من 5 أيام متتالية.",
        "side_effects": "حرقان موضعي أو جفاف بالأنف."
    },
    {
        "name": "Glucophage 1000mg 30 Tablets",
        "category": "Diabetes",
        "price_box": 45.0,
        "stock": 90,
        "description": "جلوكوفاج 1000 مجم لعلاج السكر من النوع الثاني وتكيس المبايض.",
        "usage": "قرص بعد الأكل مرة إلى مرتين يومياً.",
        "dosage": "البالغين بتوجيه طبي",
        "warnings": "يجب متابعة وظائف الكلى بانتظام.",
        "side_effects": "اضطرابات بالمعدة، طعم معدني في الفم."
    },
    {
        "name": "Amaryl 2mg 30 Tablets",
        "category": "Diabetes",
        "price_box": 50.0,
        "stock": 60,
        "description": "أماريل 2 مجم لخفض مستوى السكر في الدم لمرضى السكري من النوع الثاني.",
        "usage": "قرص واحد يومياً قبل أول وجبة أساسية.",
        "dosage": "حسب إرشادات الطبيب",
        "warnings": "احرص على تناول وجباتك بانتظام لتجنب الهبوط.",
        "side_effects": "هبوط مستوى السكر بالدم."
    },
    {
        "name": "Antinal 24 Tablets",
        "category": "Digestive",
        "price_box": 30.0,
        "stock": 100,
        "description": "أنتينال مطهر معوي قوي وعلاج سريع للإسهال.",
        "usage": "قرص كل 6 ساعات.",
        "dosage": "البالغين",
        "warnings": "يعالج السبب البكتيري لذلك لا يفضل أخذه مع أدوية توقف الحركة المعوية إلا باستشارة.",
        "side_effects": "نادرة جداً."
    },
    {
        "name": "Controloc 40mg 14 Tablets",
        "category": "Digestive",
        "price_box": 120.0,
        "stock": 50,
        "description": "كونترولوك 40 مجم لعلاج قرحة المعدة والارتجاع المريئي وتقليل إفراز الحمض.",
        "usage": "قرص واحد يومياً قبل الإفطار بنصف ساعة.",
        "dosage": "البالغين",
        "warnings": "الاستخدام لفترات طويلة يتطلب إشراف طبي.",
        "side_effects": "صداع، ألم خفيف بالبطن."
    },
    {
        "name": "Panthenol Cream 50g",
        "category": "Skin Care",
        "price_box": 20.0,
        "stock": 150,
        "description": "بانثينول كريم لترطيب الجلد وعلاج التشققات والحروق الخفيفة.",
        "usage": "يدهن على طبقة الجلد المصابة 2-3 مرات يومياً.",
        "dosage": "لجميع الأعمار",
        "warnings": "للاستخدام الخارجي فقط.",
        "side_effects": "آمن جداً، نادراً ما يسبب تهيج."
    },
    {
        "name": "Sudocrem 125g",
        "category": "Skin Care",
        "price_box": 150.0,
        "stock": 40,
        "description": "سودوكريم مضاد لالتهابات الحفاضات والأكزيما وحروق الشمس.",
        "usage": "طبقة رقيقة على المنطقة المصابة عند الحاجة.",
        "dosage": "للأطفال والكبار",
        "warnings": "تجنب ملامسة العينين.",
        "side_effects": "لا توجد أعراض شائعة."
    },
    {
        "name": "Baby Drink 12 Sachets",
        "category": "Baby Care",
        "price_box": 35.0,
        "stock": 75,
        "description": "بيبي درينك أكياس أعشاب طبيعية لتهدئة تقلصات وغازات الرضع.",
        "usage": "يذوب الكيس في ماء دافئ ويعطى للطفل.",
        "dosage": "لحديثي الولادة والرضع",
        "warnings": "احرص على غليه وتبريد الماء قبل التحضير.",
        "side_effects": "آمن تماماً."
    }
]

def search_image_ddg(query):
    # Use DuckDuckGo to find a suitable product image
    try:
        from duckduckgo_search import DDGS
        results = DDGS().images(keywords=f"{query} egypt medicine package", max_results=1)
        for r in results:
            return r.get('image')
    except Exception as e:
        print(f"DDG search error for '{query}': {e}")
    return None

def download_image(url, filepath):
    try:
        # User-Agent to prevent 403 Forbidden
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        res = requests.get(url, headers=headers, stream=True, timeout=10)
        if res.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in res.iter_content(1024):
                    f.write(chunk)
            return True
    except Exception as e:
        print(f"Failed to download image {url}: {e}")
    return False

def main():
    print("--- PharmaCare DB Sync Started ---")
    
    products_dir = os.path.join("public", "products")
    os.makedirs(products_dir, exist_ok=True)
    
    final_data = []
    
    for idx, p in enumerate(products_data):
        pid = str(idx + 1)
        print(f"Processing [{pid}/{len(products_data)}]: {p['name']}...")
        
        # Determine image paths
        safe_name = p['name'].replace(' ', '_').replace('/', '_')
        local_filename = f"{pid}_{safe_name}.jpg"
        local_filepath = os.path.join(products_dir, local_filename)
        public_url = f"/products/{local_filename}"
        
        # Fetch image if it doesn't already exist locally
        if not os.path.exists(local_filepath):
            img_url = search_image_ddg(p['name'])
            
            if img_url:
                success = download_image(img_url, local_filepath)
                if not success:
                    print(f"Failed to download, using fallback for {p['name']}")
                    public_url = f"https://ui-avatars.com/api/?name={p['name'].replace(' ', '+')}&background=EGF4F0&color=16A34A&bold=true&size=400"
            else:
                print(f"No image found, using fallback for {p['name']}")
                public_url = f"https://ui-avatars.com/api/?name={p['name'].replace(' ', '+')}&background=EGF4F0&color=16A34A&bold=true&size=400"
        
        # Build final object
        p["id"] = pid
        p["image"] = public_url
        p["created_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        final_data.append(p)
        time.sleep(1) # delay to avoid rate-limiting
        
    # Write JSON data
    os.makedirs('data', exist_ok=True)
    with open('data/products.json', 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)
        
    print("\n[SUCCESS] Populated data/products.json with rich medicine data and local images!")

if __name__ == "__main__":
    main()
