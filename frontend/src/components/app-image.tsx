import type { ImgHTMLAttributes } from 'react'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> & {
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
}

export default function AppImage({ fill, style, ...props }: Props) {
  return (
    <img
      {...props}
      style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style } : style}
    />
  )
}
