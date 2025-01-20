import { type NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getChatClient, getInfo, setSession } from "@/app/api/utils/common"
import supabase from "@/app/api/utils/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const appId = parseInt((await params).appId)

  const { sessionId, user } = getInfo(request, appId)
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get("conversation_id")

  const client = getChatClient(appId)

  console.log("appId", appId)


  const { data }: any = await client.getConversationMessages(
    user,
    conversationId as string
  )
  const accessToken = request.headers.get("Authorization")

  if (accessToken) {
    const token = accessToken.replace("Bearer ", "")
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    const user_id = user?.id
    // select * from Messages where conversation_id = conversationId order by created_at desc
    const { data: messages } = await supabase
      .from("Messages")
      .select("*")
      .eq("user_id", user_id)
      .eq("app_id", appId)
      .order("created_at", { ascending: false })
    if (messages) {
      data.data.forEach((message: any) => {
        const messageIndex = messages.findIndex(
          (m: any) => m.message_id === message.id
        )
        if (messageIndex > -1) {
          message.heart = messages[messageIndex].heart
          message.share = messages[messageIndex].share
        }
      })
    }
  }
  return NextResponse.json(data, {
    headers: setSession(sessionId),
  })
}
