import Badge from './Badge'

const STATUS_MAP = {
  published: { tone: 'success', label: 'Published' },
  draft: { tone: 'slate', label: 'Draft' },
  archived: { tone: 'slate', label: 'Archived' },
  approved: { tone: 'success', label: 'Approved' },
  pending: { tone: 'warning', label: 'Pending' },
  rejected: { tone: 'danger', label: 'Rejected' },
  new: { tone: 'info', label: 'New' },
  in_progress: { tone: 'warning', label: 'In Progress' },
  resolved: { tone: 'success', label: 'Resolved' },
  spam: { tone: 'danger', label: 'Spam' },
  subscribed: { tone: 'success', label: 'Subscribed' },
  unsubscribed: { tone: 'slate', label: 'Unsubscribed' },
  active: { tone: 'success', label: 'Active' },
  inactive: { tone: 'slate', label: 'Inactive' },
}

export default function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] || { tone: 'slate', label: status }
  return (
    <Badge tone={cfg.tone} dot>
      {cfg.label}
    </Badge>
  )
}
