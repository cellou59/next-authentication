import 'server-only'

// 🐶 Importe cookies de next
import {cookies} from 'next/headers'

// 🐶 EXPIRE_TIME permet de jouer sur l'expiration du cookie
import {EXPIRE_TIME, decrypt, encrypt} from './crypt'

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + EXPIRE_TIME)
  const session = await encrypt({userId, expiresAt})

  // 🐶 Définit le cookie de session
  // 📑 https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: EXPIRE_TIME,
    sameSite: 'lax',
  })
}
export async function verifySession() {
  // 🐶 Récupère le cookie de session
  const cookie = await cookies()
  const cookieStore = cookie.get('session')?.value
  // 🐶 Decrypt le cookie pour avoir les informations de la session.
  const session = await decrypt(cookieStore)
  console.log('verifySession cookie', cookie, session)

  // 🐶 Si la session n'existe pas ou que l'userId n'est pas défini on return
  if (!session || !session.userId) {
    console.log('verifySession No session found')
    return
  }
  // 🐶 Retourne le userId de la session
  const userId = session.userId
  return {isAuth: true, userId}
}

export async function deleteSession() {
  // 🐶 Delete le cookie 'session'
  ;(await cookies()).set('session', '')
  // 📑 https://nextjs.org/docs/app/api-reference/functions/cookies#deleting-cookies
}
