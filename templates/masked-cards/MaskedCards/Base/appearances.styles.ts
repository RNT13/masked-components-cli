import { css } from 'styled-components'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import { CardAppearance } from '../MaskedCards.types'

/**
 * Aparências visuais independentes de $variant.
 * Centralizadas aqui — proibido duplicar estes estilos dentro das variantes.
 * Todas consomem tokens --mc-card-* com fallback do maskedTheme (claro/escuro).
 *
 * Prioridade de fundo: --mc-card-bg (tokens.bg/colorTheme) >
 * --mc-card-bg-prop (prop cardBg) > padrão da aparência.
 *
 * elevated  = visual atual da biblioteca (default de compatibilidade)
 * filled    = fundo suave (accent-soft ou bg derivado do colorTheme), sem sombra
 * outlined  = borda visível, sem sombra; hover/focus por borda
 * flat      = minimalista, sem sombra nem borda (dashboards densos)
 * gradient  = gradiente do acento via --mc-card-gradient; texto por contraste
 * glass     = translúcido + backdrop-blur, com fallback opaco via @supports
 */
export const appearanceStyles: Record<CardAppearance, ReturnType<typeof css>> = {
  elevated: css``,

  filled: css`
    background-color: var(
      --mc-card-bg,
      var(--mc-card-bg-prop, var(--mc-card-accent-soft, ${maskedTheme.colors.baseBlue.light40}))
    );
    border-color: transparent;
    box-shadow: none;

    &:hover {
      box-shadow: none;
    }
  `,

  outlined: css`
    border: 1px solid var(--mc-card-border, ${maskedTheme.colors.baseBlue.light20});
    box-shadow: none;

    &:hover {
      box-shadow: none;
      border-color: var(--mc-card-accent, ${maskedTheme.colors.baseBlue.base});
    }
  `,

  flat: css`
    background-color: var(--mc-card-bg, var(--mc-card-bg-prop, transparent));
    border-color: transparent;
    box-shadow: none;

    @media (hover: hover) {
      &:hover {
        box-shadow: none;
        background-color: var(
          --mc-card-bg,
          var(--mc-card-bg-prop, var(--mc-card-accent-soft, ${maskedTheme.colors.baseBlue.light40}))
        );
      }
    }
  `,

  /*
   * Gradiente do acento. As variáveis de texto dos filhos são definidas como
   * valores de classe a partir de --mc-card-gradient-fg (derivado por
   * contraste em cardTokens.ts quando há colorTheme; branco sem tema).
   * Tokens inline do consumidor (tokens.fg etc.) continuam vencendo.
   */
  gradient: css`
    --mc-card-fg: var(--mc-card-gradient-fg, #ffffff);
    --mc-card-muted-fg: var(--mc-card-gradient-muted-fg, rgba(255, 255, 255, 0.78));
    --mc-card-accent-fg: var(--mc-card-gradient-fg, #ffffff);
    --mc-card-faint-fg: var(--mc-card-gradient-muted-fg, rgba(255, 255, 255, 0.6));
    --mc-card-accent: var(--mc-card-gradient-fg, #ffffff);
    --mc-card-accent-soft: color-mix(in srgb, var(--mc-card-gradient-fg, #ffffff) 20%, transparent);
    --mc-card-icon-bg: color-mix(in srgb, var(--mc-card-gradient-fg, #ffffff) 20%, transparent);
    --mc-card-icon-fg: var(--mc-card-gradient-fg, #ffffff);

    background-image: var(
      --mc-card-gradient,
      linear-gradient(
        160deg,
        ${maskedTheme.colors.baseBlue.base},
        ${maskedTheme.colors.baseBlue.dark20}
      )
    );
    background-color: transparent;
    border-color: transparent;
    color: var(--mc-card-fg);
    box-shadow: var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()});
  `,

  /*
   * Translúcido + blur. Padrões derivados de --mc-card-bg/--mc-card-border
   * via color-mix (funciona em claro e escuro); fallbacks estáticos para
   * navegadores sem color-mix e sem backdrop-filter.
   */
  glass: css`
    background-color: var(--mc-card-glass-bg, rgba(255, 255, 255, 0.55));
    border: 1px solid var(--mc-card-glass-border, rgba(255, 255, 255, 0.35));

    @supports (color: color-mix(in srgb, red, blue)) {
      background-color: var(
        --mc-card-glass-bg,
        color-mix(
          in srgb,
          var(--mc-card-bg, var(--mc-card-bg-prop, ${maskedTheme.colors.baseBlue.light50})) 55%,
          transparent
        )
      );
      border-color: var(
        --mc-card-glass-border,
        color-mix(
          in srgb,
          var(--mc-card-border, ${maskedTheme.colors.baseBlue.light20}) 40%,
          transparent
        )
      );
    }

    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: var(--mc-card-shadow, ${maskedTheme.boxShadow.xs()});

    /* Fallback opaco quando backdrop-filter não é suportado */
    @supports not (backdrop-filter: blur(1px)) {
      background-color: var(
        --mc-card-bg,
        var(--mc-card-bg-prop, ${maskedTheme.colors.baseBlue.light50})
      );
      border-color: var(--mc-card-border, ${maskedTheme.colors.baseBlue.light20});
    }
  `
}
