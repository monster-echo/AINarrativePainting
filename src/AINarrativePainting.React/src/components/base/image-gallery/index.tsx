import { memo } from 'react'

const ImageGallery = ({ srcs }: { srcs: string[] }) => {
  return (
    <>
      {srcs.map((src, index) => (
        <img
          key={index}
          src={src}
          alt=""
          className="w-full"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      ))}
    </>
  )
}

export default memo(ImageGallery)
