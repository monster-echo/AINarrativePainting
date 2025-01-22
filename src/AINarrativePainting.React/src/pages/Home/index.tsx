import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  useIonToast,
  IonSkeletonText,
} from '@ionic/react'
import { PhotoProvider } from 'react-photo-view'
import { SideMenuLayout } from '../../components/layouts/SideMenuLayout'
import { AppTitle } from '../../utils/consts'
import { useState, useEffect } from 'react'
import { TileCard } from '../../components/TileCard'
import { API_ASSETS_PREFIX } from '../../config'
import ApiClient, { AppDefinitionApiClient } from '../../services/api'
import { App } from '../../services/Apps'

const Home = () => {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(false)
  const [message] = useIonToast()

  const appsClient = new AppDefinitionApiClient()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setApps(await appsClient.getLists())
        setApps([...apps])
      } catch (error) {
        message('加载程序失败', 2000)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  return (
    <SideMenuLayout title={AppTitle}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{'AI 画✍️'}</IonCardTitle>
          <IonCardSubtitle>发挥你的创造力，创作属于你的作品</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent className="p-0">
          <div className="flex overflow-x-auto w-full hide-scrollbar">
            {loading &&
              [1, 2, 3].map(i => (
                <div className="flex gap-0" key={i}>
                  <IonCard>
                    <IonCardContent className="m-0 p-0">
                      <IonCardContent className="m-0 p-0">
                        <div className="w-36 flex flex-col ion-activatable ripple-parent rectangle gap-2">
                          <div className="relative flex-none h-32 rounded-t-md  flex items-center overflow-hidden ">
                            <IonSkeletonText
                              animated
                              className="w-full h-full"
                            />
                          </div>
                          <div className="flex rounded-md flex-row  items-center px-2 pb-2">
                            <IonSkeletonText
                              animated
                              className="m-0 h-6"
                            ></IonSkeletonText>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCardContent>
                  </IonCard>
                </div>
              ))}
            {!loading && (
              <div className="flex gap-0">
                {apps.map(app => (
                  <TileCard
                    key={app.id}
                    title={app.name}
                    avatar={`${API_ASSETS_PREFIX}/${app.avatar}`}
                    image={`${API_ASSETS_PREFIX}/${app.image}`}
                    link={`/app/${app.id}`}
                  ></TileCard>
                ))}
              </div>
            )}
          </div>
        </IonCardContent>
      </IonCard>

      <div className="px-4 pb-32 min-h-full">
        <PhotoProvider>
          <div className="grid grid-cols-2 gap-4"></div>
        </PhotoProvider>
      </div>

      {/* app version  */}
      <div className="flex justify-center items-center text-gray-400/90 p-4 gap-2">
        <span>{AppTitle}</span>
        <span className="text-sm">{import.meta.env.VITE_APP_VERSION}</span>
        <span className="text-sm">© 2024</span>
      </div>
    </SideMenuLayout>
  )
}

export default Home
