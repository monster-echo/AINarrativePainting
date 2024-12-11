import { type NextRequest } from "next/server"
import { ChatClient } from "dify-client"
import { v4 } from "uuid"
import { API_URL, APP_ID } from "@/config"
import { randomInt } from "crypto"

const userPrefix = `user_${APP_ID}:`

export const getInfo = (request: NextRequest) => {
  // const sessionId = request.cookies.get("session_id")?.value || v4()
  // todo: implement user session
  const sessionId = "123"
  const user = userPrefix + sessionId
  return {
    sessionId,
    user,
  }
}

export const setSession = (sessionId: string) => {
  return { "Set-Cookie": `session_id=${sessionId}` }
}

export const getChatClient = (appId: number) => {
  switch (appId) {
    case 1:
    case 2:
      return new ChatClient("app-fbFo2uaGnxYLdM8fdT7f4UQQ", API_URL)
    case 3:
      return new ChatClient("app-1tifCHTbKxr8ZJAPiRwOedZ3", API_URL)
    default:
      throw new Error("Invalid appId")
  }
}