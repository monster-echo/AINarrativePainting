import { IonApp, IonLoading } from '@ionic/react'

const AppLoading: React.FC = () => {
  return (
    <IonApp>
      <IonLoading isOpen={true} message={'Loading...'} />
    </IonApp>
  )
}

export default AppLoading
