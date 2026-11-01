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

export const activeStyles = css`
  color: var(--mc-btn-fg-active, ${({ theme }) => theme.colors.baseBlue.light40});
  background-image: var(
    --mc-btn-gradient-active,
    var(
      --mc-btn-gradient,
      linear-gradient(
        180deg,
        ${({ theme }) => theme.colors.baseBlue.light30},
        ${({ theme }) => theme.colors.baseBlue.dark30}
      )
    )
  );
  border: 2px solid var(--mc-btn-border-active, ${({ theme }) => theme.colors.baseBlue.light30});

  svg {
    color: inherit;
  }

  &:hover {
    background-image: var(
      --mc-btn-gradient-hover,
      linear-gradient(
        180deg,
        ${({ theme }) => theme.colors.baseBlue.dark30},
        ${({ theme }) => theme.colors.baseBlue.light30}
      )
    );
    color: var(--mc-btn-fg-hover, ${({ theme }) => theme.colors.baseBlue.dark40});
    border-color: var(--mc-btn-border-hover, ${({ theme }) => theme.colors.baseBlue.base});
  }
`

export const errorStyles = css`
  background-image: var(
    --mc-btn-danger-gradient,
    linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.baseRed.light08},
      ${({ theme }) => theme.colors.baseRed.dark}
    )
  );
  color: var(--mc-btn-danger-fg, ${({ theme }) => theme.colors.baseRed.light30});
  border-color: var(--mc-btn-danger-border, ${({ theme }) => theme.colors.baseRed.light08});

  &:hover {
    background-image: var(
      --mc-btn-danger-gradient-hover,
      linear-gradient(
        180deg,
        ${({ theme }) => theme.colors.baseRed.dark},
        ${({ theme }) => theme.colors.baseRed.light08}
      )
    );
    color: var(--mc-btn-danger-fg, ${({ theme }) => theme.colors.baseRed.light40});
    border-color: var(--mc-btn-danger-border, ${({ theme }) => theme.colors.baseRed.light40});
  }
`

export const GradientButtonWrapper = styled.div<props>`
  display: flex;
  align-items: center;
  justify-content: ${({ $position }) => $position};
`

export const GradientButtonContainer = styled(BaseButton)<props>`
  color: var(--mc-btn-fg, ${({ theme }) => theme.colors.baseBlue.light40});
  background-image: var(
    --mc-btn-gradient,
    linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.baseBlue.light},
      ${({ theme }) => theme.colors.baseBlue.dark}
    )
  );
  border: 2px solid var(--mc-btn-border, ${({ theme }) => theme.colors.baseBlue.light02});

  &:hover {
    background-image: var(
      --mc-btn-gradient-hover,
      linear-gradient(
        180deg,
        ${({ theme }) => theme.colors.baseBlue.dark},
        ${({ theme }) => theme.colors.baseBlue.light}
      )
    );
    color: var(--mc-btn-fg-hover, ${({ theme }) => theme.colors.baseBlue.dark30});
    border-color: var(--mc-btn-border-hover, ${({ theme }) => theme.colors.baseBlue.base});
  }

  ${({ $isActive }) => $isActive && activeStyles}
  ${({ $isError }) => $isError && errorStyles}  
  ${({ $isDisabled }) => $isDisabled && disabledStyles}
`
