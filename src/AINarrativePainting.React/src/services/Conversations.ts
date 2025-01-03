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
import { get, post, ssePost, upload } from './Fetch'

export const getConversations = async (
  appId = 0,
  { limit = 20, firstId = '' }
) => {
  return (await get(`apps/${appId}/conversations`, {
    params: { limit, first_id: firstId },
  })) as any
}

export const getMessages = async (
  appId = 0,
  {
    conversationId,
    limit = 20,
    lastId = '',
  }: {
    conversationId?: string
    limit?: number
    lastId?: string
  }
) => {
  return (await get(`apps/${appId}/messages`, {
    params: {
      conversation_id: conversationId,
      limit: limit,
      last_id: lastId,
    },
  })) as any
}

export const fetchAppParameters = async (appId = 0) => {
  return (await get(`apps/${appId}/parameters`)) as any
}

export const updateFeedback = async (
  appId = 0,
  {
    url,
    body,
  }: {
    url: string
    body: FeedbackType
  }
) => {
  // todo: add app id to the url
  return post(url, { body })
}

export const updateShare = async (
  appId: number,
  messageId: string,
  share: boolean,
  filenames: string[] = [],
  prompt = ''
) => {
  return (await post(`apps/${appId}/messages/${messageId}/share`, {
    body: { share, filenames, prompt },
  })) as any
}

export const updateHeart = async (
  appId: number,
  messageId: string,
  heart: boolean,
  filenames: string[] = [],
  prompt = ''
) => {
  return (await post(`apps/${appId}/messages/${messageId}/heart`, {
    body: { heart, filenames, prompt },
  })) as any
}

export const sendMessage = async (
  appId = 0,
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
    `apps/${appId}/chat-messages`,
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

export const uploadFile = async (
  appId: number,
  file: File,
  onProgress: (e: ProgressEvent) => void
) => {
  const formData = new FormData()
  formData.append('file', file)
  const url = `apps/${appId}/file-upload`
  const res = await upload(url, {
    xhr: new XMLHttpRequest(),
    data: formData,
    onprogress: onProgress,
  })
  const result = JSON.parse(res)
  console.log('uploadFile res', result)
  return result
}