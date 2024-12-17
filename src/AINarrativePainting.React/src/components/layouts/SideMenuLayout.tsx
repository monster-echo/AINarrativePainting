import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonAvatar,
  IonLabel,
  IonContent,
  IonList,
  IonMenuToggle,
  IonIcon,
  IonApp,
  IonPage,
  IonButtons,
  IonMenuButton,
  IonRippleEffect,
  IonCard,
  IonCardContent,
  IonFooter,
  IonButton,
  IonAlert,
  useIonAlert,
} from '@ionic/react'
import { homeOutline, logOutOutline } from 'ionicons/icons'
import React from 'react'
import { AppTitle } from '../../utils/consts'
import { useAuthStore } from '../../stores/authStore'
import supabase from '../../services/auth/supabase-auth'

export const SideMenuLayout = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string | React.ReactNode
}) => {
  const { session, setSession } = useAuthStore()
  const [presentAlert] = useIonAlert()

  const avatarUrl =
    session?.user?.user_metadata.avatar_url ??
    'https://ionicframework.com/docs/img/demos/avatar.svg'

  const handleLogout = async () => {
    await presentAlert({
      header: '注销',
      message: '确定要注销吗？',
      buttons: [
        '取消',
        {
          text: '确定',
          handler: async () => {
            await supabase.auth.signOut()
            setSession(null)
          },
        },
      ],
    })
  }

  return (
    <IonPage>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar className="min-h-16 flex flex-col items-center justify-center">
            <IonTitle>{AppTitle}</IonTitle>
          </IonToolbar>

          {session && (
            <div className="flex flex-col items-center gap-2 p-4 w-full justify-center relative">
              <IonAvatar class="h-16 w-16">
                <img alt="user avatar" src={avatarUrl} />
              </IonAvatar>
              <IonLabel class="text-lg font-semibold whitespace-nowrap overflow-x-hidden overflow-ellipsis">
                {session?.user.email}
              </IonLabel>
            </div>
          )}

          {!session && (
            <IonButton fill="clear" className="w-full" routerLink="/login">
              <div className="flex flex-col items-center gap-2 p-4 justify-center relative">
                <IonAvatar class="h-16 w-16">
                  <img alt="user avatar" src={avatarUrl} />
                </IonAvatar>
                <IonLabel class="text-lg font-semibold whitespace-nowrap overflow-x-hidden overflow-ellipsis">
                  请登录
                </IonLabel>
              </div>
            </IonButton>
          )}
        </IonHeader>
        <IonFooter>
          {session && (
            <IonButton
              color={'medium'}
              fill="clear"
              className="m-4 float-end"
              onClick={handleLogout}
            >
              注销
              <IonIcon icon={logOutOutline} slot="end"></IonIcon>
            </IonButton>
          )}
        </IonFooter>
      </IonMenu>
      <IonHeader>
        <IonToolbar className="min-h-16 justify-center flex items-center">
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle> {title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent id="main-content">{children}</IonContent>
    </IonPage>
  )
}
