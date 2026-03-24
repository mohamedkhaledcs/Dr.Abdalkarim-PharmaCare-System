import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '../services/orderService'
import { authMiddleware, roleMiddleware } from '../middlewares/auth'

const orderService = new OrderService()

export async function createOrder(request: NextRequest) {
  const auth = await authMiddleware(request)
  if (auth instanceof NextResponse) return auth

  try {
    console.log('[OrderController] POST /api/orders - Creating new order')
    const body = await request.json()
    console.log('[OrderController] Order data:', body)
    
    const orderData = body.order || { type: 'system' }
    const items = body.items || []

    const newOrder = await orderService.createOrder(
      { ...orderData, user_id: auth.id },
      items
    )

    if (!newOrder) {
      console.error('[OrderController] Failed to create order')
      return NextResponse.json({ error: 'Failed to create order' }, { status: 400 })
    }

    console.log('[OrderController] Order created successfully:', newOrder.id)
    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('[OrderController] Error creating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function getOrder(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authMiddleware(request)
  if (auth instanceof NextResponse) return auth

  try {
    console.log('[OrderController] GET /api/orders/:id - Getting order:', params.id)
    const order = await orderService.getOrderById(params.id)
    
    if (!order || order.user_id !== auth.id) {
      console.warn('[OrderController] Order not found or unauthorized:', params.id)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('[OrderController] Error getting order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function getUserOrders(request: NextRequest) {
  const auth = await authMiddleware(request)
  if (auth instanceof NextResponse) return auth

  try {
    console.log('[OrderController] GET /api/orders - Getting user orders:', auth.id)
    const orders = await orderService.getOrdersByUserId(auth.id)
    console.log('[OrderController] Found', orders.length, 'orders for user:', auth.id)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('[OrderController] Error getting user orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function updateOrderStatus(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await roleMiddleware('admin')(request)
  if (auth instanceof NextResponse) return auth

  try {
    console.log('[OrderController] PUT /api/orders/:id - Updating order status:', params.id)
    const { status } = await request.json()
    
    const order = await orderService.updateOrderStatus(params.id, status)
    if (!order) {
      console.warn('[OrderController] Order not found for update:', params.id)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    console.log('[OrderController] Order status updated:', params.id, 'status:', status)
    return NextResponse.json(order)
  } catch (error) {
    console.error('[OrderController] Error updating order status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}