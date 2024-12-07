export type IOnThought = (though: ThoughtItem) => void
export type IOnFile = (file: VisionFile) => void
export type IOnMessageEnd = (messageEnd: MessageEnd) => void
export type IOnMessageReplace = (messageReplace: MessageReplace) => void
export type IOnAnnotationReply = (messageReplace: AnnotationReply) => void
export type IOnCompleted = (hasError?: boolean) => void
export type IOnError = (msg: string, code?: string) => void
export type IOnWorkflowStarted = (
  workflowStarted: WorkflowStartedResponse
) => void
export type IOnWorkflowFinished = (
  workflowFinished: WorkflowFinishedResponse
) => void
export type IOnNodeStarted = (nodeStarted: NodeStartedResponse) => void
export type IOnNodeFinished = (nodeFinished: NodeFinishedResponse) => void

export const MessageRatings = ['like', 'dislike', null] as const
export type MessageRating = (typeof MessageRatings)[number]

export type FeedbackType = {
  rating: MessageRating
  content?: string | null
}
export type WorkflowStartedResponse = {
  task_id: string
  workflow_run_id: string
  event: string
  data: {
    id: string
    workflow_id: string
    sequence_number: number
    created_at: number
  }
}

export type WorkflowFinishedResponse = {
  task_id: string
  workflow_run_id: string
  event: string
  data: {
    id: string
    workflow_id: string
    status: string
    outputs: any
    error: string
    elapsed_time: number
    total_tokens: number
    total_steps: number
    created_at: number
    finished_at: number
  }
}

export type NodeStartedResponse = {
  task_id: string
  workflow_run_id: string
  event: string
  data: {
    id: string
    node_id: string
    node_type: string
    index: number
    predecessor_node_id?: string
    inputs: any
    created_at: number
    extras?: any
  }
}

export type NodeFinishedResponse = {
  task_id: string
  workflow_run_id: string
  event: string
  data: {
    id: string
    node_id: string
    node_type: string
    index: number
    predecessor_node_id?: string
    inputs: any
    process_data: any
    outputs: any
    status: string
    error: string
    elapsed_time: number
    execution_metadata: {
      total_tokens: number
      total_price: number
      currency: string
    }
    created_at: number
  }
}

export type IOnDataMoreInfo = {
  conversationId?: string
  taskId?: string
  messageId: string
  errorMessage?: string
  errorCode?: string
}

export type ThoughtItem = {
  id: string
  tool: string // plugin or dataset. May has multi.
  thought: string
  tool_input: string
  message_id: string
  observation: string
  position: number
  files?: string[]
  message_files?: VisionFile[]
}

export type VisionFile = {
  id?: string
  type: string
  transfer_method: TransferMethod
  url: string
  upload_file_id: string
  belongs_to?: string
}

export enum TransferMethod {
  all = 'all',
  local_file = 'local_file',
  remote_url = 'remote_url',
}

export type IOnData = (
  message: string,
  isFirstMessage: boolean,
  moreInfo: IOnDataMoreInfo
) => void

export type MessageEnd = {
  id: string
  metadata: {
    retriever_resources?: CitationItem[]
    annotation_reply: {
      id: string
      account: {
        id: string
        name: string
      }
    }
  }
}

export type CitationItem = {
  content: string
  data_source_type: string
  dataset_name: string
  dataset_id: string
  document_id: string
  document_name: string
  hit_count: number
  index_node_hash: string
  segment_id: string
  segment_position: number
  score: number
  word_count: number
}

export type MessageReplace = {
  id: string
  task_id: string
  answer: string
  conversation_id: string
}

export type AnnotationReply = {
  id: string
  task_id: string
  answer: string
  conversation_id: string
  annotation_id: string
  annotation_author_name: string
}
export type MessageMore = {
  time: string
  tokens: number
  latency: number | string
}
export type LogAnnotation = {
  content: string
  account: {
    id: string
    name: string
    email: string
  }
  created_at: number
}

export type Annotation = {
  id: string
  authorName: string
  logAnnotation?: LogAnnotation
  created_at?: number
}

export type IChatItem = {
  id: string
  content: string
  /**
   * Specific message type
   */
  isAnswer: boolean
  /**
   * The user feedback result of this message
   */
  feedback?: FeedbackType
  /**
   * The admin feedback result of this message
   */
  adminFeedback?: FeedbackType
  /**
   * Whether to hide the feedback area
   */
  feedbackDisabled?: boolean
  /**
   * More information about this message
   */
  more?: MessageMore
  annotation?: Annotation
  useCurrentUserAvatar?: boolean
  isOpeningStatement?: boolean
  suggestedQuestions?: string[]
  log?: { role: string; text: string }[]
  agent_thoughts?: ThoughtItem[]
  message_files?: VisionFile[]
}

export enum BlockEnum {
  Start = 'start',
  End = 'end',
  Answer = 'answer',
  LLM = 'llm',
  KnowledgeRetrieval = 'knowledge-retrieval',
  QuestionClassifier = 'question-classifier',
  IfElse = 'if-else',
  Code = 'code',
  TemplateTransform = 'template-transform',
  HttpRequest = 'http-request',
  VariableAssigner = 'variable-assigner',
  Tool = 'tool',
}

export type NodeTracing = {
  id: string
  index: number
  predecessor_node_id: string
  node_id: string
  node_type: BlockEnum
  title: string
  inputs: any
  process_data: any
  outputs?: any
  status: string
  error?: string
  elapsed_time: number
  execution_metadata: {
    total_tokens: number
    total_price: number
    currency: string
  }
  created_at: number
  created_by: {
    id: string
    name: string
    email: string
  }
  finished_at: number
  extras?: any
  expand?: boolean // for UI
}

export enum NodeRunningStatus {
  NotStart = 'not-start',
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
}

export enum WorkflowRunningStatus {
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Stopped = 'stopped',
}

export type WorkflowProcess = {
  status: WorkflowRunningStatus
  tracing: NodeTracing[]
  expand?: boolean // for UI
}

export type ChatItem = IChatItem & {
  isError?: boolean
  workflow_run_id?: string
  workflowProcess?: WorkflowProcess
}
