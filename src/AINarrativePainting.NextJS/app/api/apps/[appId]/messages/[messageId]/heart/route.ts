import { type NextRequest } from "next/server"
import { NextResponse } from "next/server"
import supabase from "@/app/api/utils/supabase"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string; appId: string }> }
) {
  const { appId: appIdString, messageId } = await params
  const appId = parseInt(appIdString)
  const body = await request.json()
  const { heart, filenames, prompt } = body
  const accessToken = request.headers.get("Authorization")

  if (accessToken) {
    const token = accessToken.replace("Bearer ", "")
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    const data = {
      app_id: appId.toString(),
      user_id: user?.id,
      message_id: messageId,
      heart,
      prompt,
      filenames: filenames?.join(","),
    }
    const response = await supabase.from("Messages").upsert([data])
    if (response.error) {
      return NextResponse.json({ error: response.statusText })
    }
  }
  return NextResponse.json({})
}
