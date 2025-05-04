import {Button} from '@/components/ui/button'

function Page() {
  return (
    <div className="mx-auto flex max-w-2xl justify-center p-6 text-lg">
      <Logout />
    </div>
  )
}

function Logout() {
  return (
    <div className="flex flex-col">
      <h1 className="mb-4 text-center text-3xl font-bold">Déconnexion</h1>
      <Button type="submit">Logout</Button>
    </div>
  )
}

export default Page
