import api from './api'
import { Product } from '@/types'

/**
 * Interface for Product Data Access
 * Makes it easy to switch between JSON HTTP API and Supabase later
 */
export interface IProductService {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  searchProducts(query: string): Promise<Product[]>;
  clearCache(): void;
}

const searchCache = new Map<string, Product[]>()

/**
 * Current implementation using Next.js API (JSON / custom backend)
 */
export class JsonProductService implements IProductService {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await api.get('/products')
      // Optional: Add data transformation here if API response differs from Product type
      return response.data || []
    } catch (error) {
      console.error('[JsonProductService] getProducts error:', error)
      throw error
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await api.get(`/products/${id}`)
      return response.data || null
    } catch (error) {
      console.error(`[JsonProductService] getProductById error for ${id}:`, error)
      return null
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    const trimmedQuery = query.trim().toLowerCase()
    if (!trimmedQuery) return []

    // Cache to prevent repetitive network requests
    if (searchCache.has(trimmedQuery)) {
      return searchCache.get(trimmedQuery)!
    }

    try {
      const response = await api.get(`/products/search?q=${encodeURIComponent(trimmedQuery)}`)
      const results = response.data || []
      searchCache.set(trimmedQuery, results)
      return results
    } catch (error) {
      console.error('[JsonProductService] searchProducts error:', error)
      throw error
    }
  }

  clearCache() {
    searchCache.clear()
  }
}

// Expose a singleton instance
export const productService: IProductService = new JsonProductService()
