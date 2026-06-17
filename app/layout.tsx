import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Fraunces, Newsreader } from 'next/font/google'
import './globals.css'

// Editorial tipografi: Fraunces = display başlık (yüksek kontrast serif),
// Newsreader = gövde metni (ekranda okunur editorial serif).
const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})
const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: { default: 'Social Panel', template: '%s — Social Panel' },
  description: 'Tüm sosyal medyan, tek ekranda',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Social Panel',
  },
  icons: {
    apple: [
      { url: '/api/icon/180', sizes: '180x180', type: 'image/png' },
      { url: '/api/icon/152', sizes: '152x152', type: 'image/png' },
      { url: '/api/icon/120', sizes: '120x120', type: 'image/png' },
    ],
    icon: [
      { url: '/api/icon/32',  sizes: '32x32',  type: 'image/png' },
      { url: '/api/icon/192', sizes: '192x192', type: 'image/png' },
    ],
  },
  applicationName: 'Social Panel',
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#06030F',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${serif.variable}`}>
      <body>
        {children}
        <Script id="sw-register" strategy="afterInteractive">
          {`if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{})}`}
        </Script>
      </body>
    </html>
  )
}
