import { delay } from '../utils/delay'
import axiosInstance from './axios'

export type App = {
  id: number
  name: string
  description: string
  url: string
  avatar: string
  image: string
  category: string
  features: string[]
}

export const getApps = async () => {
  const response = await axiosInstance.get('/api/apps')
  await delay(2.5 * 1000)
  return response.data as App[]
}

export const getApp = async (id: string | number) => {
  const response = await axiosInstance.get(`/api/apps/${id}`)
  await delay(2.5 * 1000)
  return response.data as App
}
