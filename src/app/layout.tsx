import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'ORYNVAI — The Autonomous AI Sales Agent',
  description: 'Convert your extra hours into revenue. ORYNVAI is an autonomous AI sales agent that qualifies enterprise inbound inquiries, handles objections, and books confirmed executive meetings 24/7.',
  openGraph: {
    title: 'ORYNVAI — The Autonomous AI Sales Agent',
    description: 'Convert your extra hours into revenue with 24/7 autonomous sales coverage.',
    siteName: 'ORYNVAI',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] antialiased selection:bg-[#0071e3]/20">
        {children}
      </body>
    </html>
  )
}
