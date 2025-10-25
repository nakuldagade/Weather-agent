import type { Metadata } from 'next'
import './globals.css'
import { SoundProvider } from '@/contexts/SoundContext'

export const metadata: Metadata = {
  title: 'Weather Agent Chat Interface',
  description: 'A responsive chat interface for weather information powered by AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SoundProvider>
          {children}
        </SoundProvider>
      </body>
    </html>
  )
}




