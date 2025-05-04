import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'

function Page() {
  return (
    <div className="mx-auto max-w-2xl p-6  text-lg ">
      <LoginForm></LoginForm>
    </div>
  )
}

function LoginForm() {
  return (
    <div>
      <h1 className="mb-4 text-center text-3xl font-bold">Login</h1>
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
        <LoginButton />
      </form>
    </div>
  )
}
function LoginButton() {
  return <Button>Login</Button>
}

export default Page
