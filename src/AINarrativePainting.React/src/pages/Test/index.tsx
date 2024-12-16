import { IonContent, IonPage } from '@ionic/react'
import { API_PREFIX } from '../../config'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect, useState } from 'react'
import supabase from '../../services/auth/supabase-auth'
import { AppTitle } from '../../utils/consts'

const Test = () => {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      setSession(session)
    }

    load()
  }, [])

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['github']}
        view="sign_in"
        redirectTo={window.location.origin}
      />
    )
  } else {
    return (
      <IonPage>
        <IonContent className="ion-padding ">
          <div className="">
            <div className="text-center mt-32">
              <h3 className="text-lg font-semibold">{AppTitle}</h3>
            </div>

            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {},
                },
              }}
              localization={{
                variables: {},
              }}
              providers={['github']}
              redirectTo={window.location.origin}
            />
          </div>
        </IonContent>
      </IonPage>
    )
  }
}

export default Test
