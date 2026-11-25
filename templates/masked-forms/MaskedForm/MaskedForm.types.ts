import type { CSSProperties, FormEvent, ReactNode } from 'react'

/** Valores lidos do FormData — string, File ou array (names repetidos). */
export type FormValues = Record<string, unknown>

/**
 * Validador de campo: recebe o valor cru do FormData e todos os valores  
 * (para validação cruzada, ex.: confirmar senha). Retorna mensagem de erro  
 * ou null/undefined se válido.  
 */
export type FieldValidator = (value: unknown, values: FormValues) => string | null | undefined

export type FormValidators = Record<string, FieldValidator>

export type FormErrors = Record<string, string>

export type MaskedFormProps = {
  /**
   * Chamado no submit **após** validação nativa (required, type=email)  
   * e os `validators` passarem. Recebe os valores do FormData.  
   * Pode ser async — `submitting` fica true durante a Promise.  
   */
  onSubmit: (values: FormValues, event: FormEvent<HTMLFormElement>) => void | Promise<void>
  /**
   * Validadores por `name` de campo. Rodam depois da validação nativa  
   * do browser (checkValidity). Erros são injetados nos MaskedField.  
   */
  validators?: FormValidators
  /**
   * Erros externos (ex.: vindos da API após submit). Mesclados com os  
   * erros de validação — externos têm precedência.  
   */
  errors?: FormErrors
  /** Revalida o campo no change após o primeiro submit. Default: true. */
  revalidateOnChange?: boolean
  /** Desabilita a validação nativa do browser (novalidate). Default: false. */
  noValidate?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export type MaskedFieldProps = {
  /** `name` do campo — deve bater com o `name` do control filho. */
  name: string
  /**
   * Um único control (MaskedInput, MaskedButton variant checkbox/radio/switch,  
   * MaskedRadioGroup, MaskedButtonGroup). Recebe `name`, `error` e `touched`  
   * injetados via cloneElement.  
   */
  children: React.ReactElement
}

/** Contexto interno — não é API pública. */
export type FormContextValue = {
  errors: FormErrors
  touched: Record<string, boolean>
  submitting: boolean
  submitted: boolean
  markTouched: (name: string) => void
}
