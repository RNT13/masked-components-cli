'use client'

import { useField } from 'formik'
import { InputVariantMap } from '../MaskedInput.types'
import { TextInput } from '../variants/TextInput'

type Props = { name: string } & InputVariantMap['default']

export function FormikTextInput({ name, ...props }: Props) {
  const [field, meta, helpers] = useField(name)

  return <TextInput {...props} variant="default" value={field.value} onChange={helpers.setValue} error={meta.error} touched={meta.touched} />
}
