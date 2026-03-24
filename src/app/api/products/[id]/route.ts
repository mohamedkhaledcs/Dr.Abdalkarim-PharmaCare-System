import { getProduct, updateProduct, deleteProduct } from '@/server/controllers/productController'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return getProduct(request as any, { params })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return updateProduct(request as any, { params })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return deleteProduct(request as any, { params })
}