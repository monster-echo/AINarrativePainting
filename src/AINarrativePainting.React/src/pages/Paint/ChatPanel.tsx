import {
  IonContent,
  IonFooter,
  IonInput,
  IonButton,
  IonIcon,
  IonBadge,
  useIonToast,
  IonAvatar,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSearchbar,
  IonRadioGroup,
  IonRadio,
} from '@ionic/react'
import { stopSharp, sendSharp } from 'ionicons/icons'
import { createContext, memo, useEffect, useRef, useState } from 'react'
import { App } from '../../services/Apps'
import Chat from '../../components/chat'
import usePaintAppsStore, { PaintAppState } from '../../stores/paintStore'
import { ChatContextProvider } from '../../hooks/chat-context'
import './ChatPanel.css'

type ChatPanelProps = {
  appId: number
  app: PaintAppState
}
const ChatPanel = (props: ChatPanelProps) => {
  const { appId, app } = props
  const contentRef = useRef<HTMLIonContentElement>(null)
  const [inputText, setInputText] = useState<string>()

  const [aspectRatio, setAspectRatio] = useState<string>(
    localStorage.getItem(`aspectRatio_${appId}`) || '1:1'
  )

  const { responding, chatItems } = app
  const { send, stop } = usePaintAppsStore()
  // Add state at the top of component
  const [isScrolling, setIsScrolling] = useState(false)
  const modal = useRef<HTMLIonModalElement>(null)
  const [showToast] = useIonToast()

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300)
    }
  }, [chatItems.length])

  const onScroll = (e: CustomEvent) => {
    console.log('Scroll event fired')
  }
  const onScrollStart = (e: CustomEvent) => {
    // setIsScrolling(true)
  }
  const onScrollEnd = (e: CustomEvent) => {
    // setIsScrolling(false)
  }

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
          await send(appId, tempText, {
            aspectRatio,
          })
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

  const handleAspectRatioChange = (value: string) => {
    setAspectRatio(value)
    modal.current?.dismiss()
    localStorage.setItem(`aspectRatio_${appId}`, value)
  }

  return (
    <>
      <IonContent
        fullscreen
        ref={contentRef}
        scrollEvents={true}
        onIonScrollStart={onScrollStart}
        onIonScrollEnd={onScrollEnd}
        onIonScroll={onScroll}
        id="chat-container"
      >
        <div className="mb-16" id="chat-inner-container">
          <ChatContextProvider
            appId={appId}
            conversationId={app.conversationId}
          >
            <Chat items={chatItems} />
          </ChatContextProvider>
        </div>
      </IonContent>
      <IonFooter
        style={{
          background: 'var(--ion-background-color, #fff)',
        }}
        className={`ion-padding pb-4 px-4 transition-all duration-200 ${isScrolling ? 'opacity-0 translate-y-full' : 'opacity-100'}`}
      >
        <div className="flex w-full overflow-x-auto hide-scrollbar">
          <div className="flex gap-2">
            <IonButton
              size="small"
              color={'light'}
              id="open-modal"
              className="!m-0"
            >
              {aspectRatio}
            </IonButton>
          </div>
        </div>
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

      <IonModal
        ref={modal}
        trigger="open-modal"
        initialBreakpoint={0.5}
        breakpoints={[0, 0.25, 0.5, 0.75]}
      >
        <IonContent className="ion-padding">
          <IonRadioGroup
            value={aspectRatio}
            onIonChange={e => handleAspectRatioChange(e.detail.value)}
          >
            <IonItem>
              <IonRadio value="1:1">
                {/* 1:1 rectangle */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border-[1px] border-gray-300 rounded-md" />
                  <IonLabel>1:1</IonLabel>
                </div>
              </IonRadio>
            </IonItem>
            <IonItem>
              <IonRadio value="4:3">
                <div className="flex items-center gap-2">
                  <div className="w-[40px] h-[30px] border-[1px] border-gray-300  rounded-md" />
                  <IonLabel>4:3</IonLabel>
                </div>
              </IonRadio>
            </IonItem>
            <IonItem>
              <IonRadio value="16:9">
                <div className="flex items-center gap-2">
                  <div className="w-[40px] h-[22px] border-[1px] border-gray-300  rounded-md" />
                  <IonLabel>16:9</IonLabel>
                </div>
              </IonRadio>
            </IonItem>

            <IonItem>
              <IonRadio value="9:16">
                <div className="flex items-center gap-2">
                  <div className="w-[22px] h-[40px] border-[1px] border-gray-300  rounded-md" />
                  <IonLabel>9:16</IonLabel>
                </div>
              </IonRadio>
            </IonItem>
          </IonRadioGroup>
        </IonContent>
      </IonModal>
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
