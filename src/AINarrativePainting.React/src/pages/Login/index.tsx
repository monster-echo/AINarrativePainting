import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
} from '@ionic/react'
import { logInSharp, logoApple, logoGoogle } from 'ionicons/icons'
import { AppTitle } from '../../utils/consts'

const LoginPage = () => {
  return (
    <IonPage>
      <IonContent>
        <div className="mt-48">
          <IonCard className="m-4 p-4">
            <IonCardTitle className="text-center">{AppTitle}</IonCardTitle>
            <IonCardContent>
              <IonItem className="mb-4">
                <IonInput
                  label="用户名"
                  labelPlacement="floating"
                  placeholder="填写用户名"
                  name="username"
                  type="text"
                />
              </IonItem>
              <IonItem className="mb-4">
                <IonInput
                  label="密码"
                  name="password"
                  labelPlacement="floating"
                  placeholder="填写密码"
                  type="password"
                />
              </IonItem>

              {/* forget password */}
              <IonButton
                size="small"
                fill="clear"
                className="float-end mb-4"
                onClick={() => {
                  // forgetPassword()
                }}
              >
                忘记密码?
              </IonButton>

              <IonButton
                color={'light'}
                expand="block"
                className="mx-4"
                onClick={() => {
                  // signIn()
                }}
              >
                <IonIcon
                  icon={logInSharp}
                  slot="end"
                  className="text-gray-500"
                />
                登录
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
      <IonFooter className="my-16 flex  justify-center ">
        <IonButton fill="clear" color={'dark'}>
          <IonIcon icon={logoApple} />
        </IonButton>
        <IonButton fill="clear" color={'success'} onClick={() => {}}>
          <IonIcon icon={logoGoogle} />
        </IonButton>
      </IonFooter>
    </IonPage>
  )
}

export default LoginPage
