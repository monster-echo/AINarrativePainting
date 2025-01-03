import { Dify_API_URL, Supabase_Bucket } from "@/config"
import { NextRequest, NextResponse } from "next/server"
import supabase from "@/app/api/utils/supabase"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const query = new URL(req.url).searchParams
    const width = query.get("width")
    const height = query.get("height")

    const url = `${Dify_API_URL}/files/${id}/meta?${query}`
    const response = await fetch(url)
    if (!response.ok) {
      return NextResponse.error()
    }
    console.log("meta url", url)
    const filedata = await response.json()

    const data = await supabase.storage
      .from(Supabase_Bucket)
      .createSignedUrl(filedata.file_key, 600, {
        transform: {
          width: 64,
        },
      })
    const error = data.error
    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }
    console.log("signedUrl", data.data.signedUrl)
    return NextResponse.redirect(data.data.signedUrl)
  } catch (error) {
    console.error("Error handling file request:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
