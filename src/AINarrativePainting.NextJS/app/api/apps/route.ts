import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apps = [
      {
        id: 1,
        name: "MJ风格",
        description:
          "MJ风格是一个利用Flux.1和LoRA技术来创造MidJourney风格图片的应用。",
        url: "http://192.168.1.220/v1",
        API_KEY: "app-RULaryb4d14q5ARY0VORv0iv",
        avatar: "img2img/avatar.png",
        image: "img2img/background.png",
        category: "Creativity",
      },
    ]
    return NextResponse.json(apps)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Dify apps" },
      { status: 500 }
    )
  }
}
