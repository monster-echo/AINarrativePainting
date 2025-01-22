import { getApp } from "@/app/services/AppService"
import DifyClient, { DifyAPIError } from "@/app/services/dify"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const { appId: appId } = await params
  const app = getApp(parseInt(appId))
  const client = new DifyClient(app.apiKey, "user-123")
  const form = await request.formData()
  const file = form.get("file") as File

  try {
    return NextResponse.json(await client.upload(file))
  } catch (error) {
    if (error instanceof DifyAPIError) {
      const { code, message, status } = error
      return NextResponse.json(
        { error: message, code },
        { status: status || 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}
