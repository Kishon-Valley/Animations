import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Physics Animations',
  description: 'Interactive visualizations to help you understand physics concepts',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {children}
      </body>
    </html>
  )
}
