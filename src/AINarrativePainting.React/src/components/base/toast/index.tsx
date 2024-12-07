import { IonToast } from '@ionic/react'
import { createRoot } from 'react-dom/client'

const Toast = {
  notify: ({
    message,
    duration = 2000,
    position = 'bottom',
    type = '',
  }: {
    message: string
    duration?: number
    position?: 'top' | 'bottom' | 'middle'
    type?: string
  }) => {
    if (typeof window === 'object') {
      const holder = document.createElement('div')
      const root = createRoot(holder)
      root.render(
        <IonToast
          isOpen={true}
          position={position}
          color={type}
          message={message}
          duration={duration}
        ></IonToast>
      )
      document.body.appendChild(holder)
      setTimeout(() => {
        if (holder) holder.remove()
      }, duration)
    }
  },
}

export default Toast
