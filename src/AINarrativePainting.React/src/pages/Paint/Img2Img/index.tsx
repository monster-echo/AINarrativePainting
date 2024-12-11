import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonText,
  IonButton,
  IonFooter,
  IonIcon,
  IonInput,
} from '@ionic/react'
import { BackLayout } from '../../../components/layouts/BackLayout'
import { stopSharp, sendSharp } from 'ionicons/icons'
import { useRef, useState, useEffect } from 'react'
import Chat from '../../../components/chat'
import { useImg2ImgStore } from '../../../stores/img2imgStore'

const Img2Img = () => {
  const id = localStorage.getItem('img2img:conversationId')
  const chatItemsDomRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLIonContentElement>(null)
  const [inputText, setInputText] = useState<string>()

  const {
    id: conversationId,
    init,
    name,
    responding,
    send,
    stop,
    chatItems,
  } = useImg2ImgStore()

  useEffect(() => {
    if (conversationId)
      localStorage.setItem('img2img:conversationId', conversationId)
  }, [conversationId])

  useEffect(() => {
    if (id && chatItems.length === 0) {
      console.log(id)
      init(id)
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
    <BackLayout title="图生图">
      <IonContent fullscreen ref={contentRef}>
        <div className="mb-16" ref={chatItemsDomRef}>
          <Chat items={chatItems} />
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
    </BackLayout>
  )
}

export default Img2Img
