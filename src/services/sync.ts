import { indexedDBService, OfflineSale } from '@/lib/indexeddb'
import api from './api'

export class SyncService {
  async syncData(): Promise<void> {
    try {
      // Sync offline sales to online
      const offlineSales = await indexedDBService.getOfflineSales()
      
      for (const sale of offlineSales) {
        try {
          await api.post('/sales', {
            total: sale.total,
            items: sale.items,
          })
        } catch (error) {
          console.error('Failed to sync sale:', sale.id, error)
        }
      }

      // Clear synced data
      await indexedDBService.clearOfflineSales()

      // Sync online data to local
      const response = await api.get('/products')
      await indexedDBService.cacheProducts(response.data)

      alert('تم مزامنة البيانات بنجاح')
    } catch (error) {
      console.error('Sync failed:', error)
      alert('فشلت مزامنة البيانات')
    }
  }

  async saveOfflineSale(sale: OfflineSale): Promise<void> {
    await indexedDBService.saveSale(sale)
  }

  async getCachedProducts() {
    return await indexedDBService.getCachedProducts()
  }
}

export const syncService = new SyncService()