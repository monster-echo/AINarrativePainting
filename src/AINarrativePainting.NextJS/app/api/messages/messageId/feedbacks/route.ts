import { getInfo, client } from "@/app/api/utls/common"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { messageId: string }
  }
) {
  const body = await request.json()
  const { rating } = body
  const { messageId } = params
  const { user } = getInfo(request)
  const { data } = await client.messageFeedback(messageId, rating, user)
  return NextResponse.json(data)
}
