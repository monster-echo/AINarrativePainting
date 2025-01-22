import axios, { AxiosInstance } from 'axios'

export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

class EventSourceParser {
  private buffer: string = ''

  parse(chunk: string): Array<{ data: string }> {
    this.buffer += chunk
    const events = []
    const lines = this.buffer.split('\n\n')
    this.buffer = lines.pop() || ''

    for (const line of lines) {
      const event = {
        data: line.replace(/^data: /, '').trim(),
      }
      events.push(event)
    }
    return events
  }
}

export interface AppDefinition {
  id: number
  name: string
  description: string
  url: string
  avatar: string
  image: string
  category: string
  features: string[]
}

export class AppDefinitionApiClient {
  private axios: AxiosInstance
  constructor() {
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_ENDPOINT}/api/apps`,
      timeout: 2500,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer `,
      },
    })

    this.axios.interceptors.response.use(
      response => response,
      error => {
        if (axios.isAxiosError(error) && error.response) {
          const { status, data } = error.response
          throw new APIError(
            status,
            data.code || 'unknown_error',
            data.message || 'Unknown error occurred'
          )
        }
        throw error
      }
    )
  }

  getLists = async () => {
    const response = await this.axios.get('')
    return response.data as AppDefinition[]
  }

  get = async (id: string | number) => {
    const response = await this.axios.get(`/${id}`)
    return response.data as AppDefinition
  }
}

class AppApiClient {
  private axios: AxiosInstance
  constructor(appId: string | number) {
    var baseUrl = appId
      ? `${import.meta.env.VITE_API_ENDPOINT}/api/apps/${appId}`
      : `${import.meta.env.VITE_API_ENDPOINT}/api/apps`

    this.axios = axios.create({
      baseURL: baseUrl,
      timeout: 2500,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer `,
      },
    })

    this.axios.interceptors.response.use(
      response => response,
      error => {
        if (axios.isAxiosError(error) && error.response) {
          const { status, data } = error.response
          throw new APIError(
            status,
            data.code || 'unknown_error',
            data.message || 'Unknown error occurred'
          )
        }
        throw error
      }
    )
  }

  blockingChatMessage = async (
    conversation_id: string,
    {
      inputs,
      query,
      files,
      auto_generate_name,
    }: {
      inputs: Record<string, string>
      query: string
      files: {
        type: 'image'
        transfer_method: 'local_url' | 'remote_url'
        url?: string
        upload_file_id?: string
      }[]
      auto_generate_name: boolean
    }
  ) => {
    const response = await this.axios.post('/chat/blocking', {
      conversation_id,
      inputs,
      query,
      response_mode: 'blocking',
      files,
      auto_generate_name,
    })
    const contentType = response.headers['content-type']

    // check if response is blocking
    if (contentType !== 'application/json') {
      throw new Error('Invalid response content type')
    }
    return response.data as {
      message_id: string
      conversation_id: string
      mode: string //(string) App mode, fixed as chat
      answer: string
      metadata: {
        usage: {
          prompt_tokens: number
          prompt_unit_price: string
          prompt_price_unit: string
          prompt_price: string
          completion_tokens: number
          completion_unit_price: string
          completion_price_unit: string
          completion_price: string
          total_tokens: number
          total_price: string
          currency: string
          latency: number
        }
        retriever_resources: {
          position: 1
          dataset_id: string
          dataset_name: string
          document_id: string
          document_name: string
          segment_id: string
          score: number
          content: string
        }
      }
      created_at: string
    }
  }

  async *streamingChatMessage(
    conversation_id: string,
    {
      inputs,
      query,
      files,
      auto_generate_name,
    }: {
      inputs: Record<string, string>
      query: string
      files: {
        type: 'image'
        transfer_method: 'local_url' | 'remote_url'
        url?: string
        upload_file_id?: string
      }[]
      auto_generate_name: boolean
    }
  ) {
    const response = await this.axios.post(
      '/chat/streaming',
      {
        conversation_id,
        inputs,
        query,
        response_mode: 'streaming',
        files,
        auto_generate_name,
      },
      {
        headers: {
          Accept: 'text/event-stream',
        },
        responseType: 'stream',
      }
    )

    const contentType = response.headers['content-type']
    if (!contentType.startsWith('text/event-stream')) {
      throw new Error('Invalid response content type')
    }

    // 404, Conversation does not exists
    // 400, invalid_param, abnormal parameter input
    // 400, app_unavailable, App configuration unavailable
    // 400, provider_not_initialize, no available model credential configuration
    // 400, provider_quota_exceeded, model invocation quota insufficient
    // 400, model_currently_not_support, current model unavailable
    // 400, completion_request_error, text generation failed
    // 500, internal server error

    const parser = new EventSourceParser()
    for await (const chunk of response.data) {
      const text = chunk.toString()
      const events = parser.parse(text)
      for (const event of events) {
        try {
          const data = JSON.parse(event.data) as {
            event:
              | 'message'
              | 'agent_message'
              | 'tts_message'
              | 'tts_message_end'
              | 'agent_thought'
              | 'message_file'
              | 'message_end'
              | 'message_replace'
              | 'error'
              | 'ping'
          }
          switch (data.event) {
            case 'message':
              yield data as {
                event: 'message'
                task_id: string
                message_id: string
                conversation_id: string
                answer: string
                created_at: string
              }
              break
            case 'agent_message':
              yield data as {
                event: 'agent_message'
                task_id: string
                message_id: string
                conversation_id: string
                answer: string
                created_at: string
              }
              break
            case 'tts_message':
              yield data as {
                event: 'tts_message'
                task_id: string
                message_id: string
                audio: string // base64
                created_at: string
              }
              break
            case 'tts_message_end':
              yield data as {
                event: 'tts_message_end'
                task_id: string
                message_id: string
                created_at: string
              }
              break
            case 'agent_thought': //input and output of tool calls (Only supported in Agent mode)
              yield data as {
                id: string // agent thought id
                event: 'agent_thought'
                task_id: string
                message_id: string
                position: number
                thought: string
                observation: string //Response from tool calls
                tool: string // A list of tools represents which tools are called，split by ;
                tool_input: Record<string, any>
                created_at: string
                message_files: string[]
                conversation_id: string
              }
              break
            case 'message_file':
              yield data as {
                event: 'message_file'
                id: string
                type: 'image'
                belongs_to: string
                url?: string
                conversation_id: string
              }
              break
            case 'message_end':
              yield data as {
                event: 'message_end'
                task_id: string
                message_id: string
                conversation_id: string
                metadata: {
                  usage: {
                    prompt_tokens: number
                    prompt_unit_price: string
                    prompt_price_unit: string
                    prompt_price: string
                    completion_tokens: number
                    completion_unit_price: string
                    completion_price_unit: string
                    completion_price: string
                    total_tokens: number
                    total_price: string
                    currency: string
                    latency: number
                  }
                  retriever_resources: {
                    position: number
                    dataset_id: string
                    dataset_name: string
                    document_id: string
                    document_name: string
                    segment_id: string
                    score: number
                    content: string
                  }[]
                }
              }
              break
            case 'message_replace':
              yield data as {
                event: 'message_replace'
                task_id: string
                message_id: string
                conversation_id: string
                answer: string
                created_at: string
              }
              break
            case 'error':
              yield data as {
                event: 'error'
                task_id: string
                message_id: string
                status: string
                code: string
                message: string
              }
              break
            case 'ping':
              yield data // Ping event every 10 seconds to keep the connection alive.
              break
          }
        } catch (error) {
          throw new Error('Invalid event data')
        }
      }
    }
  }

  upload = async (file: File) => {
    const form = new FormData()
    form.append('file', file)

    const response = await this.axios.postForm('/files/upload', form)
    //400, no_file_uploaded, a file must be provided
    // 400, too_many_files, currently only one file is accepted
    // 400, unsupported_preview, the file does not support preview
    // 400, unsupported_estimate, the file does not support estimation
    // 413, file_too_large, the file is too large
    // 415, unsupported_file_type, unsupported extension, currently only document files are accepted
    // 503, s3_connection_failed, unable to connect to S3 service
    // 503, s3_permission_denied, no permission to upload files to S3
    // 503, s3_file_too_large, file exceeds S3 size limit
    // 500, internal server error

    return response.data as {
      id: string
      name: string
      size: string
      extension: string
      mime_type: string
      created_by: string
      created_at: string
    }
  }

  stop = async (task_id: string) => {
    const response = await this.axios.post(
      `/messages/tasks/${task_id}/stop`,
      {}
    )
    return response.data as {
      result: 'success'
    }
  }

  feedback = async (
    message_id: string,
    {
      rating,
      content,
    }: {
      rating: 'like' | 'dislike' | null //Upvote as like, downvote as dislike, revoke upvote as null
      content: string
    }
  ) => {
    const response = await this.axios.post(
      `/messages/${message_id}/feedbacks`,
      {
        rating,
        content: content,
      }
    )
    return response.data as {
      result: 'success'
    }
  }

  suggested = async (message_id: string) => {
    const response = await this.axios.get(`/messages/${message_id}/suggested`, {
      params: {},
    })
    return response.data as {
      result: 'success'
      data: string[]
    }
  }

  getMessages = async ({
    conversation_id,
    first_id,
    limit = 20,
  }: {
    conversation_id: string | null
    first_id?: string | null
    limit?: number | null
  }) => {
    const response = await this.axios.get(`/messages`, {
      params: {
        conversation_id,
        first_id,
        limit,
      },
    })
    return response.data as {
      limit: number
      has_more: boolean
      data: Message[]
    }
  }

  getList = async ({
    last_id,
    limit = 20,
    sort_by = 'updated_at',
  }: {
    last_id?: string | null
    limit?: number | null
    sort_by?: 'created_at' | 'updated_at' | '-created_at' | '-updated_at' | null
  }) => {
    const response = await this.axios.get('/conversations', {
      params: {
        last_id,
        limit,
        sort_by,
      },
    })
    return response.data as {
      limit: number
      has_more: boolean
      data: Conversation[]
    }
  }

  delete = async (conversation_id: string) => {
    const response = await this.axios.delete(
      `/conversations/${conversation_id}`,
      {
        data: {},
      }
    )
    return response.data as {
      result: 'success' | 'error'
    }
  }

  rename = async (
    conversation_id: string,
    {
      name,
      auto_generate = false,
    }: {
      name?: string
      auto_generate: boolean
    }
  ) => {
    const response = await this.axios.post(
      `/conversations/${conversation_id}/name`,
      {
        name,
        auto_generate,
      }
    )
    return response.data as {
      id: string
      name: string
      inputs: object
      status: string
      introduction: string
      created_at: string
      updated_at: string
    }
  }

  audioToText = async (audio: File) => {
    if (
      !['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'].includes(audio.type)
    ) {
      throw new Error('Invalid audio format')
    }
    if (audio.size > 15 * 1024 * 1024) {
      throw new Error('Audio file size exceeds limit')
    }

    const form = new FormData()
    form.append('file', audio)
    form.append('type', audio.type)
    const response = await this.axios.postForm('/audio-to-text', form)
    return response.data as {
      text: string
    }
  }

  textToAudio = async ({
    message_id,
    text,
  }: {
    message_id: string
    text: string
  }) => {
    const form = {
      text,
      message_id: message_id,
    }
    const response = await this.axios.postForm('/text-to-audio', form)
    return response.data
  }

  info = async () => {
    const response = await this.axios.get('/info', {
      params: {},
    })
    return response.data as AppInfo
  }

  parameters = async () => {
    const response = await this.axios.get('/parameters', {})
    return response.data as AppParameters
  }

  meta = async () => {
    const response = await this.axios.get('/meta')
    return response.data as AppMeta
  }
}
export interface Message {
  id: string
  conversation_id: string
  inputs: object
  query: string
  answer: string
  message_files: {
    id: string
    type: string
    url: string
    belongs_to: string
  }[]
  agent_thoughts: {
    id: string
    message_id: string
    position: number
    thought: string
    observation: string
    tool: string
    tool_input: Record<string, any>
    created_at: string
    message_files: string[]
  }[]
  created_at: string
  feedback: {
    rating: string
  }
  retriever_resources: {
    position: number
    dataset_id: string
    dataset_name: string
    document_id: string
    document_name: string
    segment_id: string
    score: number
    content: string
  }[]
}

export interface Conversation {
  id: string
  name: string
  inputs: object
  status: string
  created_at: string
  updated_at: string
}

export interface AppInfo {
  name: string
  description: string
  tags: string[]
}

export interface AppParameters {
  opening_statement: string
  suggested_questions: {
    enabled: boolean
  }
  speech_to_text: {
    enabled: boolean
  }
  retriever_resource: {
    enabled: boolean
  }
  annotation_reply: {
    enabled: boolean
  }
  user_input_form: (TextInputForm | ParagraphForm | SelectForm)[]
  file_upload: {
    image: {
      enabled: boolean
      number_limits: number
      transfer_methods: ('remote_url' | 'local_url')[]
    }
  }
  system_parameters: {
    file_size_limit: number
    image_file_size_limit: number
    audio_file_size_limit: number
    video_file_size_limit: number
  }
}

export interface AppMeta {
  tool_icons: Record<string, object>
}

interface TextInputForm {
  label: string
  variable: string
  required: boolean
  default: string
}
interface ParagraphForm {
  label: string
  variable: string
  required: boolean
  default: string
}
interface SelectForm {
  label: string
  variable: string
  required: boolean
  default: string
  options: string[]
}

export default AppApiClient
