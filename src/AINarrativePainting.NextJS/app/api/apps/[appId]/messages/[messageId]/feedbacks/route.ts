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

  const { rating, content } = await request.json()

  if (!message_id) {
    return NextResponse.json({ error: "Invalid message_id" }, { status: 400 })
  }

  if (rating !== "like" && rating !== "dislike") {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 })
  }

  try {
    return NextResponse.json(
      await client.feedback(message_id, {
        rating: rating,
        content: content,
      })
    )
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
