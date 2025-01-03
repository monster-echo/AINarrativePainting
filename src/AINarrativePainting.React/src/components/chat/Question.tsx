import { IonCard, IonCardContent } from '@ionic/react'
import { ChatItem } from '../../types/type'
import { memo, useContext } from 'react'
import { PhotoView } from 'react-photo-view'
import Image from '../base/image'
import { API_PREFIX } from '../../config'
import { AppContext } from '../../hooks/app.context'

const getFileUrl = (files: any) => {
  if (!files || files.length === 0) {
    return undefined
  }

  const url = files[0].url

  if (url.startsWith('blob')) {
    return url
  }

  return `${API_PREFIX}${url}`
}

const Question = ({ item }: { item: ChatItem }) => {
  const files = item.message_files
  const { app: appInfo } = useContext(AppContext)

  const fileUrl = getFileUrl(files)

  return (
    <div className="flex justify-end">
      <IonCard className="m-0">
        <IonCardContent className="p-0">
          {fileUrl && (
            <>
              <Image src={fileUrl} className="w-32" />
            </>
          )}
          {appInfo?.features.includes('text') && (
            <div className="text-right p-2">{item.content}</div>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  )
}

export default memo(Question)
