import { IonCard, IonCardContent } from '@ionic/react'
import { ChatItem } from '../../types/type'
import { memo } from 'react'

const Question = ({ item }: { item: ChatItem }) => {
  return (
    <div className="flex justify-end">
      <IonCard className="m-0">
        <IonCardContent>
          <div className="text-right">{item.content}</div>
        </IonCardContent>
      </IonCard>
    </div>
  )
}

export default memo(Question)
