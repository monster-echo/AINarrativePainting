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

export const Home = () => {
  const [present] = useIonToast()

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
              <TileCard
                title="文生图"
                avatar="http://localhost:3000/assets/text2img/avatar.png"
                image="http://localhost:3000/assets/text2img/background.png"
                link="/paint/txt2img"
              ></TileCard>

              <TileCard
                title="图生图"
                avatar="http://localhost:3000/assets/img2img/avatar.png"
                image="http://localhost:3000/assets/img2img/background.png"
                link="/paint/img2img"
              ></TileCard>
            </div>
          </div>
        </IonCardContent>
      </IonCard>
    </SideMenuLayout>
  )
}
