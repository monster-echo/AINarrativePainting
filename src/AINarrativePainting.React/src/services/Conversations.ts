import {
  FeedbackType,
  IOnData,
  IOnCompleted,
  IOnFile,
  IOnThought,
  IOnMessageEnd,
  IOnMessageReplace,
  IOnError,
  IOnWorkflowStarted,
  IOnNodeStarted,
  IOnNodeFinished,
  IOnWorkflowFinished,
} from '../types/type'
import { get, post, ssePost } from './Fetch'

export const getConversations = async ({ limit = 20, firstId = '' }) => {
  return (await get('conversations', {
    params: { limit, first_id: firstId },
  })) as any
}

export const getMessages = async ({
  conversationId,
  limit = 20,
  lastId = '',
}: {
  conversationId?: string
  limit?: number
  lastId?: string
}) => {
  return (await get('messages', {
    params: {
      conversation_id: conversationId,
      limit: limit,
      last_id: lastId,
    },
  })) as any
}

export const fetchAppParameters = async () => {
  return (await get('parameters')) as any
}

export const updateFeedback = async ({
  url,
  body,
}: {
  url: string
  body: FeedbackType
}) => {
  return post(url, { body })
}

export const sendMessage = async (
  body: Record<string, any>,
  {
    onData,
    onCompleted,
    onThought,
    onFile,
    onError,
    getAbortController,
    onMessageEnd,
    onMessageReplace,
    onWorkflowStarted,
    onNodeStarted,
    onNodeFinished,
    onWorkflowFinished,
  }: {
    onData: IOnData
    onCompleted: IOnCompleted
    onFile: IOnFile
    onThought: IOnThought
    onMessageEnd: IOnMessageEnd
    onMessageReplace: IOnMessageReplace
    onError: IOnError
    getAbortController?: (abortController: AbortController) => void
    onWorkflowStarted: IOnWorkflowStarted
    onNodeStarted: IOnNodeStarted
    onNodeFinished: IOnNodeFinished
    onWorkflowFinished: IOnWorkflowFinished
  }
) => {
  return ssePost(
    'chat-messages',
    {
      body: {
        ...body,
        response_mode: 'streaming',
      },
    },
    {
      onData,
      onCompleted,
      onThought,
      onFile,
      onError,
      getAbortController,
      onMessageEnd,
      onMessageReplace,
      onNodeStarted,
      onWorkflowStarted,
      onWorkflowFinished,
      onNodeFinished,
    }
  )
}
