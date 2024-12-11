import { IonCard, IonCardContent, IonSpinner } from '@ionic/react'
import { ChatItem, VisionFile } from '../../types/type'
import { Markdown } from '../base/markdown'
import Thought from './Thought'
import ImageGallery from '../base/image-gallery'
import WorkflowProcess from './WorkflowProcess'

const Answer = ({
  item,
  onImageClick,
}: {
  item: ChatItem
  onImageClick?: (url: string) => void
}) => {
  const { id, content, feedback, agent_thoughts, workflowProcess } = item
  const isAgentMode = !!agent_thoughts && agent_thoughts.length > 0

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

  const handleImageClick = (src: string) => {
    onImageClick && onImageClick(src)
  }

  return (
    <div key={id} className="flex justify-start ">
      <IonCard className="m-0 relative w-full">
        <IonCardContent>
          {/* {JSON.stringify(item)} */}
          {workflowProcess && (
            <WorkflowProcess data={workflowProcess} hideInfo />
          )}
          {isAgentMode ? (
            agentModeAnswer
          ) : (
            <Markdown content={content} onImageClick={handleImageClick} />
          )}
        </IonCardContent>
      </IonCard>
    </div>
  )
}

export default Answer
