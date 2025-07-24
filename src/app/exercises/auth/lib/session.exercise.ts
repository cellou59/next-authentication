/* eslint-disable no-restricted-imports */
import {SessionType} from './type'

import {
  createSession as createSessionDb,
  deleteSession as deleteSessionDb,
  verifySession as verifySessionDb,
  updateSession as updateSessionDb,
} from './session-database'

import {
  createSession as createSessionStateLess,
  deleteSession as deleteSessionStateLess,
  updateSession as updateSessionStateLess,
  verifySession as verifySessionStateless,
} from './session-stateless'

// 🐶 Récupère le type de session définie en variable d'environnement
const SESSION_TYPE: SessionType = process.env.SESSION_TYPE as SessionType

// 🐶 Implémente le `Strategy Pattern`
export async function createSession(userId: string) {
  switch (SESSION_TYPE) {
    case SessionType.STATELESS: {
      return await createSessionStateLess(userId)
    }
    case SessionType.DATABASE: {
      return await createSessionDb(userId)
    }
    default: {
      throw new Error('Invalid session type')
    }
  }
}

// 🐶 Implémente le `Strategy Pattern`
export async function verifySession() {
  switch (SESSION_TYPE) {
    case SessionType.STATELESS: {
      return await verifySessionStateless()
    }
    case SessionType.DATABASE: {
      return await verifySessionDb()
    }
    default: {
      throw new Error('Invalid session type')
    }
  }
}

// 🐶 Implémente le `Strategy Pattern`
export async function updateSession() {
  switch (SESSION_TYPE) {
    case SessionType.STATELESS: {
      return await updateSessionStateLess()
    }
    case SessionType.DATABASE: {
      return await updateSessionDb()
    }
    default: {
      throw new Error('Invalid session type')
    }
  }
}

// 🐶 Implémente le `Strategy Pattern`
export async function deleteSession() {
  switch (SESSION_TYPE) {
    case SessionType.STATELESS: {
      return await deleteSessionStateLess()
    }
    case SessionType.DATABASE: {
      return await deleteSessionDb()
    }
    default: {
      throw new Error('Invalid session type')
    }
  }
}
