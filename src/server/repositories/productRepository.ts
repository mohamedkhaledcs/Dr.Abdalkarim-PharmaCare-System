import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Product } from '@/types'

const productsFilePath = path.resolve(process.cwd(), 'data', 'products.json')

function normalizeProduct(product: Product): Product {
  if (product.strips_per_box > 0) {
    const computedStripPrice = Number((product.price_box / product.strips_per_box).toFixed(2))
    if (Math.abs(computedStripPrice - product.price_strip) > 0.01) {
      product.price_strip = computedStripPrice
    }
  }
  return product
}

async function readProductsFromFile(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(productsFilePath, 'utf-8')
    const data = (JSON.parse(raw) as Product[])
    return data.map(normalizeProduct)
  } catch (error) {
    console.warn('[ProductRepository] products.json cannot be read, using empty list:', error)
    return []
  }
}

async function writeProductsToFile(products: Product[]): Promise<void> {
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf-8')
}

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    const products = await readProductsFromFile()
    return products.sort((a, b) => (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
  }

  async findById(id: string): Promise<Product | null> {
    const products = await readProductsFromFile()
    return products.find((p) => p.id === id) ?? null
  }

  async findByCategory(category: string): Promise<Product[]> {
    const products = await readProductsFromFile()
    return products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
  }

  async create(product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> {
    try {
      const products = await readProductsFromFile()
      const newProduct: Product = normalizeProduct({
        ...product,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      })
      products.unshift(newProduct)
      await writeProductsToFile(products)
      return newProduct
    } catch (error) {
      console.error('[ProductRepository] Error creating product:', error)
      return null
    }
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const products = await readProductsFromFile()
      const index = products.findIndex((p) => p.id === id)
      if (index === -1) return null

      const updatedProduct = normalizeProduct({ ...products[index], ...updates, id, created_at: products[index].created_at })
      products[index] = updatedProduct
      await writeProductsToFile(products)
      return updatedProduct
    } catch (error) {
      console.error('[ProductRepository] Error updating product:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const products = await readProductsFromFile()
      const remaining = products.filter((p) => p.id !== id)
      if (remaining.length === products.length) return false
      await writeProductsToFile(remaining)
      return true
    } catch (error) {
      console.error('[ProductRepository] Error deleting product:', error)
      return false
    }
  }

  async search(query: string): Promise<Product[]> {
    const products = await readProductsFromFile()
    const term = query.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      )
    })
  }
}
