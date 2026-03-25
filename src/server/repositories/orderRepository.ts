import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Order, OrderItem } from '@/types'

const ordersFilePath = path.resolve(process.cwd(), 'data', 'orders.json')

async function readOrdersFromFile(): Promise<{ orders: Order[], items: OrderItem[] }> {
  try {
    const raw = await fs.readFile(ordersFilePath, 'utf-8')
    return JSON.parse(raw)
  } catch (error) {
    return { orders: [], items: [] }
  }
}

async function writeOrdersToFile(data: { orders: Order[], items: OrderItem[] }): Promise<void> {
  await fs.mkdir(path.dirname(ordersFilePath), { recursive: true })
  await fs.writeFile(ordersFilePath, JSON.stringify(data, null, 2), 'utf-8')
}

export class OrderRepository {
  async create(order: Omit<Order, 'id' | 'created_at' | 'items'>): Promise<Order | null> {
    try {
      const db = await readOrdersFromFile()
      const newOrder: Order = {
        ...order,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      }
      db.orders.unshift(newOrder)
      await writeOrdersToFile(db)
      return newOrder
    } catch (e) { return null }
  }

  async findById(id: string): Promise<Order | null> {
    const db = await readOrdersFromFile()
    const order = db.orders.find(o => o.id === id)
    if (!order) return null
    const items = db.items.filter(i => i.order_id === id)
    return { ...order, items }
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const db = await readOrdersFromFile()
    const orders = db.orders.filter(o => o.user_id === userId)
    return orders.map(o => ({
      ...o,
      items: db.items.filter(i => i.order_id === o.id)
    }))
  }

  async findAll(): Promise<Order[]> {
    const db = await readOrdersFromFile()
    return db.orders.map(o => ({
      ...o,
      items: db.items.filter(i => i.order_id === o.id)
    }))
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    const db = await readOrdersFromFile()
    const index = db.orders.findIndex(o => o.id === id)
    if (index === -1) return null
    
    db.orders[index].status = status
    await writeOrdersToFile(db)
    return db.orders[index]
  }

  async addItem(orderId: string, item: Omit<OrderItem, 'id' | 'order_id'>): Promise<OrderItem | null> {
    try {
      const db = await readOrdersFromFile()
      const newItem: OrderItem = {
        ...item,
        order_id: orderId,
        id: uuidv4()
      }
      db.items.push(newItem)
      await writeOrdersToFile(db)
      return newItem
    } catch (e) { return null }
  }
}