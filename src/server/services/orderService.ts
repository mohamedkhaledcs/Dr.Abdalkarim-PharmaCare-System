import { OrderRepository } from '../repositories/orderRepository'
import { Order, OrderItem } from '@/types'

const orderRepository = new OrderRepository()

export class OrderService {
  async createOrder(
    order: Omit<Order, 'id' | 'created_at' | 'items'>,
    items: Omit<OrderItem, 'id' | 'order_id'>[]
  ): Promise<Order | null> {
    try {
      console.log('[OrderService] Creating new order for user:', order.user_id)
      
      const newOrder = await orderRepository.create(order)
      if (!newOrder) {
        console.error('[OrderService] Failed to create order')
        return null
      }

      console.log('[OrderService] Order created with ID:', newOrder.id)

      for (const item of items) {
        console.log('[OrderService] Adding item to order:', item.product_id)
        await orderRepository.addItem(newOrder.id, item)
      }

      const completeOrder = await orderRepository.findById(newOrder.id)
      console.log('[OrderService] Order created successfully with', items.length, 'items')
      return completeOrder
    } catch (error) {
      console.error('[OrderService] Error creating order:', error)
      return null
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      console.log('[OrderService] Getting order:', id)
      return await orderRepository.findById(id)
    } catch (error) {
      console.error('[OrderService] Error getting order:', error)
      return null
    }
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      console.log('[OrderService] Getting orders for user:', userId)
      return await orderRepository.findByUserId(userId)
    } catch (error) {
      console.error('[OrderService] Error getting user orders:', error)
      return []
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      console.log('[OrderService] Getting all orders')
      return await orderRepository.findAll()
    } catch (error) {
      console.error('[OrderService] Error getting all orders:', error)
      return []
    }
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    try {
      console.log('[OrderService] Updating order', id, 'status to:', status)
      return await orderRepository.updateStatus(id, status)
    } catch (error) {
      console.error('[OrderService] Error updating order status:', error)
      return null
    }
  }
}