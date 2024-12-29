import {
  IonGrid,
  IonRow,
  IonAvatar,
  IonText,
  IonRippleEffect,
  IonItem,
  IonButton,
  IonCard,
  IonCardContent,
} from '@ionic/react'

export interface TileCardProps {
  /**
   * The title of the tile card
   */
  title: string

  /**
   * The avatar of the tile card
   */
  avatar: string

  onClick?: () => void

  image: string

  link?: string
}

export const TileCard = (props: TileCardProps) => {
  const { title, image, avatar, link, onClick } = props
  return (
    <IonCard
      className="rounded-md m-0 p-2 "
      routerLink={link}
      onClick={() => onClick && onClick()}
    >
      <IonCardContent className="m-0 p-0">
        <div className=" flex flex-col ion-activatable ripple-parent rectangle gap-2">
          <div className="relative flex-none w-32 h-32 rounded-md  flex items-center overflow-hidden ">
            <IonRippleEffect></IonRippleEffect>
            <img
              className="rounded-md w-full h-full object-cover"
              src={image}
            ></img>
          </div>
          <div className="flex gap-2 flex-row  items-center ">
            <IonAvatar className="w-6 h-6 content-center overflow-hidden">
              <img src={avatar} className="w-full h-full object-cover" />
            </IonAvatar>
            <IonText>{title}</IonText>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  )
}
