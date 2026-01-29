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
    <MaskedInputContainer $variant="search">
      {props.label && (
        <InputLabel>
          {props.icon && props.icon}
          {props.label && <label>{props.label}</label>}
        </InputLabel>
      )}

      <SearchIcon>
        <FiSearch />
      </SearchIcon>

      <input
        type="search"
        value={props.value ?? ''}
        onChange={e => props.onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={props.placeholder}
        className={hasError ? 'error' : ''}
        style={{ paddingLeft: 40 }}
      />

      {props.showError && hasError && <ErrorDiv>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
