import { type NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getChatClient, getInfo } from "@/app/api/utils/common"
import supabase from "@/app/api/utils/supabase"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string; appId: string }> }
) {
  const appId = parseInt((await params).appId)
  const body = await request.json()
  const { share, filenames, prompt } = body

  const { messageId } = await params
  const { sessionId, user } = getInfo(request, appId)

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
      share: share,
      prompt,
      filenames: filenames?.join(","),
    }
    const response = await supabase.from("Messages").upsert([data])
    if (response.error) {
      return NextResponse.json({ error: response.statusText })
    }
    return NextResponse.json({})
  }
}
