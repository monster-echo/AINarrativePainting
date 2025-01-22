import { NextRequest, NextResponse } from "next/server"
import { getApp, getApps } from "@/app/services/AppService"
import DifyClient, { DifyAPIError } from "@/app/services/dify"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const appId = parseInt((await params).appId)
  const app = getApp(appId)

  const client = new DifyClient(app.apiKey, "user-123")
  const formData = await request.formData()
  const audio = formData.get("audio") as File
  try {
    return NextResponse.json(await client.audioToText(audio))
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
