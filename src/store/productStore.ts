import { create } from 'zustand'
import { Product } from '@/types'

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  selectedCategory: string;
  loading: boolean;
  error: string | null;
  
  setProducts: (products: Product[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  applyFilters: () => void;
}

// Simple typo-tolerant subsequence matcher
const fuzzyMatch = (str: string, pattern: string) => {
  pattern = pattern.toLowerCase()
  str = str.toLowerCase()
  let patternIdx = 0
  let strIdx = 0
  while (patternIdx < pattern.length && strIdx < str.length) {
    if (pattern[patternIdx] === str[strIdx]) patternIdx++
    strIdx++
  }
  return patternIdx === pattern.length
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  searchQuery: '',
  selectedCategory: '',
  loading: true,
  error: null,

  setProducts: (products) => {
    set({ products })
    get().applyFilters()
  },
  
  setSearchQuery: (searchQuery) => {
    set({ searchQuery })
    get().applyFilters()
  },
  
  setSelectedCategory: (selectedCategory) => {
    set({ selectedCategory })
    get().applyFilters()
  },
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  applyFilters: () => {
    const { products, searchQuery, selectedCategory } = get()
    
    let result = selectedCategory 
      ? products.filter((p) => p.category === selectedCategory) 
      : [...products]

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      result = result.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(query) || fuzzyMatch(p.name, query)
        const catMatch = p.category && (p.category.toLowerCase().includes(query) || fuzzyMatch(p.category, query))
        const descMatch = p.description && p.description.toLowerCase().includes(query)
        
        return nameMatch || catMatch || descMatch
      })
    }

    set({ filteredProducts: result })
  }
}))
