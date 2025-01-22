import { NextRequest, NextResponse } from "next/server"
import { getApp, getApps } from "@/app/services/AppService"
import DifyClient, { DifyAPIError } from "@/app/services/dify"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string; appId: string }> }
) {
  const conversation_id = (await params).conversationId

  const appId = parseInt((await params).appId)
  const app = getApp(appId)

  const client = new DifyClient(app.apiKey, "user-123")
  const { name, auto_generate } = await request.json()

  try {
    return NextResponse.json(
      await client.rename(conversation_id, { auto_generate, name })
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
      { error: "Failed to fetch Dify apps" },
      { status: 500 }
    )
  }
}
