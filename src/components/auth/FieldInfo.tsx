import type { AnyFieldApi } from '@tanstack/react-form'

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <div className="min-h-3">
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-500 text-[11px] leading-3">
          {field.state.meta.errors.join(', ')}
        </em>
      ) : field.state.meta.isValidating ? (
        <span className="text-amber-500 text-[11px] leading-3">Validating...</span>
      ) : (
        <span className="text-transparent text-[11px] leading-3">.</span>
      )}
    </div>
  )
}
