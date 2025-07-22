//1. 🚀 Protéger les routes dashboard et bank-account
import {DashBoard} from '@/components/dash-board'
import withAuth from '../auth/lib/withAuth'

//🐶 Utilise le `HOC withAuth`
function Page() {
  return <DashBoard />
}
export default withAuth(Page)
