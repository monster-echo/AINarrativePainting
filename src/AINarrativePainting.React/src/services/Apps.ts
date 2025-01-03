import { get } from './Fetch'

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

export type PromptImage = {
  prompt: string
  filenames: string[]
}

export const getApps = async () => {
  return (await get('apps', {})) as App[]
}

export const getImages = async () => {
  const { images } = (await get('apps/images', {})) as { images: PromptImage[] }
  return images
}