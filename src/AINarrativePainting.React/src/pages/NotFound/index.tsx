import { IonGrid, IonRow, IonText } from '@ionic/react'
import { BackLayout } from '../../components/layouts/BackLayout'

export const NotFound = () => {
  return (
    <BackLayout title={'404'}>
      <IonGrid>
        <IonRow>
          <IonText>Not Found</IonText>
        </IonRow>
      </IonGrid>
    </BackLayout>
  )
}
