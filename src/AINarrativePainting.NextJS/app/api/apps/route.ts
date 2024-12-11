import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apps = [
      {
        id: 1,
        name: "文生图",
        description: "文生图可以发挥我们的创造力，让我们的想法变成精美的图片。",
        url: "http://192.168.1.220/v1",
        API_KEY: "app-fbFo2uaGnxYLdM8fdT7f4UQQ",
        avatar: "txt2img/avatar.png",
        image: "txt2img/background.png",
        category: "Creativity",
      },
      {
        id: 2,
        name: "图生图",
        description:
          "图生图是一个可以让我们将已有的图片调整为我们想要的风格的应用。",
        url: "http://192.168.1.220/v1",
        API_KEY: "app-fbFo2uaGnxYLdM8fdT7f4UQQ",
        avatar: "img2img/avatar.png",
        image: "img2img/background.png",
        category: "Creativity",
      },
      {
        id: 3,
        name: "MJ风格",
        description:
          "MJ风格是一个利用Flux.1和LoRA技术来创造MidJourney风格图片的应用。",
        url: "http://192.168.1.220/v1",
        API_KEY: "app-1tifCHTbKxr8ZJAPiRwOedZ3",
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
