import { useCallback, useRef, useState } from 'react'
import { UploadCloud, X, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Drag-and-drop image uploader. Works both for a single cover image
 * (value = string URL) and multi-image galleries (value = array of URLs);
 * `onFilesSelected` receives the raw File[] for the parent to send to the
 * API — this component only handles the picking/preview UX.
 */
export default function ImageUpload({ value, onFilesSelected, onRemove, multiple = false, label, hint }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList || [])
      if (files.length) onFilesSelected(multiple ? files : [files[0]])
    },
    [multiple, onFilesSelected]
  )

  const previews = Array.isArray(value) ? value : value ? [value] : []

  return (
    <div className="flex flex-col gap-3">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <UploadCloud className="h-7 w-7 text-slate-400" />
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
          Drag &amp; drop or <span className="text-brand-600 dark:text-brand-400">browse</span>
        </p>
        <p className="mt-1 text-xs text-slate-400">{hint || 'PNG, JPG, or WEBP up to 8MB'}</p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {previews.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              {src ? (
                <img src={src} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                  <ImageIcon className="h-5 w-5 text-slate-400" />
                </div>
              )}
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(i)
                  }}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
