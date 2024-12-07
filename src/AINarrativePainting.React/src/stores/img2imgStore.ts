import { create } from 'zustand'
import { getMessages, sendMessage } from '../services/Conversations'
import { ChatItem } from '../types/type'

interface Img2ImgState {
  id: string
  name: string
  responding: boolean
  chatItems: ChatItem[]
  abortController?: AbortController
  isAgentModel: boolean
  init: (id: string) => Promise<void>
  send: (message: string) => Promise<void>
  stop: () => Promise<void>
}
export const useImg2ImgStore = create<Img2ImgState>((set, get) => ({
  id: '',
  name: '',
  responding: false,
  isAgentModel: false,
  chatItems: [],
  taskId: '',
  init: async (id?: string) => {
    const result = await getMessages({ conversationId: id })
    const { data } = result
    const loadedChatItems: ChatItem[] = []
    data.forEach((item: any) => {
      loadedChatItems.push({
        id: `question-${item.id}`,
        content: item.query,
        isAnswer: false,
        message_files:
          item.message_files?.filter(
            (file: any) => file.belongs_to === 'user'
          ) || [],
      })

      loadedChatItems.push({
        id: item.id,
        content: item.answer,
        // agent_thoughts: addFileInfos(
        //   item.agent_thoughts
        //     ? sortAgentSorts(item.agent_thoughts)
        //     : item.agent_thoughts,
        //   item.message_files
        // ),
        feedback: item.feedback,
        isAnswer: true,
        message_files:
          item.message_files?.filter(
            (file: any) => file.belongs_to === 'assistant'
          ) || [],
      })
    })

    set({
      chatItems: loadedChatItems,
    })
  },
  send: async message => {
    const conversationId = get().id

    console.log('conversationId:', conversationId)

    const questionId = `question-${Date.now()}`
    const questionItem = {
      id: questionId,
      content: message,
      isAnswer: false,
      message_files: [],
    }
    const placeholderAnswerId = `answer-${Date.now()}`
    const placeholderAnswerItem = {
      id: placeholderAnswerId,
      content: '...',
      isAnswer: true,
    }
    set(state => {
      return {
        ...state,
        responding: true,
        isAgentModel: false,
        chatItems: [...state.chatItems, questionItem, placeholderAnswerItem],
      }
    })
    const responseItem = {
      id: `${Date.now()}`,
      content: '',
      agent_thoughts: [],
      message_files: [],
      isAnswer: true,
    }
    await sendMessage(
      {
        inputs: [],
        query: message,
        conversation_id: conversationId,
      },
      {
        getAbortController: abortController => {
          set({ abortController })
        },
        onData: (
          message: string,
          isFirstMessage: boolean,
          { conversationId: newConversationId, messageId, taskId }: any
        ) => {
          const state = get()
          if (!state.isAgentModel) {
            responseItem.content = responseItem.content + message
            console.log('message:', message)
          } else {
            // todo agent model
            console.log('message:', message)
          }
          if (messageId) {
            responseItem.id = messageId
          }
          if (isFirstMessage && newConversationId) {
            set({
              id: newConversationId,
            })

            console.log('newConversationId:', newConversationId)
          }
          set({
            chatItems: [
              ...state.chatItems.filter(
                item =>
                  item.id !== placeholderAnswerId && item.id !== responseItem.id
              ),
              responseItem,
            ],
          })
        },
        onCompleted: (hasError?: boolean) => {
          console.log('onCompleted:', hasError)
          if (hasError) return
          set({
            responding: false,
          })
        },
        onFile: file => {
          console.log('onFile:', file)
        },
        onThought: thought => {
          set({ isAgentModel: true })
          console.log('onThought:', thought)
        },
        onMessageEnd: messageEnd => {
          console.log('onMessageEnd:', messageEnd)
        },
        onMessageReplace: messageReplace => {
          console.log('onMessageReplace:', messageReplace)

          set(state => {
            return {
              ...state,
              chatItems: state.chatItems.map(item => {
                if (item.id === messageReplace.id) {
                  return {
                    ...item,
                    content: messageReplace.answer,
                  }
                }
                return item
              }),
            }
          })
        },
        onError: () => {
          console.log('onError')

          // remove placeholder answer
          set(state => {
            return {
              ...state,
              chatItems: state.chatItems.filter(
                item => item.id !== placeholderAnswerId
              ),
            }
          })
        },
        onWorkflowStarted: ({ workflow_run_id, task_id }) => {
          console.log('onWorkflowStarted:', workflow_run_id, task_id)
        },
        onWorkflowFinished: ({ data }) => {
          console.log('onWorkflowFinished:', data)
        },
        onNodeStarted: ({ data }) => {
          console.log('onNodeStarted:', data)
        },
        onNodeFinished: ({ data }) => {
          console.log('onNodeFinished:', data)
        },
      }
    )
  },

  stop: async () => {
    const state = get()
    state.abortController?.abort()
  },
}))
