export type TaskDefinition = {
  name: string
  title: string
  description: string
  type: "Comfy"
  workflowPath: string
}

import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"

export async function GET(request: NextRequest) {
  const workflowPath = path.resolve("app_data/workflows")
  const files = fs.readdirSync(workflowPath)
  const taskDefinitions = files.map((file) => {
    const filePath = path.join(workflowPath, file)

    const filename = path.basename(filePath)

    const fileContent = fs.readFileSync(filePath, "utf-8")
    const jsonContent = JSON.parse(fileContent)
    const task = {
      name: jsonContent.name || file,
      title: jsonContent.title || file,
      description: jsonContent.description || ``,
      type: jsonContent.type || "Comfy",
      workflowPath: filename,
    }
    return task
  })

  return NextResponse.json(taskDefinitions)
}
