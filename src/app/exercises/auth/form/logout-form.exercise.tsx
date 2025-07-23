'use client'
import React, {useState} from 'react'
import {Button} from '@/components/ui/button'
import {logout} from '../actions'
// 🐶 Importe le hook `useRouter`
//  et non -> {redirect} from 'next/navigation' car nous sommes en RCC

import {useRouter} from 'next/navigation'

// 🐶 Modifie le composant `<LogoutButton>` pour faire la redirection
export default function Logout() {
  return (
    <div className="">
      <h1 className="mb-4 text-center text-3xl font-bold">Déconnexion</h1>
      <LogoutButton />
    </div>
  )
}
function LogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  // 📑 https://nextjs.org/docs/app/api-reference/functions/use-router

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setPending(true)
    await logout()
    setPending(false)
    router.push(`/exercises/`)
  }

  return (
    <Button onClick={handleClick} disabled={pending}>
      Logout
    </Button>
  )
}
