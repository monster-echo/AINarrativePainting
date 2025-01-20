import { getApp } from "@/app/services/AppService"
import DifyClient, { DifyAPIError } from "@/app/services/dify"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const { appId: appId } = await params
  const app = getApp(parseInt(appId))
  const client = new DifyClient(app.apiKey, "user-123")
  const { searchParams } = new URL(request.url)
  const conversation_id = searchParams.get("conversation_id")
  const first_id = searchParams.get("first_id")
  const limit = searchParams.get("limit")
  if (!conversation_id) {
    return NextResponse.json(
      { error: "conversation_id is required" },
      { status: 400 }
    )
  }

  try {
    const messages = await client.getMessages({
      conversation_id,
      first_id: first_id,
      limit: limit ? parseInt(limit) : undefined,
    })
    return NextResponse.json(messages)
  } catch (error) {
    if (error instanceof DifyAPIError) {
      const { code, message, status } = error
      return NextResponse.json(
        { error: message, code },
        { status: status || 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}
