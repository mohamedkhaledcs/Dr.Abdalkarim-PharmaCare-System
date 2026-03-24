import { createOrder, getUserOrders } from '@/server/controllers/orderController'

export async function GET(request: Request) {
  return getUserOrders(request as any)
}

export async function POST(request: Request) {
  return createOrder(request as any)
}