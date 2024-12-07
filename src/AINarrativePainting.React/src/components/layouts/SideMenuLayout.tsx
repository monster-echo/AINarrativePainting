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
} from '@ionic/react'
import { homeOutline } from 'ionicons/icons'
import React from 'react'
import { AppTitle } from '../../utils/consts'

export const SideMenuLayout = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string | React.ReactNode
}) => {
  return (
    <IonPage>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar className="min-h-16 flex flex-col items-center justify-center">
            <IonTitle>{AppTitle}</IonTitle>
          </IonToolbar>

          {/* <div className="flex flex-row p-4 w-full justify-center ">
            <IonItem>
              <IonAvatar slot="start" class="h-16 w-16">
                <img
                  alt="Silhouette of a person's head"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
              <IonLabel class="text-lg font-semibold whitespace-nowrap">
                Item Avatar
              </IonLabel>
            </IonItem>
          </div> */}
        </IonHeader>
        <IonContent>
          <IonList>
            <IonMenuToggle autoHide={false}>
              <IonItem routerLink="/home">
                <IonIcon slot="start" icon={homeOutline} />
                <IonLabel>Home</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
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
