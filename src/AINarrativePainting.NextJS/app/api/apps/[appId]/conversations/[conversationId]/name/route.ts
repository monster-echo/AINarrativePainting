import { getChatClient, getInfo } from "@/app/api/utils/common"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string; appId: string }> }
) {
  const body = await request.json()
  const { name } = body
  const { conversationId } = await params
  const { user } = getInfo(request)

  const client = getChatClient(parseInt((await params).appId))

  // auto generate name
  const { data } = await client.renameConversation(conversationId, name, user)
  return NextResponse.json(data)
}
