import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  variant = 'danger',
  loading,
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm" title="">
      <div className="flex flex-col items-center py-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-100 text-danger-500 dark:bg-danger-500/15">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        <div className="mt-6 flex w-full gap-3">
          <Button variant="outline" className="flex-1 justify-center" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={variant} className="flex-1 justify-center" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
