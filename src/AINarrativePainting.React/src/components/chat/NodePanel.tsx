import {
  IonAccordion,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonSpinner,
} from '@ionic/react'
import { NodeTracing } from '../../types/type'
import {
  airplane,
  checkmarkCircleSharp,
  glassesSharp,
  informationCircleSharp,
  sendSharp,
  starOutline,
  starSharp,
  stopCircleSharp,
  triangleSharp,
} from 'ionicons/icons'

const GetNodeTypeIcon = (nodeType: string) => {
  switch (nodeType) {
    case 'start':
      return <IonIcon icon={starSharp} />
    case 'end':
      return <IonIcon icon={stopCircleSharp} />
    case 'tool':
      return <IonIcon icon={glassesSharp} />
    case 'llm':
      return <IonIcon icon={airplane} />
    case 'answer':
      return <IonIcon icon={sendSharp} />
  }
}

const NodePanel = ({ node }: { node: NodeTracing }) => {
  const running = node.status === 'running'
  const succeeded = node.status === 'succeeded'
  const failed = node.status === 'failed'
  const stopped = node.status === 'stopped'

  const readonly = node.node_type !== 'llm'
  const getTokenCount = (tokens: number) => {
    if (tokens < 1000) return tokens
    if (tokens >= 1000 && tokens < 1000000)
      return `${parseFloat((tokens / 1000).toFixed(2))}K`
    if (tokens >= 1000000)
      return `${parseFloat((tokens / 1000000).toFixed(2))}M`
  }

  const getTime = (time: number) => {
    if (time < 1) return `${(time * 1000).toFixed(2)} ms`
    if (time > 60)
      return `${parseInt(Math.round(time / 60).toString())} m ${(time % 60).toFixed(2)} s`
    return `${time.toFixed(2)} s`
  }

  return (
    <IonAccordion value={node.id} readonly={readonly}>
      <IonItem slot="header" color="light">
        <IonLabel className="!flex gap-2">
          <div>{GetNodeTypeIcon(node.node_type)}</div>
          <div>{node.title}</div>
        </IonLabel>
        <div>
          {running && (
            <IonLabel color="success" className="!flex items-center gap-2">
              <div>Running</div>
              <IonSpinner name="dots"></IonSpinner>
            </IonLabel>
          )}
          {succeeded && (
            <IonLabel className="!flex items-center gap-2 whitespace-nowrap">
              {node.node_type === 'llm' && (
                <div>
                  {`${getTokenCount(node.execution_metadata?.total_tokens || 0)} tokens`}
                </div>
              )}
              <div> {getTime(node.elapsed_time || 0)}</div>
              <IonIcon color="success" icon={checkmarkCircleSharp}></IonIcon>
            </IonLabel>
          )}
          {failed && (
            <IonLabel color="danger" className="!flex items-center gap-2">
              <div> {getTime(node.elapsed_time || 0)}</div>
              <IonIcon icon={informationCircleSharp}></IonIcon>
            </IonLabel>
          )}
          {stopped && (
            <IonLabel color="danger" className="!flex items-center gap-2">
              <div> {getTime(node.elapsed_time || 0)}</div>
              <IonIcon icon={triangleSharp}></IonIcon>
            </IonLabel>
          )}
        </div>
      </IonItem>
      <div className="ion-padding" slot="content">
        {node.node_type === 'llm' && <IonLabel>{node.outputs?.text}</IonLabel>}
      </div>
    </IonAccordion>
  )
}

export default NodePanel
