export interface TaskDefinition {
  name: string
  title: string
  description: string
  type: string
  workflowPath: string
}

export class TaskDefinitionsService {
  async getTaskDefinitions(): Promise<TaskDefinition[]> {
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
    const url = `${apiEndpoint}/api/task-definitions`
    const response = await fetch(url)
    const taskDefinitions = await response.json()
    return taskDefinitions
  }
}
