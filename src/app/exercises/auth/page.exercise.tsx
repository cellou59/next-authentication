import {Label} from '@/components/ui/label'
import {verifySession} from './lib/session-stateless'
import {getUserById} from '@/db/sgbd'
// 🐶 Importe `cache` de react
import {cache, experimental_taintUniqueValue} from 'react'
import {User, UserDTO} from '@/lib/type'

async function Page() {
  // 🐶 Remplace `verifySession/getUserById` par `getConnectedUser` (à implementer en bas du fichier)
  const user = await getConnectedUser()
  console.log('Page : user', user)
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 text-center text-lg">
      {user ? (
        <Label>Hello {user.email}</Label>
      ) : (
        <Label>You are not connected</Label>
      )}
    </div>
  )
}
export default Page

// 🐶 Ajoute cette fonction en cache
// https://react.dev/reference/react/cache
export const getConnectedUser = cache(async () => {
  // 🐶 Utilise `verifySession` et `getUserById` pour retourner le `user` ou `undefined`
  const session = await verifySession()
  if (!session || !session?.isAuth) return
  console.log('getConnectedUser', session)
  try {
    const user = await getUserById(session.userId as string)
    if (!user) return
    return userDTO(user)
  } catch (error) {
    console.error('Failed to fetch user', error)
    return
  }
})

function userDTO(user: User): UserDTO {
  experimental_taintUniqueValue(
    'Do not pass the user password key to the client.',
    globalThis,
    user.password
  )
  return user
  // return {
  //   email: user?.email ?? '',
  //   name: user?.name,
  //   role: user?.role,
  // }
}
