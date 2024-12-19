import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css'

/* Theme variables */
import './theme/variables.css'
import { useCallback, useEffect } from 'react'

import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import PaintPage from './pages/Paint'
import ProtectedRoute from './components/routes/ProtectedRoute'
import Login from './pages/Login'
import Test from './pages/Test'
import usePaintAppsStore from './stores/paintStore'
import { useAuthStore } from './stores/authStore'
import supabase from './services/auth/supabase-auth'
import { useHomeStore } from './stores/homeStore'
import React from 'react'
import AppLoading from './components/base/loading/AppLoading'

setupIonicReact()

interface HybridWebViewEvent extends CustomEvent {
  detail: {
    message: string
  }
}

const App: React.FC = () => {
  // Define handler outside useEffect to maintain reference
  const handleHybridMessage = useCallback((event: HybridWebViewEvent) => {
    try {
      console.log('HybridWebViewMessageReceived:', event.detail.message)
      // Handle the message here
    } catch (error) {
      console.error('Error handling HybridWebView message:', error)
    }
  }, [])

  useEffect(() => {
    window.addEventListener(
      'HybridWebViewMessageReceived',
      handleHybridMessage as EventListener
    )

    return () => {
      window.removeEventListener(
        'HybridWebViewMessageReceived',
        handleHybridMessage as EventListener
      )
    }
  }, [handleHybridMessage])
  const { initApps } = useHomeStore()
  const { init } = usePaintAppsStore()

  const { setSession } = useAuthStore()

  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    const load = async () => {
      const apps = await initApps()
      await init(apps.map(app => app.id))
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (!error && session) {
        setSession(session)
      }
    }

    load().then(() => setLoading(false))
  }, [initApps, init])

  return (
    <IonApp>
      {loading && <AppLoading></AppLoading>}
      {!loading && (
        <IonReactRouter>
          <IonRouterOutlet>
            {/* <ProtectedRoute path="/home" component={Home} exact /> */}
            <Route path="/home" component={Home} exact />
            <Route path="/test" component={Test} exact />
            <Route path="/login" component={Login} />
            <Route path="/404" component={NotFound} exact />
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route path="/paint/:appid" component={PaintPage} />
            {/* <Route render={() => <Redirect to="/404" />} /> */}
          </IonRouterOutlet>
        </IonReactRouter>
      )}
    </IonApp>
  )
}

export default App
