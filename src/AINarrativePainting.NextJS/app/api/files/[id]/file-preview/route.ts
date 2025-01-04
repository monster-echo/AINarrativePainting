import { COS_Bucket, Dify_API_URL } from "@/config"
import { NextRequest, NextResponse } from "next/server"
import Storage from "@/services/storage"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const query = new URL(req.url).searchParams
    const url = `${Dify_API_URL}/files/${id}/file-preview?${query}`

    const fileKey = `files/uploads/${id}`
    const exists = await Storage.from(COS_Bucket).exists(fileKey)

    if (!exists) {
      const response = await fetch(url)
      const file = await response.blob()
      const { data, error } = await Storage.from(COS_Bucket).upload(
        fileKey,
        file
      )
      if (error) {
        return NextResponse.json(
          { error: "Can not upload file to storage" },
          { status: 400 }
        )
      }
    }
    const {
      data: { signedUrl },
      error: signedUrlError,
    } = await Storage.from(COS_Bucket).createSignedUrl(fileKey, 3600, {
      transform: {
        width: 256,
      },
    })
    if (signedUrlError) {
      return NextResponse.json(
        { error: "Can not get signed url" },
        { status: 400 }
      )
    }
    return NextResponse.redirect(signedUrl)
  } catch (error) {
    console.error("Error handling file request:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
