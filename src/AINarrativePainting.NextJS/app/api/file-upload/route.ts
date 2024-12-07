import { NextRequest } from "next/server"
import { client, getInfo } from "../utls/common"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const { user } = getInfo(request)
    formData.append("user", user)
    const res = await client.fileUpload(formData)
    return new Response(res.data.id as any)
  } catch (e: any) {
    return new Response(e.message)
  }
}
