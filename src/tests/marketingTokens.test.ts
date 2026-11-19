import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { listColorThemes } from '../../templates/masked-themes/MaskedThemes/ColorThemes'
import { contrastRatio } from '../../templates/masked-utils/color'
import { resolveHeroTokens } from '../../templates/masked-marketing/MaskedHero/heroTokens'
import { resolveCTATokens } from '../../templates/masked-marketing/MaskedCTA/ctaTokens'
import { resolveNewsletterTokens } from '../../templates/masked-marketing/MaskedNewsletter/newsletterTokens'
import { resolveStatsTokens } from '../../templates/masked-marketing/MaskedStats/statsTokens'
import { resolveFeaturesTokens } from '../../templates/masked-marketing/MaskedFeatures/featuresTokens'
import { resolvePricingTokens } from '../../templates/masked-marketing/MaskedPricing/pricingTokens'
import { resolveTestimonialsTokens } from '../../templates/masked-marketing/MaskedTestimonials/testimonialsTokens'
import { resolveFAQTokens } from '../../templates/masked-marketing/MaskedFAQ/faqTokens'
import { resolveLogoCloudTokens } from '../../templates/masked-marketing/MaskedLogoCloud/logoCloudTokens'

const THEMES = [...listColorThemes(), 'baseBlue', 'baseRose', 'baseLilac']
const AA = 4.5
const gradientFrom = (bg: string) =>
  /linear-gradient\(135deg, ((?:hsla?|rgba?)\([^)]*\)|#[0-9a-f]+),/i.exec(bg)?.[1] ?? ''

describe('contraste WCAG AA com colorTheme, em todos os temas', () => {
  for (const colorTheme of THEMES) {
    it(`${colorTheme}: hero gradient, cta (banner/gradient), stats highlight, newsletter band`, () => {
      const hero = resolveHeroTokens({ variant: 'gradient', colorTheme }, maskedTheme)
      expect(
        contrastRatio(hero['--mc-hero-fg'], gradientFrom(hero['--mc-hero-bg']))!
      ).toBeGreaterThanOrEqual(AA)

      const banner = resolveCTATokens({ variant: 'banner', colorTheme }, maskedTheme)
      expect(contrastRatio(banner['--mc-cta-fg'], banner['--mc-cta-bg'])!).toBeGreaterThanOrEqual(
        AA
      )
      const cta = resolveCTATokens({ variant: 'gradient', colorTheme }, maskedTheme)
      expect(
        contrastRatio(cta['--mc-cta-fg'], gradientFrom(cta['--mc-cta-bg']))!
      ).toBeGreaterThanOrEqual(AA)

      const stats = resolveStatsTokens({ variant: 'highlight', colorTheme }, maskedTheme)
      expect(contrastRatio(stats['--mc-stats-fg'], stats['--mc-stats-bg'])!).toBeGreaterThanOrEqual(
        AA
      )

      const band = resolveNewsletterTokens({ variant: 'band', colorTheme }, maskedTheme)
      expect(
        contrastRatio(band['--mc-newsletter-fg'], band['--mc-newsletter-bg'])!
      ).toBeGreaterThanOrEqual(AA)
      /* botão: accent/accentFg também com contraste (na band, é texto da superfície sobre o fundo) */
      expect(
        contrastRatio(band['--mc-newsletter-accent-fg'], band['--mc-newsletter-accent'])!
      ).toBeGreaterThanOrEqual(AA)
    })

    it(`${colorTheme}: pares accent/accentFg dos componentes sobre fundo da página`, () => {
      const features = resolveFeaturesTokens({ colorTheme }, maskedTheme)
      expect(
        contrastRatio(features['--mc-features-accent-fg'], features['--mc-features-accent'])!
      ).toBeGreaterThanOrEqual(AA)
      const pricing = resolvePricingTokens({ colorTheme }, maskedTheme)
      expect(
        contrastRatio(pricing['--mc-pricing-accent-fg'], pricing['--mc-pricing-accent'])!
      ).toBeGreaterThanOrEqual(AA)
      const nl = resolveNewsletterTokens({ variant: 'card', colorTheme }, maskedTheme)
      expect(
        contrastRatio(nl['--mc-newsletter-accent-fg'], nl['--mc-newsletter-accent'])!
      ).toBeGreaterThanOrEqual(AA)
    })
  }
})

describe('variantes e precedência', () => {
  it('hero: só o gradient pinta o fundo; os demais emitem só destaque', () => {
    expect(
      resolveHeroTokens({ variant: 'centered', colorTheme: 'baseBlue' }, maskedTheme)[
        '--mc-hero-bg'
      ]
    ).toBeUndefined()
    expect(resolveHeroTokens({ variant: 'gradient' }, maskedTheme)['--mc-hero-bg']).toContain(
      'linear-gradient'
    )
    expect(
      resolveHeroTokens({ variant: 'split', colorTheme: 'baseBlue' }, maskedTheme)[
        '--mc-hero-accent'
      ]
    ).toBeDefined()
  })

  it('cta: split usa fundo suave', () => {
    expect(
      resolveCTATokens({ variant: 'split', colorTheme: 'baseBlue' }, maskedTheme)['--mc-cta-bg']
    ).toContain('color-mix')
  })

  it('newsletter: card e inline não pintam fundo', () => {
    expect(
      resolveNewsletterTokens({ variant: 'card' }, maskedTheme)['--mc-newsletter-bg']
    ).toBeUndefined()
    expect(
      resolveNewsletterTokens({ variant: 'inline' }, maskedTheme)['--mc-newsletter-bg']
    ).toBeUndefined()
  })

  it('stats: row/grid não pintam fundo; highlight usa a superfície do tema sem colorTheme', () => {
    expect(resolveStatsTokens({ variant: 'row' }, maskedTheme)['--mc-stats-bg']).toBeUndefined()
    expect(resolveStatsTokens({ variant: 'highlight' }, maskedTheme)['--mc-stats-bg']).toBe(
      maskedTheme.colors.surfaceColor
    )
  })

  it('tokens do usuário vencem (e bg simples re-deriva o texto)', () => {
    expect(
      resolveCTATokens({ variant: 'banner', tokens: { bg: '#000000' } }, maskedTheme)['--mc-cta-bg']
    ).toBe('#000000')
    const s = resolveCTATokens({ variant: 'banner', tokens: { bg: '#000000' } }, maskedTheme)
    expect(contrastRatio(s['--mc-cta-fg'], '#000000')!).toBeGreaterThanOrEqual(AA)
    expect(resolveFAQTokens({ tokens: { accent: '#f00' } }, maskedTheme)['--mc-faq-accent']).toBe(
      '#f00'
    )
    expect(
      resolveTestimonialsTokens(
        { colorTheme: 'baseBlue', tokens: { border: '#0f0' } },
        maskedTheme
      )['--mc-testimonials-border']
    ).toBe('#0f0')
  })

  it('logo cloud: neutra; duração do marquee vem da prop e tokens vencem', () => {
    expect(resolveLogoCloudTokens({})).toEqual({})
    expect(resolveLogoCloudTokens({ speed: 45 })['--mc-logo-cloud-duration']).toBe('45s')
    expect(
      resolveLogoCloudTokens({ speed: 45, tokens: { opacity: '0.5', logoHeight: '32px' } })
    ).toMatchObject({ '--mc-logo-cloud-opacity': '0.5', '--mc-logo-cloud-logo-height': '32px' })
  })
})
