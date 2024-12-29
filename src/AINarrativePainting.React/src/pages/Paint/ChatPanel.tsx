import {
  IonContent,
  IonFooter,
  IonInput,
  IonButton,
  IonIcon,
} from '@ionic/react'
import { stopSharp, sendSharp } from 'ionicons/icons'
import { createContext, memo, useEffect, useRef, useState } from 'react'
import { App } from '../../services/Apps'
import Chat from '../../components/chat'
import usePaintAppsStore, { PaintAppState } from '../../stores/paintStore'
import { ChatContextProvider } from '../../hooks/chat-context'

type ChatPanelProps = {
  appId: number
  app: PaintAppState
}
const ChatPanel = (props: ChatPanelProps) => {
  const { appId, app } = props
  const contentRef = useRef<HTMLIonContentElement>(null)
  const [inputText, setInputText] = useState<string>()
  const { responding, chatItems } = app
  const { send, stop } = usePaintAppsStore()

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300)
    }
  }, [chatItems.length])

  const handleSend = async () => {
    if (responding) {
      await stop(appId)
    } else {
      if (inputText != undefined) {
        console.log('inputText:', inputText)
        const tempText = inputText.trim()
        if (tempText.length === 0) {
          return
        }
        try {
          setInputText('')
          await send(appId, tempText)
        } catch (e) {
          setInputText(tempText)
        }
      }
    }
  }
  const handleKeyDown = (e: any) => {}
  const handleKeyUp = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <IonContent fullscreen ref={contentRef}>
        <div className="mb-16">
          <ChatContextProvider
            appId={appId}
            conversationId={app.conversationId}
          >
            <Chat items={chatItems} />
          </ChatContextProvider>
        </div>
      </IonContent>
      <IonFooter className="pb-4 px-4">
        <IonInput
          color={'primary'}
          placeholder="请输入文本"
          counter={true}
          maxlength={50}
          type="text"
          value={inputText}
          onIonInput={e => setInputText(e.detail.value!)}
          accessKey="Enter"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        >
          <IonButton
            fill="clear"
            color={'secondary'}
            slot="end"
            onClick={handleSend}
          >
            {responding ? (
              <IonIcon icon={stopSharp}></IonIcon>
            ) : (
              <IonIcon icon={sendSharp}></IonIcon>
            )}
          </IonButton>
        </IonInput>
      </IonFooter>
    </>
  )
}

const ChatAppPanel = (props: { app: App }) => {
  const { id } = props.app

  const { getApp } = usePaintAppsStore()

  const app = getApp(id)

  if (!app) {
    return <div>加载中...</div>
  }

  return <ChatPanel appId={id} app={app} />
}

export default memo(ChatAppPanel)
