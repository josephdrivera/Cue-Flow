import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // For now, we'll allow all access while developing core features
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}