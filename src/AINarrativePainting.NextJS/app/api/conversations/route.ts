import { NextRequest, NextResponse } from "next/server"
import { client, getInfo, setSession } from "../utils/common"

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  try {
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
