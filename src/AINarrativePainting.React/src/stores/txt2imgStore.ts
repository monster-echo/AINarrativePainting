import { create } from 'zustand'
import { getMessages, sendMessage } from '../services/Conversations'
import { ChatItem, WorkflowRunningStatus, Annotation } from '../types/type'

interface Txt2ImgState {
  appId: number
  id: string
  name: string
  responding: boolean
  chatItems: ChatItem[]
  abortController?: AbortController
  isAgentModel: boolean
  setAppId: (appId: number, id: string) => void
  init: (conversationId: string) => Promise<void>
  send: (message: string) => Promise<void>
  stop: () => Promise<void>
}
export const useTxt2ImgStore = create<Txt2ImgState>((set, get) => ({
  appId: 0,
  id: '',
  name: '',
  responding: false,
  isAgentModel: false,
  chatItems: [],
  taskId: '',
  setAppId: (appId: number, id: string) => {
    set({ appId, id: id })
  },
  init: async (conversationId: string) => {
    const result = await getMessages(get().appId, {
      conversationId: conversationId,
    })
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
    const responseItem: ChatItem = {
      id: `${Date.now()}`,
      content: '',
      agent_thoughts: [],
      message_files: [],
      isAnswer: true,
    }

    const updateLastItem = () =>
      set(state => {
        return {
          chatItems: [
            ...state.chatItems.filter(
              item =>
                item.id !== placeholderAnswerId && item.id !== responseItem.id
            ),
            responseItem,
          ],
        }
      })

    await sendMessage(
      get().appId,
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
          updateLastItem()
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
          const lastThought =
            responseItem.agent_thoughts?.[
              responseItem.agent_thoughts?.length - 1
            ]
          if (lastThought)
            lastThought.message_files = [
              ...(lastThought as any).message_files,
              { ...file },
            ]
          updateLastItem()
        },
        onThought: thought => {
          set({ isAgentModel: true })
          console.log('onThought:', thought)
          const response = responseItem as any
          if (thought.message_id) {
            response.id = thought.message_id
          }
          // responseItem.id = thought.message_id;
          if (response.agent_thoughts.length === 0) {
            response.agent_thoughts.push(thought)
          } else {
            const lastThought =
              response.agent_thoughts[response.agent_thoughts.length - 1]
            // thought changed but still the same thought, so update.
            if (lastThought.id === thought.id) {
              thought.thought = lastThought.thought
              thought.message_files = lastThought.message_files
              responseItem.agent_thoughts![response.agent_thoughts.length - 1] =
                thought
            } else {
              responseItem.agent_thoughts!.push(thought)
            }
          }
          updateLastItem()
        },
        onMessageEnd: messageEnd => {
          console.log('onMessageEnd:', messageEnd)
          if (messageEnd.metadata?.annotation_reply) {
            responseItem.id = messageEnd.id
            responseItem.annotation = {
              id: messageEnd.metadata.annotation_reply.id,
              authorName: messageEnd.metadata.annotation_reply.account.name,
            } as Annotation
          }
          updateLastItem()
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
          responseItem.workflow_run_id = workflow_run_id
          responseItem.workflowProcess = {
            status: WorkflowRunningStatus.Running,
            tracing: [],
          }
          updateLastItem()
        },
        onWorkflowFinished: ({ data }) => {
          console.log('onWorkflowFinished:', data)
          responseItem.workflowProcess!.status =
            data.status as WorkflowRunningStatus

          updateLastItem()
        },
        onNodeStarted: ({ data }) => {
          console.log('onNodeStarted:', data)
          responseItem.workflowProcess!.tracing!.push(data as any)
          updateLastItem()
        },
        onNodeFinished: ({ data }) => {
          console.log('onNodeFinished:', data)
          const currentIndex = responseItem.workflowProcess!.tracing!.findIndex(
            item => item.node_id === data.node_id
          )
          responseItem.workflowProcess!.tracing[currentIndex] = data as any
          updateLastItem()
        },
      }
    )
  },

  stop: async () => {},
}))
