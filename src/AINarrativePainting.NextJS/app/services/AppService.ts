import fs from "fs"
import path from "path"

export interface AppInfo {
  id: number
  name: string
  description: string
  avatar: string
  image: string
  category: string
  features: string[]
  apiKey: string
}

class AppNotFoundError extends Error {
  constructor(message: string = "App not found") {
    super(message)
    this.name = "AppNotFoundError"
  }
}

let apps: AppInfo[]

export const getApps = () => {
  if (apps) {
    return apps
  }

  const filePath = path.join(process.cwd(), "appdata/apps.json")
  // check if file exists
  if (!fs.existsSync(filePath)) {
    throw new AppNotFoundError()
  }

  const data = fs.readFileSync(filePath, "utf-8")
  apps = JSON.parse(data).apps as AppInfo[]
  return apps
}

export const getApp = (appId: number) => {
  const app = getApps().find((app) => app.id === appId)
  if (!app) {
    throw new AppNotFoundError()
  }
  return app
}
