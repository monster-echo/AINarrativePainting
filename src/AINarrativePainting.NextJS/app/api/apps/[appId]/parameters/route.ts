import { NextRequest, NextResponse } from "next/server"
import { getInfo, getChatClient, setSession } from "@/app/api/utils/common"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const { sessionId, user } = getInfo(request)
  try {
    const client = getChatClient(parseInt((await params).appId))
    const { data } = await client.getApplicationParameters(user)
    return NextResponse.json(data as object, {
      headers: setSession(sessionId),
    })
  } catch (error) {
    return NextResponse.json([])
  }
}
