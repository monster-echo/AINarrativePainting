import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSpinner,
  useIonToast,
} from '@ionic/react'
import { ChatItem, VisionFile } from '../../types/type'
import { Markdown } from '../base/markdown'
import ImageGallery from '../base/image-gallery'
import WorkflowProcess from './WorkflowProcess'
import {
  heartOutline,
  shareSocialOutline,
  shareSocialSharp,
} from 'ionicons/icons'
import usePaintAppsStore from '../../stores/paintStore'
import { ChatContext } from '../../hooks/chat-context'
import { useContext, useState } from 'react'

const LoadingButton = (props: {
  loading: boolean
  size: 'small' | 'default' | 'large' | undefined
  color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'light'
    | 'medium'
    | 'dark'
    | undefined
  fill: 'clear' | 'outline' | 'solid' | 'default' | undefined
  onClick: () => void
  children: React.ReactNode
}) => {
  const { loading, children, ...rest } = props

  if (loading) {
    return (
      <IonButton disabled={loading} {...rest}>
        <IonSpinner name="dots"></IonSpinner>
      </IonButton>
    )
  }

  return <IonButton {...rest}>{children}</IonButton>
}

const Answer = ({
  item,
  onImageClick,
}: {
  item: ChatItem & {
    share?: boolean
    heart?: boolean
  }
  onImageClick?: (url: string) => void
}) => {
  const { id, content, feedback, agent_thoughts, workflowProcess } = item
  const isAgentMode = !!agent_thoughts && agent_thoughts.length > 0
  const [showToast] = useIonToast()
  const getImgs = (list?: VisionFile[]) => {
    if (!list) return []
    return list.filter(
      file => file.type === 'image' && file.belongs_to === 'assistant'
    )
  }
  const agentModeAnswer = (
    <div>
      {agent_thoughts?.map((item, index) => (
        <div key={index}>
          {item.thought && <Markdown content={item.thought} />}
          {item.tool}
          {/* perhaps not use tool */}
          {!!item.tool && <div>thought</div>}

          {getImgs(item.message_files).length > 0 && (
            <ImageGallery
              srcs={getImgs(item.message_files).map(item => item.url)}
            />
          )}
        </div>
      ))}
    </div>
  )

  const { updateShare, updateHeart } = usePaintAppsStore()

  const [shareLoading, setShareLoading] = useState(false)
  const [heartLoading, setHeartLoading] = useState(false)

  const { appId, conversationId } = useContext(ChatContext)

  const handleShare = async () => {
    try {
      setShareLoading(true)
      await updateShare(
        appId,
        conversationId!,
        item.id,
        item.share ? false : true
      )
      showToast({
        message: item.share ? `已取消分享` : `已分享`,
        position: 'top',
      })
    } catch (error) {
      showToast({
        message: item.share ? `取消分享失败` : `分享失败`,
        position: 'top',
      })
    } finally {
      setShareLoading(false)
    }
  }

  const handleHeart = async () => {
    try {
      setHeartLoading(true)
      await updateHeart(
        appId,
        conversationId!,
        item.id,
        item.heart ? false : true
      )
      showToast({
        message: item.heart ? `已取消喜欢` : `已喜欢`,
        position: 'top',
      })
    } catch (error) {
      showToast({
        message: item.heart ? `取消喜欢失败` : `喜欢失败`,
        position: 'top',
      })
    } finally {
      setHeartLoading(false)
    }
  }

  const handleImageClick = (src: string) => {
    onImageClick && onImageClick(src)
  }

  return (
    <div className="flex justify-start ">
      <IonCard className="m-0 relative w-full">
        {workflowProcess && <WorkflowProcess data={workflowProcess} hideInfo />}
        {isAgentMode ? (
          agentModeAnswer
        ) : (
          <Markdown content={content} onImageClick={handleImageClick} />
        )}
        {(!workflowProcess || workflowProcess.status === 'succeeded') && (
          <IonCardContent className="">
            <div className="flex justify-end w-full whitespace-nowrap overflow-x-auto hide-scrollbar">
              <LoadingButton
                size="small"
                color={'dark'}
                fill="clear"
                onClick={handleShare}
                loading={shareLoading}
              >
                {(item as any).share ? (
                  <div className="text-red-400">
                    <IonIcon icon={shareSocialSharp}></IonIcon>
                  </div>
                ) : (
                  <IonIcon icon={shareSocialOutline}></IonIcon>
                )}
              </LoadingButton>
              <LoadingButton
                size="small"
                color={'dark'}
                fill="clear"
                onClick={handleHeart}
                loading={heartLoading}
              >
                {(item as any).heart ? (
                  <div className="text-red-400">
                    <IonIcon icon={heartOutline}></IonIcon>
                  </div>
                ) : (
                  <IonIcon icon={heartOutline}></IonIcon>
                )}
              </LoadingButton>
            </div>
          </IonCardContent>
        )}
      </IonCard>
    </div>
  )
}

export default Answer
