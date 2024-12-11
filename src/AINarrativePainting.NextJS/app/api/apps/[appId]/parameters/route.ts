import { NextRequest, NextResponse } from "next/server"
import { getInfo, getChatClient, setSession } from "@/app/api/utils/common"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const appId = parseInt((await params).appId)
  const { sessionId, user } = getInfo(request, appId)
  try {
    const client = getChatClient(appId)
    const { data } = await client.getApplicationParameters(user)
    return NextResponse.json(data as object, {
      headers: setSession(sessionId),
    })
  } catch (error) {
    return NextResponse.json([])
  }
}
