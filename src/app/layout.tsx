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
  title: 'SandipAI — The Autonomous AI Sales Agent',
  description: 'SandipAI is an autonomous AI sales agent that qualifies inbound leads, resolves technical objections, and books high-value meetings 24/7.',
  icons: {
    icon: '/favicon.svg',
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
