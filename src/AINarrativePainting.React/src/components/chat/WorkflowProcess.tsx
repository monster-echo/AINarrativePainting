import {
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonSpinner,
  IonIcon,
} from '@ionic/react'
import { WorkflowRunningStatus, type WorkflowProcess } from '../../types/type'
import { checkmarkCircleSharp, informationCircleSharp } from 'ionicons/icons'
import NodePanel from './NodePanel'
import { memo } from 'react'

type WorkflowProcessProps = {
  data: WorkflowProcess
  grayBg?: boolean
  expand?: boolean
  hideInfo?: boolean
}
const WorkflowProcess = ({
  data,
  grayBg,
  expand = false,
  hideInfo = false,
}: WorkflowProcessProps) => {
  const running = data.status === WorkflowRunningStatus.Running
  const succeeded = data.status === WorkflowRunningStatus.Succeeded
  const failed =
    data.status === WorkflowRunningStatus.Failed ||
    data.status === WorkflowRunningStatus.Stopped

  return (
    <IonAccordionGroup>
      <IonAccordion value="first">
        <IonItem slot="header" color="light" className="flex items-center">
          <IonLabel>Workflow process </IonLabel>
          <div className="mx-2">
            {running && <IonSpinner name="dots"></IonSpinner>}
            {succeeded && (
              <IonLabel color="success">
                <IonIcon icon={checkmarkCircleSharp}></IonIcon>
              </IonLabel>
            )}
            {failed && (
              <IonLabel color="danger">
                <IonIcon icon={informationCircleSharp}></IonIcon>
              </IonLabel>
            )}
          </div>
        </IonItem>
        <div className="ion-padding" slot="content">
          <IonAccordionGroup>
            {data.tracing.map((node, index) => {
              return <NodePanel key={index} node={node} />
            })}
          </IonAccordionGroup>
        </div>
      </IonAccordion>
    </IonAccordionGroup>
  )
}

export default memo(WorkflowProcess)
