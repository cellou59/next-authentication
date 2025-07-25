import 'server-only'
import {cache, experimental_taintUniqueValue as taintUniqueValue} from 'react'
import {verifySession, updateSession} from './session'
import {getUserById} from '@/db/sgbd'
import {User} from '@/lib/type'
import {UserDTO} from './type'

export const getConnectedUser = cache(async () => {
  const session = await verifySession()
  if (!session || !session?.isAuth) return
  updateSession()

  try {
    const user = await getUserById(session.userId as string)
    return userDTO(user as User)
  } catch (error) {
    console.error('Failed to fetch user', error)
    return
  }
})

export function userDTO(user: User): UserDTO {
  taintUniqueValue('Do not pass password to the client.', user, user?.password)
  // Autre exemple
  // experimental_taintObjectReference(
  //   'Do not pass ALL environment variables to the client.',
  //   process.env
  // )
  return {
    email: user?.email ?? '',
    name: user?.name,
    role: user?.role,
    //password: user?.password,
  }
}
