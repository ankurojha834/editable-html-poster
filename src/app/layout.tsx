import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Editable HTML Poster',
  description: 'A visual HTML poster editor with drag-and-drop functionality',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}