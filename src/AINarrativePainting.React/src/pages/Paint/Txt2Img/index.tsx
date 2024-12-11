import {
  IonContent,
  IonButton,
  IonInput,
  IonFooter,
  IonIcon,
} from '@ionic/react'
import { BackLayout } from '../../../components/layouts/BackLayout'
import { sendSharp, stopSharp } from 'ionicons/icons'
import { memo, useEffect, useRef, useState } from 'react'
import { useTxt2ImgStore } from '../../../stores/txt2imgStore'
import Chat from '../../../components/chat'

const Txt2Img = () => {
  const id = localStorage.getItem('txt2img:conversationId')
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
      localStorage.setItem('txt2img:conversationId', conversationId)
  }, [conversationId])

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
    <BackLayout title="文生图">
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
              <IonIcon className="" icon={stopSharp}></IonIcon>
            ) : (
              <IonIcon className="" icon={sendSharp}></IonIcon>
            )}
          </IonButton>
        </IonInput>
      </IonFooter>
    </BackLayout>
  )
}

export default memo(Txt2Img)
