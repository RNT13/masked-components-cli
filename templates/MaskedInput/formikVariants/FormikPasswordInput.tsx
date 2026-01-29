'use client'

import { useField } from 'formik'
import { InputVariantMap } from '../MaskedInput.types'
import { PasswordInput } from '../variants/PasswordInput'

type Props = { name: string } & InputVariantMap['password']

export function FormikPasswordInput({ name, ...props }: Props) {
  const [field, meta, helpers] = useField(name)

  return <PasswordInput {...props} variant="password" value={field.value} onChange={helpers.setValue} error={meta.error} touched={meta.touched} />
}
