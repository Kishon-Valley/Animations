import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Physics Animations',
  description: 'Interactive visualizations to help you understand physics concepts',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
          {children}
        </div>
      </body>
    </html>
  )
}
