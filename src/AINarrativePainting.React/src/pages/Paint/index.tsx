import { IonContent } from '@ionic/react'
import { useParams } from 'react-router'
import { BackLayout } from '../../components/layouts/BackLayout'
import { useEffect, useState } from 'react'
import { useHomeStore } from '../../stores/homeStore'
import { App } from '../../services/Apps'
import ChatPanel from './ChatPanel'

const PaintPage = () => {
  const { appid } = useParams<{ appid: string }>()
  const [app, setApp] = useState<App>()
  const { initApps } = useHomeStore()
  useEffect(() => {
    initApps().then(apps => {
      const app = apps.find(app => app.id === parseInt(appid))
      if (app) {
        setApp(app)
      }
    })
  }, [appid])

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
    <BackLayout title={app.name}>
      <ChatPanel app={app}></ChatPanel>
    </BackLayout>
  )
}

export default PaintPage
