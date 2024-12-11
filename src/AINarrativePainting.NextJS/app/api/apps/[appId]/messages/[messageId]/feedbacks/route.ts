import { type NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getChatClient, getInfo } from "@/app/api/utils/common"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string; appId: string }> }
) {
  const body = await request.json()
  const { rating } = body
  const { messageId } = await params
  const { user } = getInfo(request)

  const client = getChatClient(parseInt((await params).appId))
  const { data } = await client.messageFeedback(messageId, rating, user)
  return NextResponse.json({ data })
}
