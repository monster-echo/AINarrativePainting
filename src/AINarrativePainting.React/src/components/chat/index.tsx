import { memo } from 'react'
import 'react-photo-view/dist/react-photo-view.css'

import { ChatItem } from '../../types/type'
import Answer from './Answer'
import Question from './Question'
import { IonButton, IonIcon } from '@ionic/react'
import { PhotoProvider } from 'react-photo-view'
import { downloadSharp, refresh } from 'ionicons/icons'

type ChatProps = {
  items: ChatItem[]
}

const Chat = (props: ChatProps) => {
  const { items } = props

  const download = (url?: string) => {
    if (!url) return
    const a = document.createElement('a')
    a.style.display = 'none'
    a.download = 'download'
    a.href = url
    a.click()
  }

  return (
    <PhotoProvider
      toolbarRender={({ images, index, rotate, onRotate }) => {
        return (
          <div className="flex ">
            <IonButton
              size="small"
              fill="clear"
              color={'light'}
              onClick={() => onRotate(rotate + 90)}
            >
              <IonIcon icon={refresh}></IonIcon>
            </IonButton>
            {/* <IonButton
              size="small"
              fill="clear"
              color={'light'}
              onClick={() => download(images[index].src)}
            >
              <IonIcon icon={downloadSharp}></IonIcon>
            </IonButton> */}
          </div>
        )
      }}
    >
      <div className="flex flex-col w-full gap-4 p-4">
        {items.map((item, index) => {
          if (item.isAnswer) {
            return <Answer key={index} item={item}></Answer>
          }
          return <Question key={item.id} item={item}></Question>
        })}
      </div>
    </PhotoProvider>
  )
}

export default memo(Chat)
