type ImageProps = {
  src?: string
  alt?: string
} & React.HTMLAttributes<HTMLImageElement>

const Image = (props: ImageProps) => {
  const { src, onError, ...rest } = props

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    target.src = '/image_404.png'
    if (onError) {
      onError(e)
    }
  }

  return <img src={src} {...rest} onError={handleError}></img>
}

export default Image
