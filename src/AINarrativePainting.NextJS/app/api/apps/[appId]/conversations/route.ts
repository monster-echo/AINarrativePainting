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
  const last_id = searchParams.get("last_id")
  const limit = searchParams.get("limit")
  const sort_by = searchParams.get("sort_by")

  try {
    return NextResponse.json(
      await client.getList({
        limit: limit ? parseInt(limit) : undefined,
        last_id: last_id,
        sort_by: sort_by as any,
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
      { error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}
