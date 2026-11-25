'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactElement
} from 'react'
import { cloneElement, isValidElement } from 'react'
import type {
  FormContextValue,
  FormErrors,
  FormValues,
  MaskedFieldProps,
  MaskedFormProps
} from './MaskedForm.types'

const FormContext = createContext<FormContextValue | null>(null)

/** Hook opcional para children customizados lerem o estado do form. */
export function useMaskedForm(): FormContextValue | null {
  return useContext(FormContext)
}

/**
 * Converte FormData em objeto. Names repetidos viram array;  
 * checkbox marcado envia seu `value` (ou 'on'); File permanece File.  
 */
export function formDataToValues(fd: FormData): FormValues {
  const values: FormValues = {}
  for (const [key, val] of fd.entries()) {
    if (key in values) {
      const prev = values[key]
      values[key] = Array.isArray(prev) ? [...prev, val] : [prev, val]
    } else {
      values[key] = val
    }
  }
  return values
}

/**
 * Formulário não-controlado: lê FormData no submit, valida nativamente  
 * (checkValidity) + `validators` por campo, injeta error/touched nos  
 * MaskedField. Sem dependências externas.  
 */
export function MaskedForm({
  onSubmit,
  validators,
  errors: externalErrors,
  revalidateOnChange = true,
  noValidate = false,
  children,
  className,
  style
}: MaskedFormProps) {
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const mergedErrors = useMemo(() => ({ ...errors, ...externalErrors }), [errors, externalErrors])
  const mergedTouched = useMemo(() => {
    const result = { ...touched }
    for (const name of Object.keys(externalErrors ?? {})) result[name] = true
    return result
  }, [touched, externalErrors])

  const markTouched = useCallback((name: string) => {
    setTouched((t) => (t[name] ? t : { ...t, [name]: true }))
  }, [])

  const runValidators = useCallback(
    (values: FormValues): FormErrors => {
      if (!validators) return {}
      const out: FormErrors = {}
      for (const [name, validate] of Object.entries(validators)) {
        const msg = validate(values[name], values)
        if (msg) out[name] = msg
      }
      return out
    },
    [validators]
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    // validação nativa (required, type=email, pattern, min/max)
    if (!noValidate && !form.checkValidity()) {
      form.reportValidity()
      return
    }

    const values = formDataToValues(new FormData(form))
    const fieldErrors = runValidators(values)

    setSubmitted(true)
    setTouched(
      Object.keys({ ...values, ...fieldErrors }).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    )
    setErrors(fieldErrors)

    if (Object.keys(fieldErrors).length > 0) {
      // foca o primeiro campo com erro
      const first = form.querySelector<HTMLElement>(
        '[aria-invalid="true"], .error input, input.error'
      )
      first?.focus()
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(values, event)
    } finally {
      setSubmitting(false)
    }
  }

  // revalidação onChange após primeiro submit
  function handleChange() {
    if (!submitted || !revalidateOnChange || !formRef.current) return
    const values = formDataToValues(new FormData(formRef.current))
    setErrors(runValidators(values))
  }

  const ctx = useMemo<FormContextValue>(
    () => ({ errors: mergedErrors, touched: mergedTouched, submitting, submitted, markTouched }),
    [mergedErrors, mergedTouched, submitting, submitted, markTouched]
  )

  return (
    <FormContext.Provider value={ctx}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        onChange={handleChange}
        noValidate={noValidate}
        aria-busy={submitting || undefined}
        className={className}
        style={style}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}

/**
 * Wrapper de campo: injeta `name`, `error` e `touched` no control filho.  
 * O filho deve aceitar essas props (todos os controls da lib aceitam).  
 */
export function MaskedField({ name, children }: MaskedFieldProps) {
  const ctx = useContext(FormContext)

  if (!isValidElement(children)) return children
  if (!ctx) {
    // fora de MaskedForm: só repassa o name
    return cloneElement(children as ReactElement<Record<string, unknown>>, { name })
  }

  const error = ctx.errors[name]
  const touched = ctx.touched[name] ?? ctx.submitted

  return cloneElement(children as ReactElement<Record<string, unknown>>, {
    name,
    error,
    touched,
    'aria-invalid': error ? true : undefined
  })
}
