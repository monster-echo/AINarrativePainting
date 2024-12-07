import { IonCard, IonCardContent, IonSpinner } from '@ionic/react'
import { ChatItem } from '../../types/type'

const Answer = ({ item }: { item: ChatItem }) => {
  return (
    <div className="flex justify-start ">
      <IonCard className="m-0 relative">
        <IonCardContent>
          {item.content === '...' && (
            <IonSpinner className="m-0" name="dots"></IonSpinner>
          )}
          {item.content !== '...' && <div className="">{item.content}</div>}
        </IonCardContent>
      </IonCard>
    </div>
  )
}

export default Answer
