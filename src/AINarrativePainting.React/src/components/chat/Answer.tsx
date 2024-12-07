import { IonCard, IonCardContent } from '@ionic/react'
import { ChatItem } from '../../types/type'

const Answer = ({ item }: { item: ChatItem }) => {
  return (
    <div className="flex justify-start ">
      <IonCard className="m-0 relative">
        <IonCardContent>
          <div className="">{item.content}</div>
        </IonCardContent>
      </IonCard>
    </div>
  )
}

export default Answer
