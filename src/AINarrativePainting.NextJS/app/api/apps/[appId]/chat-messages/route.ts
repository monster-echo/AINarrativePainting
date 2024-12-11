import { NextRequest } from "next/server"
import { getChatClient, getInfo } from "@/app/api/utils/common"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const body = await request.json()

  const {
    inputs,
    query,
    files,
    conversation_id: conversationId,
    response_mode: responseMode,
  } = body

  const appId = parseInt((await params).appId)

  const { user } = getInfo(request, appId)

  console.log("user", user)

  const client = getChatClient(appId)

  const response = await client.createChatMessage(
    inputs,
    query,
    user,
    responseMode,
    conversationId,
    files
  )

  console.log("response", response)

  console.log("response.data", response.data)

  return new Response(response.data as any)
}
