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
    options,
  } = body

  const appId = parseInt((await params).appId)
  console.log("appId", appId)
  const { user } = getInfo(request, appId)

  console.log("user", user)

  const client = getChatClient(appId)

  try {
    console.log("inputs", inputs)
    console.log("options", options)

    const response = await client.createChatMessage(
      inputs,
      query,
      user,
      responseMode,
      conversationId,
      files
    )
    return new Response(response.data as any)
  } catch (error) {
    console.error("error", error)
    throw error
  }
 
}
