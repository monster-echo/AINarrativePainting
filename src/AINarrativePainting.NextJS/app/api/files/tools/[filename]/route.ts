import { COS_Bucket, Dify_API_URL } from "@/config"
import { NextRequest, NextResponse } from "next/server"

import Storage from "@/services/storage"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const filename = (await params).filename
    const query = new URL(req.url).searchParams
    const url = `${Dify_API_URL}/files/tools/${filename}?${query}`
    const fileKey = `tools/${filename}`
    const exists = await Storage.from(COS_Bucket).exists(fileKey)

    const widthParam = query.get("width")
    const heightParam = query.get("height")

    let width, height

    if (widthParam) {
      query.delete("width")
      width = parseInt(widthParam)
    }
    if (heightParam) {
      query.delete("height")
      height = parseInt(heightParam)
    }

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

    const transform = width
      ? {
          width,
          height,
        }
      : undefined

    const {
      data: { signedUrl },
      error: signedUrlError,
    } = await Storage.from(COS_Bucket).createSignedUrl(fileKey, 3600, {
      transform: transform,
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
