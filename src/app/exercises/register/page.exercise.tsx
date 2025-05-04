import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl p-6 text-lg ">
      {/* 🐶 Modifie `<RegisterForm>` pour ajouter les champs `email` / `password` / `confirmPassword`  */}
      <RegisterForm></RegisterForm>
    </div>
  )
}

function RegisterForm() {
  return (
    <div>
      <h1 className="mb-4 text-center text-3xl font-bold">Register</h1>
      <form>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="mb-4"
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="mb-4"
        />

        <Input
          type="password"
          name="confirmPassword"
          required
          className="mb-4"
          placeholder="Confirm Password"
        />
        <div className="flex justify-end">
          <LoginButton />
        </div>
      </form>
    </div>
  )
}
function LoginButton() {
  return <Button type="submit">Register</Button>
}
