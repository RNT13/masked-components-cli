import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled from 'styled-components'

export const CurrencyWrapper = styled.div<{ $symbolPosition?: 'prefix' | 'suffix' }>`
  position: relative;

  span {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 900;
    font-size: 1.2rem;
    color: var(--mc-input-icon-fg, ${maskedTheme.colors.baseBlue.dark});
    ${({ $symbolPosition }) => ($symbolPosition === 'suffix' ? 'right: 12px;' : 'left: 12px;')}
  }

  input {
    ${({ $symbolPosition }) =>
      $symbolPosition === 'suffix' ? 'padding-right: 44px;' : 'padding-left: 44px;'}
  }
`
