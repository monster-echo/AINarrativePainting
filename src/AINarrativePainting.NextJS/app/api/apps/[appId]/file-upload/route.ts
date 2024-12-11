import { NextRequest } from "next/server"
import { getChatClient, getInfo } from "@/app/api/utils/common"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  try {
    const appId = parseInt((await params).appId)
    const client = getChatClient(appId)
    const formData = await request.formData()

    const { user } = getInfo(request, appId)
    formData.append("user", user)
    const res = await client.fileUpload(formData)
    return new Response(res.data.id as any)
  } catch (e: any) {
    return new Response(e.message)
  }
}
