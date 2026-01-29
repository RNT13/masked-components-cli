'use client'

import { useField } from 'formik'
import { InputVariantMap } from '../MaskedInput.types'
import { SelectInput } from '../variants/SelectInput'

type Props = { name: string } & InputVariantMap['select']

export function FormikSelectInput({ name, ...props }: Props) {
  const [field, meta, helpers] = useField(name)

  return <SelectInput {...props} variant="select" value={field.value} onChange={helpers.setValue} error={meta.error} touched={meta.touched} />
}
