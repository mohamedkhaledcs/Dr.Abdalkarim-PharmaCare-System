import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '../services/productService'
import { roleMiddleware } from '../middlewares/auth'

const productService = new ProductService()

export async function getProducts(request: NextRequest) {
  try {
    console.log('[ProductController] GET /api/products - Fetching all products')
    const products = await productService.getAllProducts()
    
    if (!products || products.length === 0) {
      console.warn('[ProductController] No products found in database')
    }
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('[ProductController] Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}

export async function getProduct(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`[ProductController] GET /api/products/${params.id}`)
    const product = await productService.getProductById(params.id)
    if (!product) {
      console.warn(`[ProductController] Product not found: ${params.id}`)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error(`[ProductController] Error fetching product ${params.id}:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function createProduct(request: NextRequest) {
  const auth = await roleMiddleware('admin')(request)
  if (auth instanceof NextResponse) return auth

  try {
    console.log('[ProductController] POST /api/products - Creating new product')
    const body = await request.json()
    console.log('[ProductController] Request body:', body)
    
    const product = await productService.createProduct(body)
    if (!product) {
      console.error('[ProductController] Failed to create product')
      return NextResponse.json({ error: 'Failed to create product' }, { status: 400 })
    }
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('[ProductController] Error creating product:', error)
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
  }
}

export async function updateProduct(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await roleMiddleware('admin')(request)
  if (auth instanceof NextResponse) return auth

  try {
    console.log(`[ProductController] PUT /api/products/${params.id} - Updating product`)
    const body = await request.json()
    const product = await productService.updateProduct(params.id, body)
    if (!product) {
      console.warn(`[ProductController] Product not found for update: ${params.id}`)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error(`[ProductController] Error updating product ${params.id}:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function deleteProduct(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await roleMiddleware('admin')(request)
  if (auth instanceof NextResponse) return auth

  try {
    console.log(`[ProductController] DELETE /api/products/${params.id} - Deleting product`)
    const success = await productService.deleteProduct(params.id)
    if (!success) {
      console.warn(`[ProductController] Product not found for deletion: ${params.id}`)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error(`[ProductController] Error deleting product ${params.id}:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}