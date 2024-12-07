import { NextRequest, NextResponse } from "next/server"
import { getInfo, client, setSession } from "../utls/common"

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get("conversation_id")
  const { data }: any = await client.getConversationMessages(
    user,
    conversationId as string
  )

  console.log("sessionId", sessionId)
  console.log("user", user)

  return NextResponse.json(data, {
    headers: setSession(sessionId),
  })
}
