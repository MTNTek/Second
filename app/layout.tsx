import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { WebVitals } from '../src/components/WebVitals'

export const metadata: Metadata = {
  title: 'Perry Eden Group of Companies - Global Travel & Business Services',
  description: 'Your trusted partner for global travel, visa services, work permits, and business support. Based in Dubai, UAE.',
  keywords: 'travel services, visa applications, work permits, UAE jobs, document services, Dubai, immigration',
  authors: [{ name: 'Perry Eden Group' }],
  openGraph: {
    title: 'Perry Eden Group - Global Travel & Business Services',
    description: 'Professional travel, visa, and business services in Dubai, UAE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          {children}
          <WebVitals />
        </AuthProvider>
      </body>
    </html>
  )
}