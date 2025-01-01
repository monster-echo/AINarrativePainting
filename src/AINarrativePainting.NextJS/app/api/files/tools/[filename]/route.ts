import supabase from "@/app/api/utils/supabase"
import { API_URL, Supabase_Bucket } from "@/config"
import { NextRequest, NextResponse } from "next/server"
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const filename = (await params).filename
    const query = new URL(req.url).searchParams

    const width = query.get("width")
    const height = query.get("height")

    const url = `${API_URL}/files/tools/meta/${filename}?${query}`
    const response = await fetch(url)
    if (!response.ok) {
      return NextResponse.error()
    }

    const filedata = await response.json()

    const transform =
      width || height
        ? {
            width: width ? parseInt(width) : undefined,
            height: height ? parseInt(height) : undefined,
          }
        : undefined

    const data = await supabase.storage
      .from(Supabase_Bucket)
      .createSignedUrl(filedata.file_key, 600, {
        transform,
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
