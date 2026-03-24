import { getOrder, updateOrderStatus } from '@/server/controllers/orderController'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return getOrder(request as any, { params })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return updateOrderStatus(request as any, { params })
}