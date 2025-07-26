/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'
import type {NextAuthConfig} from 'next-auth'

// 🐶 Importe les providers `Google` et `Resend`
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import Credentials from 'next-auth/providers/credentials'

// 🐶 Importe `getUserByEmail` et `verifyPassword`
import {getUserByEmail} from './db/sgbg-unstorage'
import {verifyPassword} from './app/exercises/auth/lib/crypt'
import {UnstorageAdapter} from '@auth/unstorage-adapter'
import storage from './db/unstorage-store'
import {RoleEnum} from './lib/type'

console.log('process.env.NEXT_RUNTIME AUTH', process.env.NEXT_RUNTIME)
const protectedRoutes = new Set([
  '/exercises/dashboard',
  '/exercises/bank-account',
])
const publicRoutes = new Set(['/'])
const adminRoutes = new Set(['/admin'])
const redactorRoutes = new Set(['/redaction'])
export const {handlers, signIn, signOut, auth} = NextAuth({
  providers: [
    Google,
    Resend,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        const user = await getUserByEmail(credentials.email as string)

        if (!user) {
          throw new Error('User not found')
        }

        const passwordMatch = verifyPassword(
          user?.password as string,
          credentials.password as string
        )
        if (!passwordMatch) {
          throw new Error('Password incorrect.')
        }

        return user
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    authorized: async ({auth, request: {nextUrl}}) => {
      // Logged in users are authenticated, otherwise redirect to login page
      const hasSession = auth?.user?.email
      const path = nextUrl.pathname
      const isProtectedRoute = protectedRoutes.has(path)
      const isPublicRoute = publicRoutes.has(path)
      const isAdminRoute = adminRoutes.has(path)
      const isRedactorRoute = redactorRoutes.has(path)
      //prefere add ROLE to session than call BD in middleware
      const user = await getUserByEmail(auth?.user?.email as string)
      const role = user?.role

      if (isProtectedRoute && !hasSession) {
        return Response.redirect(new URL('/exercises/login', nextUrl))
      }
      //admin route
      if (
        isAdminRoute &&
        !role?.includes(RoleEnum.ADMIN) &&
        !role?.includes(RoleEnum.SUPER_ADMIN)
      ) {
        return Response.redirect(new URL('/restricted/', nextUrl))
      }
      // Redactor route
      if (
        isRedactorRoute &&
        !role?.includes(RoleEnum.ADMIN) &&
        !role?.includes(RoleEnum.SUPER_ADMIN) &&
        !role?.includes(RoleEnum.REDACTOR) &&
        !role?.includes(RoleEnum.MODERATOR)
      ) {
        return Response.redirect(new URL('/restricted/', nextUrl))
      }
      if (isPublicRoute && hasSession) {
        return Response.redirect(new URL('/exercises/auth', nextUrl))
      }
      return true
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  adapter: UnstorageAdapter(storage),
} satisfies NextAuthConfig)
