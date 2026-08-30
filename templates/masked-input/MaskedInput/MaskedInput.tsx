/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { JSX } from 'react'
import type { InputProps, SearchInputProps } from './MaskedInput.types'
import { CurrencyInput } from './variants/CurrencyInput/CurrencyInput'
import { FileInput } from './variants/FileInput/FileInput'
import { MaskedTextInput } from './variants/MaskedTextInput/MaskedTextInput'
import { PasswordInput } from './variants/PasswordInput/PasswordInput'
import { SearchInput } from './variants/SearchInput/SearchInput'
import { SelectInput } from './variants/SelectInput/SelectInput'
import { TextareaInput } from './variants/TextareaInput/TextareaInput'
import { TextInput } from './variants/TextInput/TextInput'
import { TimeInput } from './variants/TimeInput/TimeInput'

export function MaskedInput<T = any>(props: SearchInputProps<T> & { variant: 'search' }): JSX.Element
export function MaskedInput(props: InputProps): JSX.Element
export function MaskedInput(props: InputProps) {
  switch (props.variant) {
    case 'default':
      return <TextInput {...props} />

    case 'textarea':
      return <TextareaInput {...props} />

    case 'masked':
      return <MaskedTextInput {...props} />

    case 'password':
      return <PasswordInput {...props} />

    case 'select':
      return <SelectInput {...props} />

    case 'file':
      return <FileInput {...props} />

    case 'search':
      return <SearchInput {...(props as SearchInputProps<any> & { variant: 'search' })} />

    case 'currency':
      return <CurrencyInput {...props} />

    case 'time':
      return <TimeInput {...props} />

    default:
      return null
  }
}
