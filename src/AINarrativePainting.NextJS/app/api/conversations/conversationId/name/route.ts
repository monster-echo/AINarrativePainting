import { client, getInfo } from "@/app/api/utls/common"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { conversationId: string }
  }
) {
  const body = await request.json()
  const { name } = body
  const { conversationId } = params
  const { user } = getInfo(request)

  // auto generate name
  const { data } = await client.renameConversation(conversationId, name, user)
  return NextResponse.json(data)
}
