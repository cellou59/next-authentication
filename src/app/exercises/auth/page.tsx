import {Label} from '@/components/ui/label'
import withAuth from './lib/withAuth'
import {WithAuthProps} from './lib/type'
import ChangeRoleForm from './form/change-role-form'
import AdminChangeRoleForm from './form/admin-role-form'

async function Page({user}: WithAuthProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 text-center text-lg">
      <h1 className="mb-4 mt-4   text-center text-3xl font-bold">
        Page de gestion du compte
      </h1>
      <Label>
        Hello {user.email} ({user.role})
      </Label>
      <ChangeRoleForm />
      <AdminChangeRoleForm />
    </div>
  )
}
export default withAuth(Page)
