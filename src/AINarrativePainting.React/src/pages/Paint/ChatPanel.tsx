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
import {
  stopSharp,
  sendSharp,
  cloudUploadSharp,
  attachSharp,
} from 'ionicons/icons'
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { App } from '../../services/Apps'
import Chat from '../../components/chat'
import usePaintAppsStore, { PaintAppState } from '../../stores/paintStore'
import { ChatContextProvider } from '../../hooks/chat-context'
import './ChatPanel.css'
import { AppContext, AppContextProvider } from '../../hooks/app.context'
import { uploadFile } from '../../services/Conversations'

type ChatPanelProps = {
  appId: number
  app: PaintAppState
}
const ChatPanel = (props: ChatPanelProps) => {
  const { appId, app } = props

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { app: appInfo } = useContext(AppContext)
  const contentRef = useRef<HTMLIonContentElement>(null)
  const [inputText, setInputText] = useState<string>()
  const [file, setFile] = useState<File>()

  const [fileId, setFileId] = useState<string>()

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

  const handleSend = async (text?: string) => {
    if (responding) {
      await stop(appId)
    } else {
      if (text != undefined) {
        console.log('inputText:', text)
        const tempText = text.trim()
        if (tempText.length === 0) {
          return
        }
        try {
          const files = fileId
            ? [
                {
                  type: 'image',
                  transfer_method: 'local_file',
                  upload_file_id: fileId,
                },
              ]
            : []
          await send(
            appId,
            tempText,
            {
              aspectRatio,
              fileUrl: file ? URL.createObjectURL(file) : undefined,
            },
            files
          )
          setFile(undefined)
          setFileId(undefined)
          setInputText('')
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
      handleSend(inputText)
    }
  }

  const handleAspectRatioChange = (value: string) => {
    setAspectRatio(value)
    modal.current?.dismiss()
    localStorage.setItem(`aspectRatio_${appId}`, value)
  }

  const handleUploadImage = async (file?: File) => {
    if (!file) {
      return
    }
    try {
      setFile(file)
      const result = await uploadFile(appId, file, e => {})
      showToast({
        message: '上传成功',
        duration: 2000,
        position: 'top',
      })
      const fileId = result.id
      setFileId(fileId)
    } catch (e) {
      console.error(e)
      setFile(undefined)
      setFileId(undefined)
      showToast('上传失败', 2000)
    }
  }

  const handleChooseFile = (e: any) => {
    fileInputRef.current?.click()
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
        <div className="flex w-full overflow-x-auto hide-scrollbar items-end">
          {appInfo && (
            <div className="flex gap-2 items-end">
              {appInfo.features.includes('aspect_ratio') && (
                <IonButton size="small" color={'light'} id="open-modal">
                  {aspectRatio}
                </IonButton>
              )}

              {appInfo.features.includes('image_upload') && (
                <>
                  <input
                    type="file"
                    placeholder="选择图片"
                    multiple={false}
                    accept="image/*"
                    hidden
                    ref={fileInputRef}
                    onChange={e => handleUploadImage(e.target.files?.[0])}
                  ></input>
                  {
                    <IonButton
                      color={'light'}
                      className="!m-0"
                      onClick={handleChooseFile}
                    >
                      <IonIcon icon={attachSharp} />
                      选择图片
                    </IonButton>
                  }
                  {file && (
                    <IonImg
                      src={URL.createObjectURL(file)}
                      className="w-16 object-center"
                    />
                  )}
                </>
              )}
            </div>
          )}

          {!appInfo?.features.includes('text') && (
            <IonButton
              fill="clear"
              color={'secondary'}
              slot="end"
              disabled={file && fileId ? false : true}
              onClick={() => handleSend('empty')}
              className="ml-auto"
            >
              {responding ? (
                <IonIcon icon={stopSharp}></IonIcon>
              ) : (
                <IonIcon icon={sendSharp}></IonIcon>
              )}
            </IonButton>
          )}
        </div>
        {appInfo?.features.includes('text') && (
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
              onClick={() => handleSend(inputText)}
            >
              {responding ? (
                <IonIcon icon={stopSharp}></IonIcon>
              ) : (
                <IonIcon icon={sendSharp}></IonIcon>
              )}
            </IonButton>
          </IonInput>
        )}
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
    return <div>加载中.12..</div>
  }

  return (
    <AppContextProvider app={props.app}>
      <ChatPanel appId={id} app={app} />
    </AppContextProvider>
  )
}

export default memo(ChatAppPanel)
