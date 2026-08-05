export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-ember-500 dark:border-ink-700" />
        <p className="text-sm text-ink-400">Loading...</p>
      </div>
    </div>
  )
}
