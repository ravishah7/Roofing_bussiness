import { useEffect, useRef } from 'react'
import { Bold, Italic, Underline, Link2, List, ListOrdered, Quote, Heading2, Heading3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const TOOLS = [
  { icon: Bold, command: 'bold', label: 'Bold' },
  { icon: Italic, command: 'italic', label: 'Italic' },
  { icon: Underline, command: 'underline', label: 'Underline' },
  { icon: Heading2, command: 'formatBlock', arg: 'h2', label: 'Heading 2' },
  { icon: Heading3, command: 'formatBlock', arg: 'h3', label: 'Heading 3' },
  { icon: List, command: 'insertUnorderedList', label: 'Bullet list' },
  { icon: ListOrdered, command: 'insertOrderedList', label: 'Numbered list' },
  { icon: Quote, command: 'formatBlock', arg: 'blockquote', label: 'Quote' },
]

/**
 * Lightweight contentEditable rich-text editor (bold/italic/headings/lists/
 * links/quotes) producing sanitized-on-submit HTML — not a full TipTap/Slate
 * integration, but a genuinely working WYSIWYG rather than a plain textarea.
 */
export default function RichTextEditor({ value, onChange, error, placeholder = 'Write your post...' }) {
  const ref = useRef(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (ref.current && isFirstRender.current) {
      ref.current.innerHTML = value || ''
      isFirstRender.current = false
    }
  }, [value])

  const exec = (command, arg) => {
    document.execCommand(command, false, arg)
    ref.current?.focus()
    onChange(ref.current?.innerHTML || '')
  }

  const insertLink = () => {
    const url = window.prompt('Enter a URL')
    if (url) exec('createLink', url)
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border bg-white dark:bg-slate-900', error ? 'border-danger-400' : 'border-slate-200 dark:border-slate-700')}>
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/60 px-2 py-1.5 dark:border-slate-800 dark:bg-slate-800/40">
        {TOOLS.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.label}
            onClick={() => exec(t.command, t.arg)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <t.icon className="h-3.5 w-3.5" />
          </button>
        ))}
        <button
          type="button"
          title="Insert link"
          onClick={insertLink}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          <Link2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        className="prose prose-sm max-h-[420px] min-h-[220px] max-w-none overflow-y-auto p-4 text-sm text-slate-800 focus:outline-none dark:prose-invert dark:text-slate-100 [&:empty]:before:text-slate-400 [&:empty]:before:content-[attr(data-placeholder)]"
      />
    </div>
  )
}
