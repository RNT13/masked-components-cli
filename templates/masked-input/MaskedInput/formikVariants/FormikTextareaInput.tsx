'use client'

import { useField } from 'formik'
import { InputVariantMap } from '../MaskedInput.types'
import { TextareaInput } from '../variants/TextareaInput'

type Props = { name: string } & InputVariantMap['textarea']

export function FormikTextareaInput({ name, ...props }: Props) {
  const [field, meta, helpers] = useField(name)

  return <TextareaInput {...props} variant="textarea" value={field.value} onChange={helpers.setValue} error={meta.error} touched={meta.touched} />
}
