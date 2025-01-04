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
      className="rounded-md m-0 "
      routerLink={link}
      onClick={() => onClick && onClick()}
    >
      <IonCardContent className="m-0 p-0">
        <div className="w-36 flex flex-col ion-activatable ripple-parent rectangle gap-2">
          <div className="relative flex-none h-32 rounded-t-md  flex items-center overflow-hidden ">
            <IonRippleEffect></IonRippleEffect>
            <img
              title="image"
              className="w-full h-full object-cover"
              src={image}
            ></img>
          </div>
          <div className="flex gap-2 flex-row  items-center p-2">
            {/* <IonAvatar className="w-6 h-6 content-center overflow-hidden">
              <img
                title="avatar"
                src={avatar}
                className="w-full h-full object-cover"
              />
            </IonAvatar> */}
            <IonText className=" whitespace-nowrap">{title}</IonText>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  )
}
