import { cn } from '@/lib/utils'

export default function Switch({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-1">
      {(label || description) && (
        <span>
          {label && <span className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
          {description && <span className="block text-xs text-slate-400">{description}</span>}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          // Flexbox + justify-start/justify-end keeps the thumb inside the
          // track by construction — no absolute positioning + translate-x
          // math that can drift outside the container if the button's
          // default border/padding isn't fully reset.
          'inline-flex h-6 w-11 shrink-0 items-center rounded-full border-0 p-0.5 outline-none transition-colors',
          checked ? 'justify-end bg-brand-500' : 'justify-start bg-slate-200 dark:bg-slate-700'
        )}
      >
        <span className="h-5 w-5 shrink-0 rounded-full bg-white shadow transition-transform" />
      </button>
    </label>
  )
}
