import { IonContent, IonPage } from '@ionic/react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from '../../services/auth/supabase-auth'
import { AppTitle } from '../../utils/consts'

const Test = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding ">
        <div className="">
          <div className="text-center mt-32">
            <h3 className="text-lg font-semibold">{AppTitle}</h3>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Test
