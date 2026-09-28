import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import './home-adjustments.css'

export const metadata: Metadata = {
  title: 'Next IP Network | Conexión que fluye',
  description: 'Internet rápido, claro y humano. Fibra, 5G y soluciones para empresas con soporte 24/7.',
  metadataBase: new URL('https://nextip.network'),
  openGraph: { title: 'Next IP Network | Conexión que fluye', description: 'Internet rápido, claro y humano para todo lo que importa.', type: 'website', url: 'https://nextip.network' },
  twitter: { card: 'summary_large_image', title: 'Next IP Network', description: 'Conectividad sin fronteras.' },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
