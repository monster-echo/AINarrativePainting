import { delay } from '../utils/delay'
import axiosInstance from './axios'

export const getMessages = async ({ appId }: { appId: number }) => {
  await delay(2.5 * 1000)

  const response = await axiosInstance.get(`/api/apps/${appId}/messages`)
  debugger
  return response.data
}
