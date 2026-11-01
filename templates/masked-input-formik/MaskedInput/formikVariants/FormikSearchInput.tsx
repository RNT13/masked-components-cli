'use client'

import { useField } from 'formik'
import { InputVariantMap } from '../MaskedInput.types'
import { SearchInput } from '../variants/SearchInput/SearchInput'

type Props = { name: string } & InputVariantMap['search']

export function FormikSearchInput({ name, ...props }: Props) {
  const [field, meta, helpers] = useField(name)

  return <SearchInput {...props} value={field.value} onChange={helpers.setValue} error={meta.error} touched={meta.touched} />
}
