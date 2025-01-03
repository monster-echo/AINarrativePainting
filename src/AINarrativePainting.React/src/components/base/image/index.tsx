import { memo, forwardRef } from 'react'

type ImageProps = {
  src?: string
  alt?: string
} & React.HTMLAttributes<HTMLImageElement>

const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const { src, onError, ...rest } = props

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    target.src = '/image_404.png'
    if (onError) {
      onError(e)
    }
  }

  return <img ref={ref} src={src} {...rest} onError={handleError}></img>
})

export default memo(Image)
