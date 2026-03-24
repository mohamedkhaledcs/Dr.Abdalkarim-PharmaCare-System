import { ProductRepository } from '../repositories/productRepository'
import { Product } from '@/types'

const productRepository = new ProductRepository()

export class ProductService {
  async getAllProducts(): Promise<Product[]> {
    console.log('[ProductService] Getting all products')
    const products = await productRepository.findAll()
    console.log(`[ProductService] Retrieved ${products.length} products`)
    return products
  }

  async getProductById(id: string): Promise<Product | null> {
    console.log(`[ProductService] Getting product by ID: ${id}`)
    return productRepository.findById(id)
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    console.log(`[ProductService] Getting products by category: ${category}`)
    return productRepository.findByCategory(category)
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> {
    console.log(`[ProductService] Creating product: ${product.name}`)
    return productRepository.create(product)
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    console.log(`[ProductService] Updating product ${id}`)
    return productRepository.update(id, updates)
  }

  async deleteProduct(id: string): Promise<boolean> {
    console.log(`[ProductService] Deleting product ${id}`)
    return productRepository.delete(id)
  }

  async searchProducts(query: string): Promise<Product[]> {
    console.log(`[ProductService] Searching products with query: ${query}`)
    return productRepository.search(query)
  }
}