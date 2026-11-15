import styled, { css } from 'styled-components'
import { readableTextOn } from '@/utils/masked-utils'
import { BaseButton } from '../../Base/BaseButton'
import { ButtonPosition } from '../../MaskedButton.types'

type props = {
  $isActive?: boolean
  $isError?: boolean
  $isDisabled?: boolean
  $position?: ButtonPosition
}

const disabledStyles = css`
  color: ${({ theme }) => theme.colors.textMuted ?? theme.colors.baseBlack.light40};
  background-color: transparent;
  &:hover {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.textMuted ?? theme.colors.baseBlack.light20};
    border-color: transparent;
  }
`

const activeStyles = css`
  color: var(--mc-btn-fg-active, ${({ theme }) => theme.colors.basePureWhite?.base ?? '#fff'});
  background-color: var(--mc-btn-bg-active, ${({ theme }) => theme.colors.accentColor});
  border: 2px solid var(--mc-btn-border-active, ${({ theme }) => theme.colors.accentColor});
  box-shadow: var(
    --mc-btn-shadow-active,
    0px 0px 10px 1px ${({ theme }) => theme.colors.accentColor}
  );

  svg {
    color: inherit;
  }

  &:hover {
    color: var(--mc-btn-fg-hover, ${({ theme }) => theme.colors.basePureWhite?.base ?? '#fff'});
    background-color: var(--mc-btn-bg-hover, ${({ theme }) => theme.colors.accentColor});
    border-color: var(--mc-btn-border-hover, ${({ theme }) => theme.colors.accentColor});
  }
`

const errorStyles = css`
  background-color: var(
    --mc-btn-danger-bg,
    ${({ theme }) => theme.colors.dangerColor ?? theme.colors.baseRed.light08}
  );
  color: var(--mc-btn-danger-fg, ${({ theme }) => theme.colors.basePureWhite?.base ?? '#fff'});
  border-color: var(
    --mc-btn-danger-border,
    ${({ theme }) => theme.colors.dangerColor ?? theme.colors.baseRed.light08}
  );

  &:hover {
    background-color: var(
      --mc-btn-danger-bg-hover,
      ${({ theme }) => theme.colors.dangerColor ?? theme.colors.baseRed.dark}
    );
    color: var(--mc-btn-danger-fg, ${({ theme }) => theme.colors.basePureWhite?.base ?? '#fff'});
    border-color: var(
      --mc-btn-danger-border,
      ${({ theme }) => theme.colors.dangerColor ?? theme.colors.baseRed.dark30}
    );
  }
`

export const DefaultButtonWrapper = styled.div<props>`
  display: flex;
  align-items: center;
  justify-content: ${({ $position }) => $position};
`

/* Fallbacks seguem o TEMA (accentColor + texto legível via readableTextOn);
   --mc-btn-* continua com precedência quando colorTheme/tokens são passados. */
export const DefaultButtonContainer = styled(BaseButton)<props>`
  color: var(
    --mc-btn-fg,
    ${({ theme }) => readableTextOn(theme.colors.accentColor ?? theme.colors.baseBlue.base)}
  );
  background-color: var(
    --mc-btn-bg,
    ${({ theme }) => theme.colors.accentColor ?? theme.colors.baseBlue.base}
  );
  border: 2px solid
    var(--mc-btn-border, ${({ theme }) => theme.colors.accentColor ?? theme.colors.baseBlue.base});

  &:hover {
    background-color: var(
      --mc-btn-bg-hover,
      ${({ theme }) => theme.colors.accentColor ?? theme.colors.baseBlue.base}
    );
    color: var(
      --mc-btn-fg-hover,
      ${({ theme }) => readableTextOn(theme.colors.accentColor ?? theme.colors.baseBlue.base)}
    );
    border-color: var(
      --mc-btn-border-hover,
      ${({ theme }) => theme.colors.accentColor ?? theme.colors.baseBlue.base}
    );
    filter: brightness(1.12);
  }

  ${({ $isActive }) => $isActive && activeStyles}
  ${({ $isError }) => $isError && errorStyles}
  ${({ $isDisabled }) => $isDisabled && disabledStyles}
`
