'use client'

import { MaskedAvatar } from '@/components/ui/MaskedAvatar/MaskedAvatar'
import { MaskedSection } from '@/components/ui/MaskedSection/MaskedSection'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  MemberBio,
  MemberBody,
  MemberItem,
  MemberLink,
  MemberLinks,
  MemberName,
  MemberRole,
  TeamList
} from './MaskedTeam.styles'
import { resolveTeamTokens } from './teamTokens'
import type { MaskedTeamProps } from './MaskedTeam.types'

/**
 * Equipe (fotos, cargos, links) dentro de uma MaskedSection.
 *
 * Semântica: <ul> de pessoas; o nome é um heading um nível abaixo do título
 * da seção. O avatar é decorativo (o nome já está em texto), com iniciais
 * como fallback. Cada link recebe nome acessível "LinkedIn: Ana Souza" e
 * usa o `linkComponent` do MaskedConfigProvider.
 *
 * @example
 * <MaskedTeam title="Quem faz" members={[{ name: 'Ana Souza', role: 'CEO', avatar: '/ana.jpg', links: [{ label: 'LinkedIn', href: '#' }] }]} />
 */
export function MaskedTeam(props: MaskedTeamProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const {
    variant = 'grid',
    members,
    sectionVariant,
    sectionTokens,
    tokens,
    colorTheme,
    ...section
  } = props

  const level = Math.min((section.headingLevel ?? 2) + 1, 6) as 3
  const tokenStyle = resolveTeamTokens({ colorTheme, tokens }, theme)

  return (
    <MaskedSection
      {...section}
      variant={sectionVariant}
      colorTheme={colorTheme}
      tokens={sectionTokens}
    >
      <TeamList $variant={variant} style={tokenStyle}>
        {members.map((member) => (
          <MemberItem key={member.id ?? member.name} $variant={variant}>
            <span aria-hidden="true">
              <MaskedAvatar
                name={member.name}
                src={member.avatar}
                alt=""
                size={variant === 'list' ? 'lg' : 'xl'}
                colorTheme={colorTheme}
              />
            </span>
            <MemberBody>
              <MemberName as={`h${level}` as 'h3'}>{member.name}</MemberName>
              {member.role && <MemberRole>{member.role}</MemberRole>}
              {member.bio && variant !== 'grid' && <MemberBio>{member.bio}</MemberBio>}
              {member.links && member.links.length > 0 && (
                <MemberLinks>
                  {member.links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <MemberLink
                        as={config.linkComponent}
                        href={link.href}
                        aria-label={`${link.label}: ${member.name}`}
                      >
                        {link.label}
                      </MemberLink>
                    </li>
                  ))}
                </MemberLinks>
              )}
            </MemberBody>
          </MemberItem>
        ))}
      </TeamList>
    </MaskedSection>
  )
}
