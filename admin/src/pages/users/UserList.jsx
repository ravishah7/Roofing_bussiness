import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus, Trash2, ShieldCheck } from 'lucide-react'
import { z } from 'zod'
import { useAuth } from '@/context/AuthContext'
import { useResourceList, useDeleteResource, useUpdateResource, useCreateResource } from '@/hooks/useResource'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeleton'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'
import Select from '@/components/forms/Select'
import { initials, formatDate } from '@/lib/utils'

const inviteSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'editor']),
})


export default function UserList() {
  const { admin: me } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useResourceList('users', { limit: 100 })
  const createUser = useCreateResource('users', { successMessage: 'Admin invited' })
  const updateUser = useUpdateResource('users', { successMessage: 'User updated' })
  const deleteUser = useDeleteResource('users', { successMessage: 'User removed' })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(inviteSchema), defaultValues: { role: 'editor' } })

  const onSubmit = (values) => {
    createUser.mutate(values, { onSuccess: () => { setModalOpen(false); reset() } })
  }

  const users = data?.data || []

  return (
    <div>
      <PageHeader title="Admin Users" description="Manage who has access to this dashboard." actions={<Button icon={UserPlus} onClick={() => setModalOpen(true)}>Invite Admin</Button>} />

      <Card>
        {isLoading ? (
          <TableSkeleton cols={4} />
        ) : users.length === 0 ? (
          <EmptyState icon={ShieldCheck} title="No other admins yet" description="Invite teammates to help manage the website." actionLabel="Invite Admin" onAction={() => setModalOpen(true)} />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u) => (
              <div key={u._id} className="flex items-center gap-4 px-6 py-4">
                {u.avatar?.url ? (
                  <img src={u.avatar.url} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">{initials(u.name)}</span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800 dark:text-slate-100">{u.name} {u._id === me?._id && <span className="text-xs text-slate-400">(you)</span>}</p>
                  <p className="text-xs text-slate-400">{u.email} · Joined {formatDate(u.createdAt)}</p>
                </div>
                <Select value={u.role} disabled={u._id === me?._id || u.role === 'super_admin'} onChange={(e) => updateUser.mutate({ id: u._id, data: { role: e.target.value } })} className="w-36">
                  <option value="super_admin" disabled>Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </Select>
                <label className="flex items-center gap-2 text-xs text-slate-500">
                  <input type="checkbox" checked={u.isActive} disabled={u._id === me?._id} onChange={(e) => updateUser.mutate({ id: u._id, data: { isActive: e.target.checked } })} className="h-3.5 w-3.5 rounded border-slate-300" />
                  Active
                </label>
                <button
                  disabled={u._id === me?._id}
                  onClick={() => setDeleteTarget(u)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-danger-100 hover:text-danger-500 disabled:opacity-30 dark:hover:bg-danger-500/15"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Invite New Admin"
        description="They'll receive a verification email at this address."
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>Send Invite</Button></>}
      >
        <form className="space-y-5">
          <FormField label="Name" error={errors.name?.message}><Input {...register('name')} error={!!errors.name} /></FormField>
          <FormField label="Email" error={errors.email?.message}><Input type="email" {...register('email')} error={!!errors.email} /></FormField>
          <FormField label="Temporary Password" error={errors.password?.message}><Input type="password" {...register('password')} error={!!errors.password} /></FormField>
          <FormField label="Role"><Select {...register('role')}><option value="editor">Editor</option><option value="admin">Admin</option></Select></FormField>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove this admin?"
        description={`${deleteTarget?.name} will lose access to the dashboard.`}
        loading={deleteUser.isPending}
        onConfirm={() => deleteUser.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
      />
    </div>
  )
}
