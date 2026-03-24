export interface User {
  id: string
  name: string
  email: string
  phone?: string
  password?: string
  role: 'admin' | 'super_admin' | 'cashier' | 'user'
  created_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  usage?: string
  dosage?: string
  side_effects?: string
  warnings?: string
  category: string
  price_box: number
  price_strip: number
  strips_per_box: number
  stock: number
  image?: string
  created_at: string
}

export interface Order {
  id: string
  user_id?: string
  status: 'pending' | 'confirmed' | 'delivered'
  type: 'whatsapp' | 'system'
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  type: 'box' | 'strip'
  product?: Product
}

export interface Sale {
  id: string
  total: number
  created_at: string
}

export interface Return {
  id: string
  product_id: string
  amount: number
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  message: string
  read: boolean
  created_at: string
}