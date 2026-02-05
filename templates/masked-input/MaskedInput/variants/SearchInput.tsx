'use client'

import { FiSearch } from 'react-icons/fi'
import { ErrorDiv, InputLabel, MaskedInputContainer, SearchIcon } from '../MaskedInput.styles'
import { InputVariantMap } from '../MaskedInput.types'

type Props = { variant: 'search' } & InputVariantMap['search']

export function SearchInput(props: Props) {
  const hasError = props.touched && props.error

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      props.onSearch?.(props.value ?? '')
    }
  }

  return (
    <MaskedInputContainer $variant="search" $radius={props.radius} data-error={hasError}>
      {props.label && (
        <InputLabel htmlFor={props.id}>
          {props.icon && props.icon}
          <span>{props.label}</span>
        </InputLabel>
      )}

      <SearchIcon>
        <FiSearch />
      </SearchIcon>

      <input
        id={props.id}
        type="search"
        value={props.value ?? ''}
        onChange={e => props.onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={props.placeholder}
        className={hasError ? 'error' : ''}
        style={{ paddingLeft: 40 }}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
      />

      {props.showError && hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
