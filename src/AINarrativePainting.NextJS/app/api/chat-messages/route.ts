import { NextRequest } from "next/server"
import { client, getInfo } from "../utils/common"

export async function POST(request: NextRequest) {
  const body = await request.json()

  const {
    inputs,
    query,
    files,
    conversation_id: conversationId,
    response_mode: responseMode,
  } = body

  const { user } = getInfo(request)

  console.log("user", user)

  const response = await client.createChatMessage(
    inputs,
    query,
    user,
    responseMode,
    conversationId,
    files
  )

  return new Response(response.data as any)
}
