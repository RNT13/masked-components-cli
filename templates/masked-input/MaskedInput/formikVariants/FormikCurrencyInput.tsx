'use client'

import { useField } from 'formik'
import { InputVariantMap } from '../MaskedInput.types'
import { CurrencyInput } from '../variants/CurrencyInput'

type Props = { name: string } & InputVariantMap['currency']

export function FormikCurrencyInput({ name, ...props }: Props) {
  const [field, meta, helpers] = useField(name)

  return <CurrencyInput {...props} variant="currency" value={field.value} onChange={helpers.setValue} error={meta.error} touched={meta.touched} />
}
