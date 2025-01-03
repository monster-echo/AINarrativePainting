import { createContext } from 'react'
import { App } from '../services/Apps'

export const AppContext = createContext<{
  app?: App
}>({ app: undefined })

export const AppContextProvider: React.FC<{
  app?: App
  children: React.ReactNode
}> = ({ app, children }) => (
  <AppContext.Provider value={{ app }}>{children}</AppContext.Provider>
)
