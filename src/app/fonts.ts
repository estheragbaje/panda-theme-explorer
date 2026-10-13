import {
  Bricolage_Grotesque,
  Courier_Prime,
  DM_Sans,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Kalam,
  M_PLUS_Rounded_1c,
  Martian_Mono,
  Patrick_Hand,
  Pixelify_Sans,
} from 'next/font/google'

// Every theme's faces, as CSS variables on <html>. Themes reference the variables in
// their fonts tokens. A font file downloads only when text set in it renders, so
// inactive themes cost nothing beyond the rail's display faces. Only Geist (the
// default theme) is preloaded.
// next/font needs literal options, so each call spells them out.
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

// Sketch
const kalam = Kalam({ variable: '--font-kalam', weight: '700', subsets: ['latin'], preload: false })
const patrickHand = Patrick_Hand({ variable: '--font-patrick-hand', weight: '400', subsets: ['latin'], preload: false })
const courierPrime = Courier_Prime({ variable: '--font-courier-prime', weight: ['400', '700'], subsets: ['latin'], preload: false })

// Riso
const bricolage = Bricolage_Grotesque({ variable: '--font-bricolage', subsets: ['latin'], preload: false })
const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'], preload: false })

// Blueprint
const plexMono = IBM_Plex_Mono({ variable: '--font-plex-mono', weight: ['400', '500', '600'], subsets: ['latin'], preload: false })
const plexSans = IBM_Plex_Sans({ variable: '--font-plex-sans', subsets: ['latin'], preload: false })

// Pixel
const pixelify = Pixelify_Sans({ variable: '--font-pixelify', subsets: ['latin'], preload: false })
const martianMono = Martian_Mono({ variable: '--font-martian-mono', subsets: ['latin'], preload: false })

// Panda
const mPlusRounded = M_PLUS_Rounded_1c({ variable: '--font-m-plus-rounded', weight: ['400', '500', '800'], subsets: ['latin'], preload: false })

export const fontVariables = [
  geistSans,
  geistMono,
  kalam,
  patrickHand,
  courierPrime,
  bricolage,
  dmSans,
  plexMono,
  plexSans,
  pixelify,
  martianMono,
  mPlusRounded,
]
  .map((font) => font.variable)
  .join(' ')
