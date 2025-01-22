import {
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  useIonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonSkeletonText,
} from '@ionic/react'
import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons'
import { BackLayout } from '../../components/layouts/BackLayout'
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { App as AppInfo, getApp } from '../../services/Apps'
import { getMessages } from '../../services/chat'

const ChatPanelSkeleton = () => {
  const items = [1, 2]

  const randomWidth = () => {
    const widths = [
      'w-1/2',
      'w-1/3',
      'w-2/3',
      'w-3/4',
      'w-2/5',
      'w-3/5',
      'w-4/5',
      'w-5/6',
    ]
    return widths[Math.floor(Math.random() * widths.length)]
  }

  var randomHeight = () => {
    const heights = ['h-6', 'h-8', 'h-10', 'h-12', 'h-16', 'h-20', 'h-24']
    return heights[Math.floor(Math.random() * heights.length)]
  }

  return (
    <IonContent>
      <div className="flex flex-col gap-2 p-2">
        {items.map(i => {
          const answerWidth = randomWidth()
          let answerHeight = randomHeight()
          if (answerWidth != 'w-5/6') {
            answerHeight = 'h-6'
          }

          return (
            <div className="flex flex-col gap-2" key={i}>
              <IonSkeletonText
                animated
                className={`${randomWidth()} h-6 rounded-md ml-auto`}
              />
              <IonSkeletonText
                animated
                className={`${answerWidth} ${answerHeight} rounded-md`}
              />
            </div>
          )
        })}
      </div>
    </IonContent>
  )
}

const ChatPanel = ({ app }: { app: AppInfo }) => {
  const [messages, setMessages] = useState([])
  const [toast] = useIonToast()
  useEffect(() => {
    const load = async () => {
      try {
        setMessages(await getMessages({ appId: app.id }))
      } catch (error) {
        toast('加载消息失败', 2000)
      }
    }
    load()
  }, [])
  return <>123</>
}

const App = () => {
  const { appid } = useParams<{ appid: string }>()
  const [message] = useIonToast()
  const [loading, setLoading] = useState(false)
  const [app, setApp] = useState<AppInfo>()
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setApp(await getApp(appid))
      } catch (error) {
        message('加载程序失败', 2000)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [appid])

  const handleResetScreen = () => {}

  return (
    <BackLayout
      title={
        <>
          {loading ? (
            <IonSkeletonText animated className="w-1/2 h-6 mx-auto" />
          ) : (
            <>{app?.name}</>
          )}
        </>
      }
      primary={
        <IonButtons slot="end">
          <IonButton id="popover-button">
            <IonIcon
              slot="icon-only"
              ios={ellipsisHorizontal}
              md={ellipsisVertical}
            ></IonIcon>
          </IonButton>
        </IonButtons>
      }
    >
      <IonPopover trigger="popover-button" dismissOnSelect={true}>
        <IonContent>
          <IonList>
            <IonItem button={true} detail={false} onClick={handleResetScreen}>
              清屏(清空所有消息)
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>

      {loading && <ChatPanelSkeleton></ChatPanelSkeleton>}

      {!loading && <ChatPanel app={app!}></ChatPanel>}
    </BackLayout>
  )
}

export default App
