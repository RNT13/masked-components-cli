'use client'

import { FormikFileInput } from './formikVariants/FormikFileInput'
import { FormikMaskedTextInput } from './formikVariants/FormikMaskedTextInput'
import { FormikPasswordInput } from './formikVariants/FormikPasswordInput'
import { FormikSearchInput } from './formikVariants/FormikSearchInput'
import { FormikSelectInput } from './formikVariants/FormikSelectInput'
import { FormikTextareaInput } from './formikVariants/FormikTextareaInput'
import { FormikTextInput } from './formikVariants/FormikTextInput'
import { InputProps } from './MaskedInput.types'

type Props = InputProps & { name: string }

export function FormikMInput(props: Props) {
  switch (props.variant) {
    case 'default':
      return <FormikTextInput {...props} />

    case 'textarea':
      return <FormikTextareaInput {...props} />

    case 'masked':
      return <FormikMaskedTextInput {...props} />

    case 'password':
      return <FormikPasswordInput {...props} />

    case 'select':
      return <FormikSelectInput {...props} />

    case 'file':
      return <FormikFileInput {...props} />

    case 'search':
      return <FormikSearchInput {...props} />

    default:
      return null
  }
}
