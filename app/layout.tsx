import type { Metadata, Viewport } from 'next'
import './globals.css'
import './home-adjustments.css'

export const metadata: Metadata = {
  title: {
    default: 'Internet de fibra óptica y 5G en El Salvador | Next IP',
    template: '%s | Next IP',
  },
  description: 'Conéctate con internet de fibra óptica simétrica y soluciones 5G de Next IP en El Salvador. Compara planes y consulta cobertura para tu ciudad.',
  metadataBase: new URL('https://nextip.network'),
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: { title: 'Internet de fibra óptica y 5G en El Salvador | Next IP', description: 'Conéctate con internet de fibra óptica simétrica y soluciones 5G de Next IP en El Salvador. Compara planes y consulta cobertura para tu ciudad.', type: 'website', locale: 'es_SV', url: 'https://nextip.network', siteName: 'Next IP Network', images: [{ url: '/images/wifi-connection.jpg', alt: 'Conexión WiFi para el hogar' }] },
  twitter: { card: 'summary_large_image', title: 'Internet de fibra óptica y 5G en El Salvador | Next IP', description: 'Fibra óptica simétrica y soluciones 5G de Next IP en El Salvador.', images: ['/images/wifi-connection.jpg'] },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/icon-removebg-preview.png',
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
      </body>
    </html>
  )
}
