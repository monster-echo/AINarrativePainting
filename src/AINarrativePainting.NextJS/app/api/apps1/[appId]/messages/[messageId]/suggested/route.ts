import { getApp } from "@/app/services/AppService"
import DifyClient, { DifyAPIError } from "@/app/services/dify"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string; appId: string }> }
) {
  const { messageId: message_id, appId: appId } = await params
  const app = getApp(parseInt(appId))
  const client = new DifyClient(app.apiKey, "user-123")

  try {
    return NextResponse.json(await client.suggested(message_id))
  } catch (error) {
    if (error instanceof DifyAPIError) {
      const { code, message, status } = error
      return NextResponse.json(
        { error: message, code },
        { status: status || 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    )
  }
}
