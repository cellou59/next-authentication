import RegisterForm from '@/app/exercises/auth/form/register-form'

// 🐶 Importe `getConnectedUser` et `redirect`
import {getConnectedUser} from '../auth/lib/dal'
import {redirect} from 'next/navigation'

export default async function Page() {
  const user = await getConnectedUser()
  if (user) redirect('/exercises/logout')

  return (
    <div className="mx-auto max-w-2xl p-6 text-lg ">
      <RegisterForm></RegisterForm>
    </div>
  )
}
