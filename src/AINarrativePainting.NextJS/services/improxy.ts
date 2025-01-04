import { ImgProxyUrl } from "@/config"

export const resize = (
  imageUrl: string,
  {
    transform,
  }: {
    transform?: { width: number; height?: number }
  }
) => {
  const imgProxyUrl = ImgProxyUrl
  let operation = ""
  if (transform) {
    operation = `width:${transform.width}`
    if (transform.height) {
      operation += `/height:${transform.height}`
    }
    operation += `/resizing_type:fit`
  }
  return `${imgProxyUrl}/${operation}/plain/${encodeURIComponent(imageUrl)}`
}

// export const watermark = (imageUrl: string, watermarkText: string) => {
//   const imgProxyUrl = ImgProxyUrl
//   const operation = "watermark:mark"

//   return `${imgProxyUrl}/${operation}/plain/${encodeURIComponent(imageUrl)}`
// }
