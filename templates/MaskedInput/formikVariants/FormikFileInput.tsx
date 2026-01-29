'use client'

import { useField } from 'formik'
import { InputVariantMap } from '../MaskedInput.types'
import { FileInput } from '../variants/FileInput'

type Props = {
  name: string
} & InputVariantMap['file']

export function FormikFileInput({ name, ...props }: Props) {
  const [, , helpers] = useField(name)

  return <FileInput {...props} variant="file" onChange={helpers.setValue} />
}
