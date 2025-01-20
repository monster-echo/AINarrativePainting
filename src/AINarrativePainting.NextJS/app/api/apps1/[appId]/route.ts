import { getApps, AppNotFoundError } from "@/app/services/AppService"
import { DifyAPIError } from "@/app/services/dify"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  try {
    const appId = parseInt((await params).appId)
    const app = getApps().find((app) => app.id === appId)
    if (!app) {
      throw new AppNotFoundError("App not found")
    }
    const { apiKey, ...rest } = app
    return NextResponse.json(rest)
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
