import { useState } from 'react'
import { FileUp, Sparkles } from 'lucide-react'
import { extractPaymentFn } from './dashboard.functions'
import { SMART_ADD_FILE_TYPES, SMART_ADD_MAX_FILE_BYTES } from './dashboard-utils'

type FileType = (typeof SMART_ADD_FILE_TYPES)[number]
export type ExtractedPayment = NonNullable<
  Awaited<ReturnType<typeof extractPaymentFn>>['payment']
>

const readAsBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    // A data URL: "data:<type>;base64,<data>"
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const isFileType = (type: string): type is FileType =>
  (SMART_ADD_FILE_TYPES as readonly string[]).includes(type)

/** Paste a bill or upload a photo/PDF of it; Claude suggests the payment. */
export function SmartAddPanel({ onFill }: { onFill: (payment: ExtractedPayment) => void }) {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [message, setMessage] = useState<{ isError: boolean; text: string } | null>(null)

  const handleFill = async () => {
    setMessage(null)
    if (file && !isFileType(file.type)) {
      setMessage({ isError: true, text: 'Use a JPG, PNG, GIF, or WebP photo, or a PDF.' })
      return
    }
    if (file && file.size > SMART_ADD_MAX_FILE_BYTES) {
      setMessage({ isError: true, text: 'That file is over 4 MB. Try a smaller photo or a screenshot.' })
      return
    }

    setIsReading(true)
    try {
      // The user's calendar day (YYYY-MM-DD), for due dates printed without a year
      const today = new Date().toLocaleDateString('en-CA')
      const res = await extractPaymentFn({
        data:
          file && isFileType(file.type)
            ? { file: { mediaType: file.type, data: await readAsBase64(file) }, today }
            : { text, today },
      })
      if (!res.success || !res.payment) {
        setMessage({ isError: true, text: res.error ?? "Claude couldn't read that." })
        return
      }
      onFill(res.payment)
      setMessage({
        isError: false,
        text: 'Filled in below. Check every field against your bill before saving.',
      })
    } catch (_error) {
      setMessage({ isError: true, text: "Couldn't read that right now. Please try again." })
    } finally {
      setIsReading(false)
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
        <Sparkles className="h-4 w-4 text-emerald-600" />
        Fill in from a bill with Claude
      </p>
      <textarea
        rows={3}
        maxLength={20_000}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={file !== null}
        placeholder="Paste a bill, statement, or subscription email"
        className="block w-full rounded-xl border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 disabled:opacity-50"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          <FileUp className="h-4 w-4" />
          {file ? file.name : 'Or upload a photo or PDF'}
          <input
            type="file"
            accept={SMART_ADD_FILE_TYPES.join(',')}
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file ? (
          <button
            type="button"
            onClick={() => setFile(null)}
            className="text-sm font-semibold text-gray-500 hover:text-gray-700"
          >
            Remove
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => void handleFill()}
          disabled={isReading || (!file && !text.trim())}
          className="ml-auto rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isReading ? 'Reading…' : 'Fill in'}
        </button>
      </div>
      {message ? (
        <p role="status" className={`text-sm ${message.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
          {message.text}
        </p>
      ) : null}
      <p className="text-xs text-gray-500">
        What you add here is sent to Claude, Anthropic's AI, to read it, and isn't stored by
        MoneyScope. Don't include full card or account numbers.
      </p>
    </div>
  )
}
