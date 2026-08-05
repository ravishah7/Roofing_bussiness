import { useState } from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown, Settings2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { TableSkeleton } from './Skeleton'
import EmptyState from './EmptyState'
import Pagination from './Pagination'
import Dropdown from './Dropdown'
import Button from './Button'
import { cn } from '@/lib/utils'

/**
 * Professional data table: sorting, row selection + bulk actions,
 * column visibility toggle, pagination, loading skeletons, empty state.
 *
 * `columns`: [{ key, label, sortable, render(row), hideable }]
 */
export default function DataTable({
  columns,
  data = [],
  loading,
  meta,
  page,
  onPageChange,
  sort,
  onSortChange,
  selectable = true,
  bulkActions,
  emptyState,
  rowKey = '_id',
}) {
  const [selected, setSelected] = useState([])
  const [hiddenCols, setHiddenCols] = useState([])

  const visibleColumns = columns.filter((c) => !hiddenCols.includes(c.key))
  const allSelected = data.length > 0 && selected.length === data.length

  const toggleAll = () => setSelected(allSelected ? [] : data.map((d) => d[rowKey]))
  const toggleRow = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const handleSort = (key) => {
    if (!onSortChange) return
    if (sort === key) onSortChange(`-${key}`)
    else if (sort === `-${key}`) onSortChange(undefined)
    else onSortChange(key)
  }

  if (loading) {
    return (
      <div>
        <TableSkeleton cols={columns.length + (selectable ? 1 : 0)} />
      </div>
    )
  }

  if (!loading && data.length === 0) {
    return emptyState || <EmptyState title="No results found" description="Try adjusting your filters or search." />
  }

  return (
    <div>
      <AnimatePresence>
        {selectable && selected.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-brand-100 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-500/10"
          >
            <div className="flex items-center justify-between px-6 py-3">
              <p className="text-sm font-medium text-brand-700 dark:text-brand-300">{selected.length} selected</p>
              <div className="flex items-center gap-2">
                {bulkActions?.map((action) => (
                  <Button
                    key={action.label}
                    size="sm"
                    variant={action.variant || 'outline'}
                    icon={action.icon}
                    onClick={() => {
                      action.onClick(selected)
                      setSelected([])
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
                <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
                  Clear
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              {selectable && (
                <th className="w-10 px-6 py-3">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
                </th>
              )}
              {visibleColumns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {col.sortable ? (
                    <button onClick={() => handleSort(col.key)} className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200">
                      {col.label}
                      {sort === col.key ? <ArrowUp className="h-3 w-3" /> : sort === `-${col.key}` ? <ArrowDown className="h-3 w-3" /> : <ArrowUpDown className="h-3 w-3 opacity-40" />}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              <th className="w-10 px-4 py-3">
                <Dropdown
                  align="right"
                  width="w-52"
                  trigger={
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Settings2 className="h-3.5 w-3.5" />
                    </button>
                  }
                >
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Columns</div>
                  {columns.filter((c) => c.hideable !== false).map((col) => (
                    <label key={col.key} className="flex cursor-pointer items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                      <input
                        type="checkbox"
                        checked={!hiddenCols.includes(col.key)}
                        onChange={() =>
                          setHiddenCols((h) => (h.includes(col.key) ? h.filter((k) => k !== col.key) : [...h, col.key]))
                        }
                        className="h-3.5 w-3.5 rounded border-slate-300 text-brand-500"
                      />
                      {col.label}
                    </label>
                  ))}
                </Dropdown>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.map((row, i) => (
              <motion.tr
                key={row[rowKey] || i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className={cn(
                  'transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  selected.includes(row[rowKey]) && 'bg-brand-50/60 dark:bg-brand-500/5'
                )}
              >
                {selectable && (
                  <td className="px-6 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.includes(row[rowKey])}
                      onChange={() => toggleRow(row[rowKey])}
                      className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                    />
                  </td>
                )}
                {visibleColumns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                <td />
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && (
        <Pagination page={page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onPageChange={onPageChange} />
      )}
    </div>
  )
}
