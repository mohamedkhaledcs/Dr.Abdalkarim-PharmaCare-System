'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product, User, Order } from '@/types'
import api from '@/services/api'
import { useUserStore } from '@/store/userStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

interface FormData {
  name: string
  description: string
  usage: string
  dosage: string
  side_effects: string
  warnings: string
  category: string
  price_box: number
  price_strip: number
  strips_per_box: number
  stock: number
  image: string
}

interface UserFormData {
  name: string
  email: string
  phone: string
  role: 'admin' | 'super_admin' | 'cashier' | 'user'
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'orders' | 'reports'>('products')
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'add' | 'edit'>('list')
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    usage: '',
    dosage: '',
    side_effects: '',
    warnings: '',
    category: '',
    price_box: 0,
    price_strip: 0,
    strips_per_box: 1,
    stock: 0,
    image: '',
  })
  const [userFormData, setUserFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const { user, logout } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        if (activeTab === 'products') {
          const res = await api.get('/products')
          setProducts(res.data)
        } else if (activeTab === 'users') {
          const res = await api.get('/users')
          setUsers(res.data)
        } else if (activeTab === 'orders') {
          const res = await api.get('/orders')
          setOrders(res.data)
        }
      } catch (err) {
        console.error(`[Dashboard] Load ${activeTab} error`, err)
        setError(`خطأ في تحميل ${activeTab === 'products' ? 'المنتجات' : activeTab === 'users' ? 'المستخدمين' : 'الطلبات'}`)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [activeTab])

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)
    try {
      if (!formData.name || !formData.category) {
        setError('الاسم والفئة مطلوبان')
        return
      }
      if (editingId) {
        await api.put(`/products/${editingId}`, formData)
        setError('تم تحديث المنتج بنجاح')
      } else {
        await api.post('/products', formData)
        setError('تم إضافة المنتج بنجاح')
      }
      setActiveSubTab('list')
      setEditingId(null)
      setFormData({
        name: '',
        description: '',
        usage: '',
        dosage: '',
        side_effects: '',
        warnings: '',
        category: '',
        price_box: 0,
        price_strip: 0,
        strips_per_box: 1,
        stock: 0,
        image: '',
      })
      const updated = await api.get('/products')
      setProducts(updated.data)
    } catch (err: any) {
      console.error('[Dashboard] Save product error', err)
      setError(err.response?.data?.error || 'خطأ في حفظ المنتج')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)
    try {
      if (!userFormData.name || !userFormData.email) {
        setError('الاسم والبريد الإلكتروني مطلوبان')
        return
      }
      if (editingId) {
        await api.put(`/users/${editingId}`, userFormData)
        setError('تم تحديث المستخدم بنجاح')
      } else {
        await api.post('/users', userFormData)
        setError('تم إضافة المستخدم بنجاح')
      }
      setActiveSubTab('list')
      setEditingId(null)
      setUserFormData({
        name: '',
        email: '',
        phone: '',
        role: 'user',
      })
      const updated = await api.get('/users')
      setUsers(updated.data)
    } catch (err: any) {
      console.error('[Dashboard] Save user error', err)
      setError(err.response?.data?.error || 'خطأ في حفظ المستخدم')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleProductEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      usage: product.usage || '',
      dosage: product.dosage || '',
      side_effects: product.side_effects || '',
      warnings: product.warnings || '',
      category: product.category,
      price_box: product.price_box,
      price_strip: product.price_strip,
      strips_per_box: product.strips_per_box,
      stock: product.stock,
      image: product.image || '',
    })
    setEditingId(product.id)
    setActiveSubTab('edit')
  }

  const handleUserEdit = (userData: User) => {
    setUserFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role,
    })
    setEditingId(userData.id)
    setActiveSubTab('edit')
  }

  const handleProductDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
    try {
      await api.delete(`/products/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
      setError('تم حذف المنتج بنجاح')
    } catch (err) {
      console.error('[Dashboard] Delete product error', err)
      setError('خطأ في حذف المنتج')
    }
  }

  const handleUserDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return
    try {
      await api.delete(`/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
      setError('تم حذف المستخدم بنجاح')
    } catch (err) {
      console.error('[Dashboard] Delete user error', err)
      setError('خطأ في حذف المستخدم')
    }
  }

  const handleOrderStatusUpdate = async (id: string, status: Order['status']) => {
    try {
      await api.put(`/orders/${id}`, { status })
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      setError('تم تحديث حالة الطلب بنجاح')
    } catch (err) {
      console.error('[Dashboard] Update order error', err)
      setError('خطأ في تحديث الطلب')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <Button onClick={logout} variant="secondary">تسجيل الخروج</Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex space-x-1 mb-6 border-b">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'products'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          المنتجات
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          المستخدمون
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          الطلبات
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'reports'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          التقارير
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === 'products' && (
        <div>
          {/* Sub Tabs for Products */}
          <div className="flex gap-2 mb-6">
            <Button onClick={() => { setActiveSubTab('list'); setEditingId(null)}} variant={activeSubTab === 'list' ? 'primary' : 'secondary'}>عرض المنتجات</Button>
            <Button onClick={() => { setActiveSubTab('add'); setEditingId(null); setFormData({name:'',description:'',usage:'',dosage:'',side_effects:'',warnings:'',category:'',price_box:0,price_strip:0,strips_per_box:1,stock:0,image:''})}} variant={activeSubTab === 'add' ? 'primary' : 'secondary'}>إضافة منتج</Button>
          </div>

          {activeSubTab === 'list' && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-[#fbfcff] text-gray-500 font-bold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-5 whitespace-nowrap">المنتج</th>
                      <th className="px-6 py-5 whitespace-nowrap">الفئة</th>
                      <th className="px-6 py-5 whitespace-nowrap">السعر</th>
                      <th className="px-6 py-5 whitespace-nowrap">المخزون المتوفر</th>
                      <th className="px-6 py-5 text-center whitespace-nowrap">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">لا توجد منتجات متوفرة حالياً</td></tr>
                    ) : products.map(product => (
                      <tr key={product.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                              ) : (
                                <span className="text-xl">💊</span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors max-w-[200px] truncate">{product.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{product.usage || 'بدون وصف'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 whitespace-nowrap">
                            {product.category || 'غير مصنف'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="font-extrabold text-gray-900 text-base">{product.price_box} <span className="text-[10px] text-gray-400 font-medium">ج.م/علبة</span></div>
                            <div className="font-medium text-gray-400 text-xs">{product.price_strip} <span className="text-[9px]">ج.م/شريط</span></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold ${product.stock > 10 ? 'bg-green-50 text-green-600 border border-green-100' : product.stock > 0 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {product.stock} وحدة
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleProductEdit(product)} className="p-2.5 bg-white text-primary border border-gray-100 hover:bg-primary hover:text-white rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-primary/20" title="تعديل البيانات">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button onClick={() => handleProductDelete(product.id)} className="p-2.5 bg-white text-red-500 border border-gray-100 hover:bg-red-500 hover:text-white rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-red-500/20" title="حذف المنتج">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeSubTab === 'add' || activeSubTab === 'edit') && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="اسم المنتج" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                <Input label="الفئة" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                <Input label="سعر الصندوق" type="number" value={formData.price_box} onChange={e => setFormData({ ...formData, price_box: Number(e.target.value) })} required />
                <Input label="سعر الشريط" type="number" value={formData.price_strip} onChange={e => setFormData({ ...formData, price_strip: Number(e.target.value) })} required />
                <Input label="عدد الشرائط في الصندوق" type="number" value={formData.strips_per_box} onChange={e => setFormData({ ...formData, strips_per_box: Number(e.target.value) })} required />
                <Input label="الكمية المتاحة" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} required />
                <div className="md:col-span-2">
                  <Input label="الوصف" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Input label="الاستخدام" value={formData.usage} onChange={e => setFormData({ ...formData, usage: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Input label="الجرعة" value={formData.dosage} onChange={e => setFormData({ ...formData, dosage: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Input label="الآثار الجانبية" value={formData.side_effects} onChange={e => setFormData({ ...formData, side_effects: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Input label="التحذيرات" value={formData.warnings} onChange={e => setFormData({ ...formData, warnings: e.target.value })} />
                </div>
                <Input label="رابط الصورة" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit" disabled={submitLoading}>{submitLoading ? 'جاري الحفظ...' : 'حفظ'}</Button>
                  <Button type="button" onClick={() => { setActiveSubTab('list'); setEditingId(null);} } variant="secondary">إلغاء</Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          {/* Sub Tabs for Users */}
          <div className="flex gap-2 mb-6">
            <Button onClick={() => { setActiveSubTab('list'); setEditingId(null)}} variant={activeSubTab === 'list' ? 'primary' : 'secondary'}>عرض المستخدمين</Button>
            <Button onClick={() => { setActiveSubTab('add'); setEditingId(null); setUserFormData({name:'',email:'',phone:'',role:'user'})}} variant={activeSubTab === 'add' ? 'primary' : 'secondary'}>إضافة مستخدم</Button>
          </div>

          {activeSubTab === 'list' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users.length === 0 ? <Card>لا يوجد مستخدمون</Card> : users.map(userData => (
                <Card key={userData.id}>
                  <h3 className="font-bold">{userData.name}</h3>
                  <p className="text-sm">{userData.email}</p>
                  <p className="text-sm">الدور: {userData.role}</p>
                  <div className="mt-2 flex gap-2">
                    <Button onClick={() => handleUserEdit(userData)}>تعديل</Button>
                    <Button onClick={() => handleUserDelete(userData.id)} variant="danger">حذف</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {(activeSubTab === 'add' || activeSubTab === 'edit') && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</h2>
              <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="الاسم" value={userFormData.name} onChange={e => setUserFormData({ ...userFormData, name: e.target.value })} required />
                <Input label="البريد الإلكتروني" type="email" value={userFormData.email} onChange={e => setUserFormData({ ...userFormData, email: e.target.value })} required />
                <Input label="الهاتف" value={userFormData.phone} onChange={e => setUserFormData({ ...userFormData, phone: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium mb-1">الدور</label>
                  <select value={userFormData.role} onChange={e => setUserFormData({ ...userFormData, role: e.target.value as User['role'] })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="user">مستخدم</option>
                    <option value="cashier">كاشير</option>
                    <option value="admin">مدير</option>
                    <option value="super_admin">مدير عام</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit" disabled={submitLoading}>{submitLoading ? 'جاري الحفظ...' : 'حفظ'}</Button>
                  <Button type="button" onClick={() => { setActiveSubTab('list'); setEditingId(null);} } variant="secondary">إلغاء</Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2 className="text-xl font-bold mb-4">إدارة الطلبات</h2>
          <div className="space-y-4">
            {orders.length === 0 ? <Card>لا توجد طلبات</Card> : orders.map(order => (
              <Card key={order.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">طلب #{order.id.slice(-8)}</h3>
                    <p className="text-sm">النوع: {order.type === 'whatsapp' ? 'واتساب' : 'نظام'}</p>
                    <p className="text-sm">التاريخ: {new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
                  </div>
                  <div className="text-left">
                    <select
                      value={order.status}
                      onChange={e => handleOrderStatusUpdate(order.id, e.target.value as Order['status'])}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="pending">في الانتظار</option>
                      <option value="confirmed">مؤكد</option>
                      <option value="delivered">تم التسليم</option>
                    </select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div>
          <h2 className="text-xl font-bold mb-4">التقارير</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 text-center">
              <h3 className="text-2xl font-bold text-primary">{products.length}</h3>
              <p>إجمالي المنتجات</p>
            </Card>
            <Card className="p-4 text-center">
              <h3 className="text-2xl font-bold text-primary">{users.length}</h3>
              <p>إجمالي المستخدمين</p>
            </Card>
            <Card className="p-4 text-center">
              <h3 className="text-2xl font-bold text-primary">{orders.length}</h3>
              <p>إجمالي الطلبات</p>
            </Card>
            <Card className="p-4 text-center">
              <h3 className="text-2xl font-bold text-primary">
                {orders.filter(o => o.status === 'delivered').length}
              </h3>
              <p>الطلبات المكتملة</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
