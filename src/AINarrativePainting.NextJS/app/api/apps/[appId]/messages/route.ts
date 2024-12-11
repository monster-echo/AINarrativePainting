import { type NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getChatClient, getInfo, setSession } from "@/app/api/utils/common"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {

  const appId = parseInt((await params).appId)

  const { sessionId, user } = getInfo(request, appId)
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get("conversation_id")

  const client = getChatClient(appId)
  const { data }: any = await client.getConversationMessages(
    user,
    conversationId as string
  )
  return NextResponse.json(data, {
    headers: setSession(sessionId),
  })
}
