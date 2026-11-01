import { css, styled } from 'styled-components'
import { BaseButton } from '../../Base/BaseButton'
import { ButtonPosition } from '../../MaskedButton.types'

type props = {
  $isActive?: boolean
  $isError?: boolean
  $isDisabled?: boolean
  $position?: ButtonPosition
}

const disabledStyles = css`
  color: ${({ theme }) => theme.colors.baseBlack.light40};
  background-color: transparent;

  &:hover {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.baseBlack.light20};
    border-color: transparent;
  }
`

const activeStyles = css`
  color: var(--mc-btn-fg-active, ${({ theme }) => theme.colors.baseBlue.dark08});
  background-color: var(--mc-btn-bg-active, ${({ theme }) => theme.colors.baseBlue.dark02});
  border: 2px solid var(--mc-btn-border-active, ${({ theme }) => theme.colors.baseBlue.dark08});

  box-shadow: var(
    --mc-btn-shadow-active,
    0px 0px 10px 3px ${({ theme }) => theme.colors.baseBlue.base}
  );

  svg {
    color: inherit;
  }

  &:hover {
    color: var(--mc-btn-fg-hover, ${({ theme }) => theme.colors.baseBlue.dark20});
    background-color: var(--mc-btn-bg-hover, ${({ theme }) => theme.colors.baseBlue.light08});
    border-color: var(--mc-btn-border-hover, ${({ theme }) => theme.colors.baseBlue.dark08});
  }
`

const errorStyles = css`
  background-color: transparent;
  color: var(--mc-btn-danger-fg, ${({ theme }) => theme.colors.baseRed.light30});
  border-color: var(--mc-btn-danger-border, ${({ theme }) => theme.colors.baseRed.light08});

  &:hover {
    background-color: var(--mc-btn-danger-bg-hover, ${({ theme }) => theme.colors.baseRed.light04});
    color: var(--mc-btn-danger-fg, ${({ theme }) => theme.colors.baseRed.light40});
    border-color: var(--mc-btn-danger-border, ${({ theme }) => theme.colors.baseRed.light40});
  }
`

export const OutlineButtonWrapper = styled.div<props>`
  display: flex;
  align-items: center;
  justify-content: ${({ $position }) => $position};
`

export const OutlineButtonContainer = styled(BaseButton)<props>`
  color: var(--mc-btn-fg, ${({ theme }) => theme.colors.baseBlue.base});
  background-color: transparent;
  border: 2px solid var(--mc-btn-border, ${({ theme }) => theme.colors.baseBlue.base});

  &:hover {
    background-color: var(--mc-btn-bg-hover, ${({ theme }) => theme.colors.baseBlue.base});
    color: var(--mc-btn-fg-hover, ${({ theme }) => theme.colors.baseBlue.light20});
    border-color: var(--mc-btn-border-hover, ${({ theme }) => theme.colors.baseBlue.light20});
  }

  ${({ $isActive }) => $isActive && activeStyles}
  ${({ $isError }) => $isError && errorStyles}  
  ${({ $isDisabled }) => $isDisabled && disabledStyles}
`
