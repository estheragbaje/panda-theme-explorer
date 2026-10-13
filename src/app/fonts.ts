import { Courier_Prime, Geist, Geist_Mono, Kalam, Patrick_Hand } from 'next/font/google'

// Every theme's faces, as CSS variables on <html>. Themes reference the variables in
// their fonts tokens. A font file downloads only when text set in it renders, so
// inactive themes cost nothing beyond the rail's display faces. Only Geist (the
// default theme) is preloaded.
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

// Sketch
const kalam = Kalam({ variable: '--font-kalam', weight: '700', subsets: ['latin'], preload: false })
const patrickHand = Patrick_Hand({ variable: '--font-patrick-hand', weight: '400', subsets: ['latin'], preload: false })
const courierPrime = Courier_Prime({ variable: '--font-courier-prime', weight: ['400', '700'], subsets: ['latin'], preload: false })

export const fontVariables = [geistSans, geistMono, kalam, patrickHand, courierPrime].map((font) => font.variable).join(' ')
