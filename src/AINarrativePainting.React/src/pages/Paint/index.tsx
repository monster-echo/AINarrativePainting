import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPopover,
  useIonToast,
} from '@ionic/react'
import { useParams } from 'react-router'
import { BackLayout } from '../../components/layouts/BackLayout'
import { useEffect, useState } from 'react'
import { useHomeStore } from '../../stores/homeStore'
import { App } from '../../services/Apps'
import ChatPanel from './ChatPanel'
import {
  checkmarkCircleSharp,
  closeCircleSharp,
  ellipsisHorizontal,
  ellipsisVertical,
} from 'ionicons/icons'
import usePaintAppsStore from '../../stores/paintStore'

const PaintPage = () => {
  const { appid } = useParams<{ appid: string }>()
  const [app, setApp] = useState<App>()
  const { initApps } = useHomeStore()
  const { reset } = usePaintAppsStore()
  const [showToast] = useIonToast()

  useEffect(() => {
    initApps().then(apps => {
      const app = apps.find(app => app.id === parseInt(appid))
      if (app) {
        setApp(app)
      }
    })
  }, [appid])

  const handleResetScreen = async () => {
    try {
      reset(parseInt(appid))

      await showToast({
        icon: checkmarkCircleSharp,
        message: '清屏成功',
        duration: 2000,
      })
    } catch (error) {
      await showToast({
        icon: closeCircleSharp,
        message: '清屏失败',
        duration: 2000,
      })
    }
  }

  if (app === undefined) {
    return (
      <BackLayout title="加载中...">
        <IonContent fullscreen>
          <div className="mb-16">
            {/* <Chat items={chatItems} /> */}
            加载中...
          </div>
        </IonContent>
      </BackLayout>
    )
  }

  return (
    <BackLayout
      title={app.name}
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
      <ChatPanel app={app}></ChatPanel>
    </BackLayout>
  )
}

export default PaintPage
