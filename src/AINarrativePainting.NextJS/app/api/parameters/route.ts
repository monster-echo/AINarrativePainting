import { NextRequest, NextResponse } from "next/server"
import { getInfo, client, setSession } from "../utils/common"

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  try {
    const { data } = await client.getApplicationParameters(user)
    return NextResponse.json(data as object, {
      headers: setSession(sessionId),
    })
  } catch (error) {
    return NextResponse.json([])
  }
}
