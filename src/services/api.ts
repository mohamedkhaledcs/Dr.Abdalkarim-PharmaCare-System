import axios from 'axios'
import { useUserStore } from '@/store/userStore'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = useUserStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api