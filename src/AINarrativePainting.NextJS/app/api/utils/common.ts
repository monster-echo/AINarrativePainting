import { type NextRequest } from "next/server"
import { ChatClient } from "dify-client"
import { API_URL } from "@/config"

export const getInfo = (request: NextRequest, appId: number) => {
  // const sessionId = request.cookies.get("session_id")?.value || v4()
  // todo: implement user session
  const sessionId = "123"

  const user = `user_${appId}:` + sessionId
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
      return new ChatClient("app-RULaryb4d14q5ARY0VORv0iv", API_URL)
    default:
      throw new Error("Invalid appId")
  }
}