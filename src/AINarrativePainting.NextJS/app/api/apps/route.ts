import { NextRequest, NextResponse } from "next/server"
import { getApps } from "@/app/services/AppService"
import { DifyAPIError } from "@/app/services/dify"

export async function GET(request: NextRequest) {
  try {
    const apps = getApps()
    const appsWithoutApiKey = apps.map(({ apiKey, ...rest }) => rest)
    return NextResponse.json(appsWithoutApiKey)
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
