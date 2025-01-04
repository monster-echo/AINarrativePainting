import { resize } from "@/services/improxy"
import supabase from "../api/utils/supabase"
import { ImgProxyUrl } from "@/config"

const Welcome = async () => {
  const photo = "https://fakeimg.pl/350x200/ff0000/000"

  // const resizePhoto = resize(photo, { transform: { width: 100 } })
  // const watermarkPhoto = watermark(photo, "chinese")

  const data = await supabase.storage
    .from("aishuohua")
    .createSignedUrl("1.png", 60, {
      transform: {
        width: 100,
      },
    })

  console.log(data)

  const url = `http://192.168.1.220:5001/rs:fill:600:400:1/wm:1:soea:10:20:0.1/plain/${encodeURIComponent(
    photo
  )}`

  const isDev = process.env.NODE_ENV === "development"

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 ">
      {isDev && <img src={url} alt="" />}
      <h1 className="-mt-48">Welcome to the app!</h1>
    </div>
  )
}

export default Welcome
