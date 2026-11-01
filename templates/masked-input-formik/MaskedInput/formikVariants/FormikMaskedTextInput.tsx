'use client'

import { useField } from 'formik'
import { InputVariantMap } from '../MaskedInput.types'
import { MaskedTextInput } from '../variants/MaskedTextInput/MaskedTextInput'

type Props = { name: string } & InputVariantMap['masked']

export function FormikMaskedTextInput({ name, ...props }: Props) {
  const [field, meta, helpers] = useField(name)

  return <MaskedTextInput {...props} variant="masked" value={field.value} onChange={helpers.setValue} error={meta.error} touched={meta.touched} />
}
