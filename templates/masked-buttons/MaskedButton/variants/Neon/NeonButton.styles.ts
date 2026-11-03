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
  color: var(--mc-btn-fg-active, ${({ theme }) => theme.colors.baseBlue.dark50});
  background-image: var(--mc-btn-gradient);
  border: 2px solid
    var(
      --mc-btn-border-active,
      var(
        --mc-btn-neon-color,
        ${({ theme }) => theme.colors.accentBlue?.base ?? theme.colors.baseBlue.base}
      )
    );

  box-shadow: var(
    --mc-btn-neon-shadow,
    0 0 13px
      var(
        --mc-btn-neon-color,
        ${({ theme }) => theme.colors.accentBlue?.base ?? theme.colors.baseBlue.base}
      )
  );

  svg {
    color: inherit;
  }

  &:hover {
    background-image: var(--mc-btn-gradient-hover, var(--mc-btn-gradient));
    color: var(--mc-btn-fg-hover, ${({ theme }) => theme.colors.baseBlue.dark50});
    border-color: var(
      --mc-btn-border-hover,
      var(
        --mc-btn-neon-color,
        ${({ theme }) => theme.colors.accentBlue?.base ?? theme.colors.baseBlue.base}
      )
    );
    box-shadow: var(
      --mc-btn-neon-shadow-hover,
      0 0 10px
        var(
          --mc-btn-neon-color,
          ${({ theme }) => theme.colors.accentBlue?.base ?? theme.colors.baseBlue.base}
        )
    );
  }
`

const errorStyles = css`
  background-image: var(
    --mc-btn-danger-gradient,
    linear-gradient(
      70deg,
      var(
        --mc-btn-neon-color,
        ${({ theme }) => theme.colors.accentBlue?.base ?? theme.colors.baseBlue.base}
      ),
      ${({ theme }) => theme.colors.baseRed.dark}
    )
  );
  color: var(--mc-btn-danger-fg, ${({ theme }) => theme.colors.baseRed.light30});
  border-color: var(
    --mc-btn-danger-border,
    var(--mc-btn-neon-color, ${({ theme }) => theme.colors.baseBlue.base})
  );

  &:hover {
    background-image: var(
      --mc-btn-danger-gradient-hover,
      linear-gradient(
        380deg,
        ${({ theme }) => theme.colors.baseRed.dark},
        var(--mc-btn-neon-color, ${({ theme }) => theme.colors.baseBlue.base})
      )
    );
    color: var(--mc-btn-danger-fg, ${({ theme }) => theme.colors.baseRed.light40});
    border-color: var(--mc-btn-danger-border, ${({ theme }) => theme.colors.baseRed.light40});
    box-shadow: 0 0 15px ${({ theme }) => theme.colors.baseRed.light40};
  }
`

export const NeonButtonWrapper = styled.div<props>`
  display: flex;
  align-items: center;
  justify-content: ${({ $position }) => $position};
`

export const NeonButtonContainer = styled(BaseButton)<props>`
  color: var(--mc-btn-fg, ${({ theme }) => theme.colors.baseBlue.dark50});
  background-image: var(
    --mc-btn-gradient,
    linear-gradient(
      70deg,
      ${({ theme }) => theme.colors.accentPink?.base ?? theme.colors.baseViolet.base},
      var(
        --mc-btn-neon-color,
        ${({ theme }) => theme.colors.accentBlue?.base ?? theme.colors.baseBlue.base}
      )
    )
  );
  border: 2px solid
    var(
      --mc-btn-border,
      var(
        --mc-btn-neon-color,
        ${({ theme }) => theme.colors.accentBlue?.base ?? theme.colors.baseBlue.base}
      )
    );

  &:hover {
    background-image: var(
      --mc-btn-gradient-hover,
      linear-gradient(
        380deg,
        var(
          --mc-btn-neon-color,
          ${({ theme }) => theme.colors.accentBlue?.base ?? theme.colors.baseBlue.base}
        ),
        ${({ theme }) => theme.colors.accentPink?.base ?? theme.colors.baseViolet.base}
      )
    );
    color: var(--mc-btn-fg-hover, ${({ theme }) => theme.colors.baseBlue.dark50});
    border-color: var(
      --mc-btn-border-hover,
      var(
        --mc-btn-neon-color,
        ${({ theme }) => theme.colors.accentBlue?.base ?? theme.colors.baseBlue.base}
      )
    );
    box-shadow: var(
      --mc-btn-neon-shadow-hover,
      0 0 10px
        var(
          --mc-btn-neon-color,
          ${({ theme }) => theme.colors.accentBlue?.base ?? theme.colors.baseBlue.base}
        )
    );
  }

  ${({ $isActive }) => $isActive && activeStyles}
  ${({ $isError }) => $isError && errorStyles}  
  ${({ $isDisabled }) => $isDisabled && disabledStyles}
`
