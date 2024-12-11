import { get } from './Fetch'

export type App = {
  id: number
  name: string
  description: string
  url: string
  avatar: string
  image: string
  category: string
}

export const getApps = async () => {
  return (await get('apps', {})) as App[]
}
