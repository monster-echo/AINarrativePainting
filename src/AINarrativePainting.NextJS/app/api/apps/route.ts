import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apps = [
      // {
      //   id: 1,
      //   name: "MJ风格",
      //   description:
      //     "MJ风格是一个利用Flux.1和LoRA技术来创造MidJourney风格图片的应用。",
      //   url: "http://192.168.1.220/v1",
      //   avatar: "img2img/avatar.png",
      //   image: "img2img/background.png",
      //   category: "Creativity",
      //   features: ["text", "aspect_ratio"],
      // },
      // {
      //   id: 2,
      //   name: "Flux 图生插画",
      //   description:
      //     "Flux 图生插画是一个利用Flux.1和LoRA技术来创造图生插画的应用。",
      //   avatar: "img2img/avatar.png",
      //   image: "img2img/flux_image2image.png",
      //   category: "Creativity",
      //   features: ["image_upload"],
      // },
      {
        id: 3,
        name: "Flux Agent 文生图",
        description:
          "Flux Agent 文生图是一个利用 Flux.1 dev 技术来创造文生图的应用。",
        avatar: "img2img/avatar.png",
        image: "img2img/flux_image2image.png",
        category: "Creativity",
        features: ["text"],
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
