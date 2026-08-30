import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled from 'styled-components'

export const CurrencyWrapper = styled.div`
  position: relative;

  span {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    font-weight: 900;
    font-size: 1.2rem;
    color: ${maskedTheme.colors.baseBlue.dark};
  }

  input {
    padding-left: 44px;
  }
`
