import {
  IonContent,
  IonFooter,
  IonInput,
  IonButton,
  IonIcon,
} from '@ionic/react'
import { stopSharp, sendSharp } from 'ionicons/icons'
import { useEffect, useRef, useState } from 'react'
import { useTxt2ImgStore } from '../../stores/txt2imgStore'
import { App } from '../../services/Apps'
import Chat from '../../components/chat'

type ChatPanelProps = {
  app: App
}

const ChatPanel = (props: ChatPanelProps) => {
  const { app } = props

  const id = localStorage.getItem(`paint:${app.id}:conversationId`)
  const chatItemsDomRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLIonContentElement>(null)
  const [inputText, setInputText] = useState<string>()
  const {
    id: conversationId,
    init,
    setAppId,
    name,
    responding,
    send,
    stop,
    chatItems,
  } = useTxt2ImgStore()
  useEffect(() => {
    setAppId(app.id, id ?? '')
  }, [app])

  useEffect(() => {
    if (conversationId)
      localStorage.setItem(`paint:${app.id}:conversationId`, conversationId)
  }, [conversationId])

  useEffect(() => {
    if (chatItems.length === 0) {
      if (id) {
        init(id)
      }
    }
  }, [id, chatItems])
  useEffect(() => {
    // scroll to bottom
    if (contentRef.current) contentRef.current.scrollToBottom()
  }, [chatItems, id])
  const handleSend = async () => {
    if (responding) {
      await stop()
    } else {
      if (inputText != undefined) {
        console.log('inputText:', inputText)
        const tempText = inputText.trim()
        if (tempText.length === 0) {
          return
        }
        try {
          setInputText('')
          await send(tempText)
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
        <div className="mb-16" ref={chatItemsDomRef}>
          <Chat items={chatItems} />
        </div>
      </IonContent>
      <IonFooter className="pb-4 px-4 bg-gray-50">
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

export default ChatPanel
