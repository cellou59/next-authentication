import {cookies} from 'next/headers'
import {NextResponse, type NextRequest} from 'next/server'
import {decrypt} from './app/exercises/auth/lib/crypt'
import {RoleEnum} from './lib/type'
import {getUserById} from './db/sgbd'
import {error} from 'console'

const protectedRoutes = new Set([
  '/exercises/dashboard',
  '/exercises/bank-account',
])
const publicRoutes = new Set(['/'])

const adminRoute = new Set(['/admin'])
const redactorRoute = new Set(['/redaction'])

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.has(path)
  const isPublicRoute = publicRoutes.has(path)

  const isAdminRoute = adminRoute.has(path)
  const isRedactorRoute = redactorRoute.has(path)

  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)

  const hasSession = session?.userId || session?.sessionId

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL('/exercises/login', request.nextUrl))
  }

  if (isAdminRoute && session?.role !== RoleEnum.ADMIN) {
    return NextResponse.redirect(new URL('/restricted/', request.nextUrl))
  }

  if (isRedactorRoute && session?.role !== RoleEnum.REDACTOR) {
    return NextResponse.redirect(new URL('/restricted/', request.nextUrl))
  }

  if (isPublicRoute && hasSession) {
    return NextResponse.redirect(new URL('/exercises/auth', request.nextUrl))
  }
  NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
