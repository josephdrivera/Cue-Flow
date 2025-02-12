import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { cache } from 'react'

export const createClient = cache(async () => {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set: async (name: string, value: string, options: CookieOptions) => {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie setting error
          }
        },
        remove: async (name: string, options: CookieOptions) => {
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            // Handle cookie removal error
          }
        },
      },
    }
  )
})