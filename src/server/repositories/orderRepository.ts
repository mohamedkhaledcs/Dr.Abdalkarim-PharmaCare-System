import { supabase } from '@/lib/supabase'
import { Order, OrderItem } from '@/types'

export class OrderRepository {
  async create(order: Omit<Order, 'id' | 'created_at' | 'items'>): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()

    if (error) return null
    return data
  }

  async findById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) return []
    return data
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) return null
    return data
  }

  async addItem(orderId: string, item: Omit<OrderItem, 'id' | 'order_id'>): Promise<OrderItem | null> {
    const { data, error } = await supabase
      .from('order_items')
      .insert({ ...item, order_id: orderId })
      .select()
      .single()

    if (error) return null
    return data
  }
}