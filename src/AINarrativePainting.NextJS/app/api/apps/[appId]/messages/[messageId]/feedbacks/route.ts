import { type NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getChatClient, getInfo } from "@/app/api/utils/common"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string; appId: string }> }
) {
  const appId = parseInt((await params).appId)
  const body = await request.json()
  const { rating } = body
  const { messageId } = await params
  const { sessionId, user } = getInfo(request, appId)

  const client = getChatClient(appId)
  const { data } = await client.messageFeedback(messageId, rating, user)
  return NextResponse.json({ data })
}
