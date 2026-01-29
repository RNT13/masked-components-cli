'use client'

import { InputProps } from './MaskedInput.types'
import { CurrencyInput } from './variants/CurrencyInput'
import { FileInput } from './variants/FileInput'
import { MaskedInput } from './variants/MaskedInput'
import { PasswordInput } from './variants/PasswordInput'
import { SearchInput } from './variants/SearchInput'
import { SelectInput } from './variants/SelectInput'
import { TextareaInput } from './variants/TextareaInput'
import { TextInput } from './variants/TextInput'

export function MInput(props: InputProps) {
  switch (props.variant) {
    case 'default':
      return <TextInput {...props} />

    case 'textarea':
      return <TextareaInput {...props} />

    case 'masked':
      return <MaskedInput {...props} />

    case 'password':
      return <PasswordInput {...props} />

    case 'select':
      return <SelectInput {...props} />

    case 'file':
      return <FileInput {...props} />

    case 'search':
      return <SearchInput {...props} />

    case 'currency':
      return <CurrencyInput {...props} />

    default:
      return null
  }
}
