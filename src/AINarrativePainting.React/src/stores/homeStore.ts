import { create } from 'zustand'
import { App, getApps } from '../services/Apps'

interface HomeState {
  apps: App[]
  // images: PromptImage[]
  initApps: () => Promise<App[]>
  // loadImages: () => Promise<PromptImage[]>
}

export const useHomeStore = create<HomeState>((set, get) => ({
  apps: [],
  images: [],
  initApps: async () => {
    const apps = await getApps()
    set({ apps })

    return apps
  },

  loadImages: async () => {
    // const images = await getImages()
    // if (images) set({ images })
    return []
  },
}))
