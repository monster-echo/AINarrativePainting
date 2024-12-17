import { IonContent, IonPage } from '@ionic/react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect, useState } from 'react'
import supabase from '../../services/auth/supabase-auth'
import { AppTitle } from '../../utils/consts'
import { useAuthStore } from '../../stores/authStore'

const Login = (props: any) => {
  const { session, setSession } = useAuthStore()
  const returnUrl =
    new URLSearchParams(window.location.search).get('returnUrl') ?? '/'

  useEffect(() => {
    const subscribe = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })
    return () => {
      subscribe.data.subscription.unsubscribe()
    }
  }, [])

  return (
    <IonPage>
      <IonContent className="ion-padding ">
        <div className="">
          <div className="text-center mt-32">
            <h3 className="text-lg font-semibold">{AppTitle}</h3>
            {returnUrl}
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
            redirectTo={returnUrl}
          />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Login
