import Image from 'next/image'
import { css, cx } from '../../styled-system/css'
import type { Photo as PhotoData } from './data'

// A cropped photo filling its box, shown as taken in every theme. The box sets the size
// (an aspect ratio or explicit dimensions); `sizes` tells the browser how wide it renders.
export function Photo({ photo, sizes, preload, className }: { photo: PhotoData; sizes: string; preload?: boolean; className?: string }) {
  return (
    <div className={cx(css({ position: 'relative', overflow: 'hidden', bg: 'bg.subtle' }), className)}>
      <Image
        src={photo.id}
        alt={photo.alt}
        fill
        sizes={sizes}
        preload={preload}
        className={css({ objectFit: 'cover' })}
      />
    </div>
  )
}
