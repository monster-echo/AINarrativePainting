import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  useIonToast,
} from '@ionic/react'
import { SideMenuLayout } from '../../components/layouts/SideMenuLayout'
import { TileCard } from '../../components/TileCard'
import { AppTitle } from '../../utils/consts'
import { API_ASSETS_PREFIX } from '../../config'
import { useHomeStore } from '../../stores/homeStore'
import { useEffect } from 'react'
import usePaintAppsStore from '../../stores/paintStore'

export const Home = () => {
  const [present] = useIonToast()
  const { apps, initApps } = useHomeStore()

  const { init } = usePaintAppsStore()

  useEffect(() => {
    const load = async () => {
      const apps = await initApps()
      await init(apps.map(app => app.id))
    }

    load()
  }, [initApps, init])

  return (
    <SideMenuLayout title={AppTitle}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>AI 画✍️</IonCardTitle>
          <IonCardSubtitle>发挥你的创造力，创作属于你的作品</IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
          <div className="flex overflow-x-auto w-full hide-scrollbar">
            <div className="flex gap-4 ">
              {apps.map(app => (
                <TileCard
                  key={app.id}
                  title={app.name}
                  avatar={`${API_ASSETS_PREFIX}/${app.avatar}`}
                  image={`${API_ASSETS_PREFIX}/${app.image}`}
                  link={`/paint/${app.id}`}
                ></TileCard>
              ))}
            </div>
          </div>
        </IonCardContent>
      </IonCard>
    </SideMenuLayout>
  )
}
