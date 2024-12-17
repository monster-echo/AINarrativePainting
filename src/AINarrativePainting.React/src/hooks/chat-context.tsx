import { createContext } from 'react'

export const ChatContext = createContext<{
  appId: number
  conversationId?: string
}>({ appId: 0 })

export const ChatContextProvider: React.FC<{
  appId: number
  conversationId?: string
  children: React.ReactNode
}> = ({ appId, conversationId, children }) => (
  <ChatContext.Provider value={{ appId, conversationId }}>
    {children}
  </ChatContext.Provider>
)
