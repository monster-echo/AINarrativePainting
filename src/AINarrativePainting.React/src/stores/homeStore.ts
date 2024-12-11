import { create } from 'zustand'
import { App, getApps } from '../services/Apps'

interface HomeState {
  apps: App[]
  initApps: () => Promise<App[]>
}

export const useHomeStore = create<HomeState>((set, get) => ({
  apps: [],
  initApps: async () => {
    const apps = await getApps()
    set({ apps })

    return apps
  },
}))
