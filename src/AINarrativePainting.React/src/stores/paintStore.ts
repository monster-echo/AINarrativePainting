import { create } from 'zustand'
import { produce } from 'immer'
import { Annotation, ChatItem, WorkflowRunningStatus } from '../types/type'
import {
  getMessages,
  sendMessage,
  updateHeart,
  updateShare,
} from '../services/Conversations'
import { addFileInfos, sortAgentSorts } from '../utils/tools'

export interface PaintAppState {
  conversationId: string
  name: string
  isAgentModel: boolean
  responding: boolean
  chatItems: ChatItem[]
}

const initialState = {
  apps: {},
}

export interface PaintAppsState {
  apps: Record<number, PaintAppState>
  init: (apps: number[]) => Promise<void>
  updateConversationId: (appId: number, conversationId: string) => void

  updateShare: (
    appId: number,
    conversationId: string,
    messageId: string,
    share: boolean
  ) => Promise<void>

  updateHeart: (
    appId: number,
    conversationId: string,
    messageId: string,
    heart: boolean
  ) => Promise<void>

  getApp: (appId: number) => PaintAppState | undefined
  stop: (appId: number) => Promise<void>
  send: (appId: number, message: string) => Promise<void>
}

const usePaintAppsStore = create<PaintAppsState>((set, get) => ({
  ...initialState,
  init: async (apps: number[]) => {
    set(
      produce<PaintAppsState>(state => {
        apps.forEach(appId => {
          state.apps[appId] = {
            conversationId: '',
            name: '',
            isAgentModel: false,
            responding: false,
            chatItems: [],
          }
        })
      })
    )
    const json = localStorage.getItem('paint:apps')
    if (!json) {
      return
    }
    try {
      const apps = JSON.parse(json) as { id: number; conversationId: string }[]
      for (const app of apps) {
        const result = await getMessages(app.id, {
          conversationId: app.conversationId,
        })
        const { data } = result
        const items = data.map((item: any) => {
          return [
            {
              id: `question-${item.id}`,
              content: item.query,
              isAnswer: false,
              type: 'question',
              message_files:
                item.message_files?.filter(
                  (file: any) => file.belongs_to === 'user'
                ) || [],
            },
            {
              id: item.id,
              content: item.answer,
              isAnswer: true,
              feedback: item.feedback,
              agent_thoughts: addFileInfos(
                item.agent_thoughts
                  ? sortAgentSorts(item.agent_thoughts)
                  : item.agent_thoughts,
                item.message_files
              ),
              message_files:
                item.message_files?.filter(
                  (file: any) => file.belongs_to === 'assistant'
                ) || [],
              share: item.share,
              heart: item.heart,
            },
          ]
        })
        set(
          produce(state => {
            state.apps[app.id] = {
              conversationId: app.conversationId,
              chatItems: items.flat(),
            }
          })
        )
      }
    } catch (e) {
      console.error("Couldn't load paint apps from local storage")
    }
  },

  updateConversationId: (appId, conversationId) => {
    set(
      produce<PaintAppsState>(state => {
        state.apps[appId].conversationId = conversationId
      })
    )
    const apps = get().apps
    const json = JSON.stringify(
      Object.keys(apps).map(id => ({
        id: parseInt(id),
        conversationId: apps[parseInt(id)].conversationId,
      }))
    )
    localStorage.setItem('paint:apps', json)
  },

  updateShare: async (appId, conversationId, messageId, share) => {
    const answerfiles = get()
      .apps[appId].chatItems.find(item => item.id === messageId)
      ?.message_files?.filter(file => file.type === 'image')
      .map(file => (file as any).filename)

    const content = get().apps[appId].chatItems.find(
      item => item.id === `question-${messageId}`
    )?.content
    await updateShare(appId, messageId, share, answerfiles, content)
    set(
      produce<PaintAppsState>(state => {
        state.apps[appId].chatItems = state.apps[appId].chatItems.map(item => {
          if (item.id === messageId) {
            return {
              ...item,
              share,
            }
          }
          return item
        })
      })
    )
  },

  updateHeart: async (appId, conversationId, messageId, heart) => {
    const answerfiles = get()
      .apps[appId].chatItems.find(item => item.id === messageId)
      ?.message_files?.filter(file => file.type === 'image')
      .map(file => (file as any).filename)

    const content = get().apps[appId].chatItems.find(
      item => item.id === `question-${messageId}`
    )?.content

    await updateHeart(appId, messageId, heart, answerfiles, content)
    set(
      produce<PaintAppsState>(state => {
        state.apps[appId].chatItems = state.apps[appId].chatItems.map(item => {
          if (item.id === messageId) {
            return {
              ...item,
              heart,
            }
          }
          return item
        })
      })
    )
  },

  getApp: appId => {
    return get().apps[appId]
  },
  stop: async appId => {
    const app = get().apps[appId]
  },
  send: async (appId, message) => {
    const app = get().apps[appId]
    const conversationId = app.conversationId
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

    set(
      produce<PaintAppsState>(state => {
        state.apps[appId].isAgentModel = false
        state.apps[appId].chatItems.push(questionItem, placeholderAnswerItem)
      })
    )

    let responseItem: ChatItem = {
      id: `${Date.now()}`,
      content: '',
      agent_thoughts: [],
      message_files: [],
      isAnswer: true,
    }

    const updateLastItem = () => {
      set(
        produce<PaintAppsState>(state => {
          state.apps[appId].chatItems = [
            ...state.apps[appId].chatItems.filter(
              item =>
                item.id !== placeholderAnswerId && item.id !== responseItem.id
            ),
            responseItem,
          ]

          console.log('response id:', responseItem.id)
          console.log('chat items length:', state.apps[appId].chatItems.length)
        })
      )
    }

    console.log('send message !!!!!')

    await sendMessage(
      appId,
      {
        inputs: [],
        query: message,
        conversation_id: conversationId,
      },
      {
        getAbortController: abortController => {},
        onData: (
          message: string,
          isFirstMessage: boolean,
          { conversationId: newConversationId, messageId, taskId }: any
        ) => {
          const state = get()
          if (!state.apps[appId].isAgentModel) {
            responseItem = produce(responseItem, draft => {
              draft.content = draft.content + message
            })
            console.log('message:', message)
          } else {
            // todo agent model
            console.log('message:', message)
          }
          if (messageId) {
            const lastTempId = responseItem.id

            responseItem = produce(responseItem, draft => {
              draft.id = messageId
            })

            // remove the answer with temp id
            set(
              produce<PaintAppsState>(state => {
                state.apps[appId].chatItems = state.apps[
                  appId
                ].chatItems.filter(item => item.id !== lastTempId)
              })
            )
          }
          if (isFirstMessage && newConversationId) {
            set(
              produce<PaintAppsState>(state => {
                state.apps[appId].conversationId = newConversationId
              })
            )
            get().updateConversationId(appId, newConversationId)
          }
          updateLastItem()
        },
        onCompleted: (hasError?: boolean) => {
          console.log('onCompleted:', hasError)
          if (hasError) return
          set(
            produce<PaintAppsState>(state => {
              state.apps[appId].responding = false
            })
          )
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
          set(
            produce<PaintAppsState>(state => {
              state.apps[appId].isAgentModel = true
            })
          )

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

              responseItem = produce(responseItem, draft => {
                draft.agent_thoughts![response.agent_thoughts.length - 1] =
                  thought
              })
            } else {
              responseItem = produce(responseItem, draft => {
                draft.agent_thoughts!.push(thought)
              })
            }
          }
          updateLastItem()
        },
        onMessageEnd: messageEnd => {
          console.log('onMessageEnd:', messageEnd)
          if (messageEnd.metadata?.annotation_reply) {
            responseItem = produce(responseItem, draft => {
              draft.id = messageEnd.id
              draft.annotation = {
                id: messageEnd.metadata.annotation_reply.id,
                authorName: messageEnd.metadata.annotation_reply.account.name,
              } as Annotation
            })
          }
          updateLastItem()
        },
        onMessageReplace: messageReplace => {
          console.log('onMessageReplace:', messageReplace)

          set(
            produce<PaintAppsState>(state => {
              state.apps[appId].chatItems = state.apps[appId].chatItems.map(
                item => {
                  if (item.id === messageReplace.id) {
                    return {
                      ...item,
                      content: messageReplace.answer,
                    }
                  }
                  return item
                }
              )
            })
          )
        },
        onError: () => {
          console.log('onError')
          // remove placeholder answer
          set(
            produce<PaintAppsState>(state => {
              state.apps[appId].chatItems = state.apps[appId].chatItems.filter(
                item => item.id !== placeholderAnswerId
              )
            })
          )
        },
        onWorkflowStarted: ({ workflow_run_id, task_id }) => {
          console.log('onWorkflowStarted:', workflow_run_id, task_id)

          responseItem = produce(responseItem, draft => {
            draft.workflow_run_id = workflow_run_id
            draft.workflowProcess = {
              status: WorkflowRunningStatus.Running,
              tracing: [],
            }
          })

          updateLastItem()
        },
        onWorkflowFinished: ({ data }) => {
          console.log('onWorkflowFinished:', data)
          responseItem = produce(responseItem, draft => {
            draft.workflowProcess!.status = data.status as WorkflowRunningStatus
          })
          updateLastItem()
        },
        onNodeStarted: ({ data }) => {
          console.log('onNodeStarted:', data)
          responseItem = produce(responseItem, draft => {
            draft.workflowProcess!.tracing!.push({
              ...data,
              status: WorkflowRunningStatus.Running,
            } as any)
          })
          updateLastItem()
        },
        onNodeFinished: ({ data }) => {
          console.log('onNodeFinished:', data)
          const currentIndex = responseItem.workflowProcess!.tracing!.findIndex(
            item => item.node_id === data.node_id
          )
          responseItem = produce(responseItem, draft => {
            draft.workflowProcess!.tracing[currentIndex] = data as any
          })
          updateLastItem()
        },
      }
    )
  },
}))

export default usePaintAppsStore
