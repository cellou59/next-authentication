import {cookies, headers} from 'next/headers'
import {randomUUID} from 'node:crypto'

import {
  addSession as addSessionDao,
  findSession as findSessionDao,
  deleteSession as deleteSessionDao,
  updateSession as updateSessionDao,
  findSessionByUidUserAgent,
} from '@/db/sgbd'

import {decrypt, encrypt, EXPIRE_TIME, isExpired} from './crypt'

export async function createSession(uid: string) {
  const expiresAt = new Date(Date.now() + EXPIRE_TIME)
  const cookieStore = await cookies()
  const headersList = await headers()
  const userAgent = headersList.get('User-Agent')
  const sessionByUid = await findSessionByUidUserAgent(uid, userAgent ?? '')

  if (sessionByUid && !isExpired(sessionByUid?.expiresAt)) {
    await updateSessionDao({
      ...sessionByUid,
      expiresAt: expiresAt.toISOString(),
    })
    const session = await encrypt({
      sessionId: sessionByUid.sessionId,
      expiresAt,
    })
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    })
    return
  }

  const sessionId = randomUUID()
  await addSessionDao({
    sessionId,
    userId: uid,
    expiresAt: expiresAt.toISOString(),
    userAgent,
  })

  const session = await encrypt({sessionId, expiresAt})
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function verifySession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)

  if (!session || !session.sessionId) {
    console.log('verifySession No session found')
    return
  }
  const sessionDao = await findSessionDao(session.sessionId)
  if (sessionDao && !isExpired(sessionDao?.expiresAt)) {
    return {
      isAuth: true,
      userId: sessionDao.userId,
      sessionId: session.sessionId,
    }
  }

  return {isAuth: false}
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)
  if (session) {
    await deleteSessionDao(session.sessionId ?? '')
  }
  await cookieStore.delete('session')
}

//1. 🚀 Update Session
export async function updateSession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)

  if (!session || !session.sessionId) {
    console.log('verifySession No session found')
    return
  }

  const sessionDao = await findSessionDao(session.sessionId)
  if (sessionDao && !isExpired(sessionDao?.expiresAt)) {
    const expires = new Date(Date.now() + EXPIRE_TIME)

    // await updateSessionDao({
    //   ...sessionDao,
    //   expiresAt: expires.toISOString(),
    // })

    // cookieStore.set('session', session.sessionId, {
    //   httpOnly: true,
    //   secure: true,
    //   expires,
    //   sameSite: 'lax',
    //   path: '/',
    // })
  }
}
