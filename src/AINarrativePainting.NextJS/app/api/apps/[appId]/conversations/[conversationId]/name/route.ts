import { getChatClient, getInfo } from "@/app/api/utils/common"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string; appId: string }> }
) {
  const body = await request.json()
  const { name } = body
  const { conversationId } = await params

  const appId = parseInt((await params).appId)
  const { user } = getInfo(request, appId)
  const client = getChatClient(appId)

  // auto generate name
  const { data } = await client.renameConversation(conversationId, name, user)
  return NextResponse.json(data)
}
