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
import Toast from '../../components/base/toast'
import { getConversations } from '../../services/Conversations'
import { API_ASSETS_PREFIX } from '../../config'
import { useHomeStore } from '../../stores/homeStore'
import { useEffect } from 'react'

export const Home = () => {
  const [present] = useIonToast()
  const { apps, initApps } = useHomeStore()

  useEffect(() => {
    initApps()
  }, [])

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
