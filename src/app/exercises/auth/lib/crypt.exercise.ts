import {json} from 'stream/consumers'
import {SessionPayload} from './type'

// 🐶 Importe les 2 fonctions de `JWT`
import {SignJWT, jwtVerify, base64url} from 'jose'
const ONE_MINUTE = 60 * 1000
export const EXPIRE_TIME = 10 * ONE_MINUTE //Expires in 10 minutes

// 🐶 Déclare la clé secrète (fichier .env.local)
const secretKey = process.env.SESSION_SECRET

// 🐶 Déclare si on utilise `JWT` ou non (fichier .env.local)
const useJwt = process.env.SESSION_USE_JWT === 'true'

// 🐶 Encode la clé secrète
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  console.log(`Encrypt ... payload`, payload)
  if (useJwt) {
    const alg = 'HS256'
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({alg})
      .setIssuedAt()
      .setIssuer('urn:example:issuer')
      .setAudience('urn:example:audience')
      .setExpirationTime('1h')
      .sign(key)

    return jwt
  }
  return JSON.stringify(payload)
}

export async function decrypt(
  session: string | undefined = ''
): Promise<SessionPayload | undefined> {
  if (!session) {
    return
  }

  const secretKey = process.env.SESSION_SECRET
  if (!secretKey) {
    return
  }
  const key = new TextEncoder().encode(secretKey)
  const jwt = session
  try {
    const {payload, protectedHeader} = await jwtVerify(jwt, key, {
      algorithms: ['HS256'],
    })
    return payload as SessionPayload
  } catch {
    return undefined
  }
}

export const isExpired = (expiresAt?: string) => {
  if (!expiresAt) {
    return true
  }
  return new Date(expiresAt) < new Date()
}
