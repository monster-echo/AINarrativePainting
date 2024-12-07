import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'

export const BackLayout = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="min-h-16 justify-center flex items-center">
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      {children}
    </IonPage>
  )
}
