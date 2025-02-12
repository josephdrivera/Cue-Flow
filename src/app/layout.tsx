import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import LayoutWrapper from '@/components/layout/layout-wrapper'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CueFlow',
  description: 'Technical Show Management System',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage = children.toString().includes('auth')

  // Create a function to handle redirects
  const handleAuth = () => {
    // Redirect to login if not authenticated and not on auth page
    if (!session && !isAuthPage) {
      return redirect('/auth/login')
    }

    // Redirect to dashboard if authenticated and on auth page
    if (session && isAuthPage) {
      return redirect('/dashboard')
    }
  }

  // Handle authentication redirects
  handleAuth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {isAuthPage ? (
            // Auth pages don't need the main layout
            <main className="flex min-h-screen flex-col items-center justify-center">
              {children}
            </main>
          ) : (
            // Main application layout
            <LayoutWrapper>{children}</LayoutWrapper>
          )}
        </Providers>
      </body>
    </html>
  )
}