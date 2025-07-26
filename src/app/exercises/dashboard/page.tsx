//1. 🚀 Protéger les routes dashbaord et bank-account
import {auth} from '@/auth'
import {DashBoard} from '@/components/dash-board'

async function Page() {
  const session = await auth()
  console.log('🚀 ~ Page ~ session:', session)

  if (!session) return <div>Not authenticated</div>
  return <DashBoard />
}
export default Page
