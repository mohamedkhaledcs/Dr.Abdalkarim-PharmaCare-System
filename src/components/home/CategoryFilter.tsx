'use client'

import { useProductStore } from '@/store/productStore'

const categories = [
  { key: 'Pain Relief', label: 'مسكنات وألم' },
  { key: 'Antibiotics', label: 'مضادات حيوية' },
  { key: 'Vitamins', label: 'فيتامينات ومكملات' },
  { key: 'Cardiovascular', label: 'القلب والضغط' },
  { key: 'Respiratory', label: 'الجهاز التنفسي' },
  { key: 'Diabetes', label: 'أدوية السكري' },
  { key: 'Digestive', label: 'الجهاز الهضمي' },
  { key: 'Skin Care', label: 'العناية بالبشرة' },
  { key: 'Baby Care', label: 'عناية الطفل' },
]

export default function CategoryFilter() {
  const selectedCategory = useProductStore((state) => state.selectedCategory)
  const setSelectedCategory = useProductStore((state) => state.setSelectedCategory)

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">تسوق حسب الفئة</h2>
        {selectedCategory && (
          <button 
            onClick={() => setSelectedCategory('')} 
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            عرض الكل
          </button>
        )}
      </div>
      <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x">
        <button
          onClick={() => setSelectedCategory('')}
          className={`snap-start whitespace-nowrap rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${
            !selectedCategory 
              ? 'border-primary bg-primary text-white shadow-md' 
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          الكل
        </button>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`snap-start whitespace-nowrap rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${
              selectedCategory === cat.key 
                ? 'border-primary bg-primary text-white shadow-md' 
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  )
}
