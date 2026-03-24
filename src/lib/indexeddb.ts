// IndexedDB setup for offline storage
const DB_NAME = 'PharmacyDB'
const DB_VERSION = 1

export interface OfflineSale {
  id: string
  items: Array<{
    product_id: string
    quantity: number
    type: 'box' | 'strip'
    product: any
  }>
  total: number
  created_at: string
}

class IndexedDBService {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Sales store
        if (!db.objectStoreNames.contains('sales')) {
          db.createObjectStore('sales', { keyPath: 'id' })
        }

        // Orders store
        if (!db.objectStoreNames.contains('orders')) {
          db.createObjectStore('orders', { keyPath: 'id' })
        }

        // Products cache
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' })
        }
      }
    })
  }

  async saveSale(sale: OfflineSale): Promise<void> {
    if (!this.db) await this.init()
    const transaction = this.db!.transaction(['sales'], 'readwrite')
    const store = transaction.objectStore('sales')
    await new Promise((resolve, reject) => {
      const request = store.put(sale)
      request.onsuccess = () => resolve(void 0)
      request.onerror = () => reject(request.error)
    })
  }

  async getOfflineSales(): Promise<OfflineSale[]> {
    if (!this.db) await this.init()
    const transaction = this.db!.transaction(['sales'], 'readonly')
    const store = transaction.objectStore('sales')
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async clearOfflineSales(): Promise<void> {
    if (!this.db) await this.init()
    const transaction = this.db!.transaction(['sales'], 'readwrite')
    const store = transaction.objectStore('sales')
    await new Promise((resolve, reject) => {
      const request = store.clear()
      request.onsuccess = () => resolve(void 0)
      request.onerror = () => reject(request.error)
    })
  }

  async cacheProducts(products: any[]): Promise<void> {
    if (!this.db) await this.init()
    const transaction = this.db!.transaction(['products'], 'readwrite')
    const store = transaction.objectStore('products')
    
    for (const product of products) {
      await new Promise((resolve, reject) => {
        const request = store.put(product)
        request.onsuccess = () => resolve(void 0)
        request.onerror = () => reject(request.error)
      })
    }
  }

  async getCachedProducts(): Promise<any[]> {
    if (!this.db) await this.init()
    const transaction = this.db!.transaction(['products'], 'readonly')
    const store = transaction.objectStore('products')
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

export const indexedDBService = new IndexedDBService()