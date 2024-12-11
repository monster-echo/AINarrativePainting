import { NextRequest, NextResponse } from "next/server"
import { getChatClient, getInfo, setSession } from "@/app/api/utils/common"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const appId = parseInt((await params).appId)

  const { sessionId, user } = getInfo(request, appId)
  try {
    const client = getChatClient(appId)

    const { data }: any = await client.getConversations(user)
    return NextResponse.json(data, {
      headers: setSession(sessionId),
    })
  } catch (error: any) {
    return NextResponse.json({
      data: [],
      error: error.message,
    })
  }
}
