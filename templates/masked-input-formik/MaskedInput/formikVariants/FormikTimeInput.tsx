'use client'

import { useField } from 'formik'
import { InputVariantMap } from '../../../masked-input/MaskedInput/MaskedInput.types'
import { TimeInput } from '../../../masked-input/MaskedInput/variants/TimeInput/TimeInput'

type Props = { name: string } & InputVariantMap['time']

export function FormikTimeInput({ name, ...props }: Props) {
  const [field, meta, helpers] = useField(name)

  return (
    <TimeInput
      {...props}
      variant="time"
      value={field.value}
      onChange={helpers.setValue}
      error={meta.error}
      touched={meta.touched}
    />
  )
}
