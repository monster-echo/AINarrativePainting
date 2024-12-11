import {
  IonContent,
  IonFooter,
  IonInput,
  IonButton,
  IonIcon,
} from '@ionic/react'
import { stopSharp, sendSharp } from 'ionicons/icons'
import { memo, useEffect, useRef, useState } from 'react'
import { useTxt2ImgStore } from '../../stores/txt2imgStore'
import { App } from '../../services/Apps'
import Chat from '../../components/chat'

type ChatPanelProps = {
  app: App
}

const ChatPanel = (props: ChatPanelProps) => {
  const { app } = props
  const chatItemsDomRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLIonContentElement>(null)
  const [inputText, setInputText] = useState<string>()
  const {
    id: conversationId,
    responding,
    send,
    stop,
    chatItems,
  } = useTxt2ImgStore()

  useEffect(() => {
    if (conversationId)
      localStorage.setItem(`paint:${app.id}:conversationId`, conversationId)
  }, [conversationId])

  useEffect(() => {
    // scroll to bottom
    if (contentRef.current) contentRef.current.scrollToBottom()
  }, [chatItems])
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

const ChatAppPanel = (props: { app: App }) => {
  const { id } = props.app
  const [loaded, setLoaded] = useState(false)
  const { init } = useTxt2ImgStore()
  useEffect(() => {
    const load = async () => {
      if (!loaded) {
        await init(id)
        setLoaded(true)
      }
    }
    load()
  }, [id, loaded])

  return (
    <>
      {loaded && <ChatPanel app={props.app} />}
      {!loaded && <div>Loading...</div>}
    </>
  )
}

export default memo(ChatAppPanel)
