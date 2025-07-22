import {Label} from '@/components/ui/label'

import withAuth from './lib/withAuth'
import {UserDTO} from './lib/type'

async function Page({user}: {user: UserDTO}) {
  console.log('Page : user', user)
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 text-center text-lg">
      <Label>Hello {user.email}</Label>
    </div>
  )
}

export default withAuth(Page)
