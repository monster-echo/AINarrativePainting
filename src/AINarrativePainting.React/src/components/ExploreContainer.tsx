import { IonButton } from "@ionic/react"
import "./ExploreContainer.css"

import {
  showToast,
  showSnackbar,
  getStringValue,
  setStringValue,
} from "../services/NativeService"

interface ContainerProps {
  name: string
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const handleShowToast = async () => {
    await showToast("Hello from Ionic React")
  }

  const handleShowSnackbar = async () => {
    await showSnackbar("Hello from Ionic React")
  }

  const handleGetStringValue = async () => {
    const value = await getStringValue("key")
    debugger

    await showToast(`Value: ${value}`)
  }

  const handleSetStringValue = async () => {
    await setStringValue("key", "value")
  }

  return (
    <div className="container">
      <strong>{name}</strong>
      <p>Explore</p>

      <div>
        <IonButton onClick={handleShowToast}>Show toast </IonButton>
        <IonButton onClick={handleShowSnackbar}>Show snackbar</IonButton>

        <IonButton onClick={handleGetStringValue}>Get string value</IonButton>
        <IonButton onClick={handleSetStringValue}>Set string value</IonButton>
      </div>
    </div>
  )
}

export default ExploreContainer
