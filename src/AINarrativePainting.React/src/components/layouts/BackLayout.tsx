import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons'

export const BackLayout = ({
  children,
  title,
  primary,
}: {
  children: React.ReactNode
  primary?: React.ReactNode
  title: React.ReactNode
}) => {
  return (
    <IonPage className="">
      <IonHeader>
        <IonToolbar className="min-h-16 justify-center flex items-center">
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          {primary}
        </IonToolbar>
      </IonHeader>
      {children}
    </IonPage>
  )
}