import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import LayoutWrapper from '@/components/layout/layout-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CueFlow',
  description: 'Technical Show Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}