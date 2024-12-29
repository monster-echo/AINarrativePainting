import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  useIonToast,
} from '@ionic/react'
import { SideMenuLayout } from '../../components/layouts/SideMenuLayout'
import { TileCard } from '../../components/TileCard'
import { AppTitle } from '../../utils/consts'
import { API_ASSETS_PREFIX } from '../../config'
import { useHomeStore } from '../../stores/homeStore'
import { useEffect } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'

export const Home = () => {
  const { apps, images, loadImages } = useHomeStore()

  useEffect(() => {
    // loadImages()
  }, [])

  const imageGroup1 = images.filter((_, index) => index % 2 === 0)
  const imageGroup2 = images.filter((_, index) => index % 2 === 1)

  return (
    <SideMenuLayout title={AppTitle}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>AI 画✍️</IonCardTitle>
          <IonCardSubtitle>发挥你的创造力，创作属于你的作品</IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
          <div className="flex overflow-x-auto w-full hide-scrollbar">
            <div className="flex gap-4">
              {apps.map(app => (
                <TileCard
                  key={app.id}
                  title={app.name}
                  avatar={`${API_ASSETS_PREFIX}/${app.avatar}`}
                  image={`${API_ASSETS_PREFIX}/${app.image}`}
                  link={`/paint/${app.id}`}
                ></TileCard>
              ))}
            </div>
          </div>
        </IonCardContent>
      </IonCard>
      <div className="px-4 pb-32 min-h-full">
        <PhotoProvider>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4 overflow-hidden">
              {imageGroup1.map((image, index) => (
                <div key={index} className="flex flex-col gap-4 relative">
                  <PhotoView
                    src={image.filenames.length > 0 ? image.filenames[0] : ''}
                  >
                    <img
                      src={`${image.filenames}`}
                      alt={image.prompt}
                      className="rounded-md"
                    />
                  </PhotoView>
                  <div className="absolute text-sm text-gray-200 overflow-hidden bottom-0  w-full p-2 rounded-b-sm-md whitespace-nowrap text-ellipsis">
                    {image.prompt}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 overflow-hidden">
              {imageGroup2.map((image, index) => (
                <div key={index} className="flex flex-col gap-4 relative">
                  <PhotoView
                    src={image.filenames.length > 0 ? image.filenames[0] : ''}
                  >
                    <img
                      src={`${image.filenames[0]}`}
                      alt={image.prompt}
                      className="rounded-md"
                    />
                  </PhotoView>
                  <div className="absolute text-sm text-right text-gray-200 overflow-hidden bottom-0  w-full p-2  rounded-b-sm-md whitespace-nowrap text-ellipsis">
                    {image.prompt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PhotoProvider>
      </div>

      {/* app version  */}
      <div className="flex justify-center items-center text-gray-400/90 p-4 gap-2">
        <span>{AppTitle}</span>
        <span className="text-sm">{import.meta.env.VITE_APP_VERSION}</span>
        <span className="text-sm">© 2024</span>
      </div>
    </SideMenuLayout>
  )
}
