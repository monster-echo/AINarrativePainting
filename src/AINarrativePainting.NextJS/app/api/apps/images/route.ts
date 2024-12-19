import supabase from "@/app/api/utils/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest
  //   { params }: { params: Promise<{ skip: number; max_count: number }> }
) {
  //   const { skip, max_count } = await params

  const { data, error } = await supabase
    .from("Messages")
    .select("prompt, filenames")
    .eq("share", true)

  return NextResponse.json({
    images: data
      ?.filter((item) => item.filenames)
      .map((item) => {
        return {
          prompt: item.prompt,
          filenames: [],
          // filenames: item.filenames
          //   .split(",")
          //   .map((filename: string) =>
          //     client.signatureUrl(
          //       `dify-oss/tools/d8f62afb-7c20-4a9c-b0de-fbe02bb2a02e/${filename}`
          //     )
          //   ),
        }
      }),
  })
}
