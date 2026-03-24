import { getProducts, createProduct } from '@/server/controllers/productController'

export async function GET(request: Request) {
  return getProducts(request as any)
}

export async function POST(request: Request) {
  return createProduct(request as any)
}