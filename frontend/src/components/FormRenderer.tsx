import { useMemo, useState } from 'react'
import type { FormField } from '../content/formConfigs'
import type { ChangeEvent, FormEvent } from 'react'

type Props<TPayload extends Record<string, unknown>> = {
  title: string
  fields: FormField[]
  submitText: string
  hint?: string
  initialValues?: Partial<TPayload>
  onSubmit: (payload: TPayload) => Promise<void>
}

export default function FormRenderer<TPayload extends Record<string, unknown>>({
  title,
  fields,
  submitText,
  hint,
  initialValues,
  onSubmit,
}: Props<TPayload>) {
  // Начальные значения формы (обычно пустые; но можно переиспользовать компонент).
  const initial = useMemo(() => {
    return (initialValues ?? {}) as Partial<TPayload>
  }, [initialValues])

  const [values, setValues] = useState<Partial<TPayload>>(initial)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string>('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    for (const f of fields) {
      if (!f.required) continue
      const v = (values as Record<string, unknown>)[f.name]
      if (v === undefined || v === null || String(v).trim() === '') {
        setStatus('error')
        setError(`Заполните поле: ${f.label}`)
        return
      }
    }

    try {
      setStatus('submitting')
      await onSubmit(values as TPayload)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Ошибка отправки')
    }
  }

  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      {hint ? <div className="hint">{hint}</div> : null}

      <form className="form" onSubmit={handleSubmit}>
        {fields.map((f) => {
          const value = (values as Record<string, unknown>)[f.name]
          const commonProps = {
            id: f.id,
            name: f.name,
            placeholder: f.placeholder,
            value: value === undefined || value === null ? '' : String(value),
            onChange: (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
              const raw = ev.target.value
              const next =
                f.type === 'number' ? (raw === '' ? (undefined as unknown) : Number(raw)) : raw
              setValues((prev) => ({ ...prev, [f.name]: next } as Partial<TPayload>))
            },
          }

          return (
            <div className="field" key={f.id}>
              <label htmlFor={f.id}>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea {...commonProps} />
              ) : f.type === 'select' ? (
                <select {...commonProps}>
                  <option value="" disabled>
                    Выберите
                  </option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input type={f.type === 'number' ? 'number' : f.type} {...commonProps} />
              )}
            </div>
          )
        })}

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Отправляем...' : submitText}
          </button>
          {status === 'success' ? (
            <div className="toast toast-good">Заявка отправлена. Спасибо!</div>
          ) : null}
          {status === 'error' ? <div className="toast toast-warn">{error}</div> : null}
        </div>
      </form>
    </section>
  )
}

