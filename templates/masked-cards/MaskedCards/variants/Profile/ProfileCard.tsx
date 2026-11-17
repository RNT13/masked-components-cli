'use client'

import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { CardVariantMap } from '../../MaskedCards.types'
import { BaseCard } from '../../Base/BaseCard'
import {
  ProfileActions,
  ProfileAvatar,
  ProfileBio,
  ProfileHeader,
  ProfileIdentity,
  ProfileMeta,
  ProfileName,
  ProfileRole,
  ProfileStat,
  ProfileStatLabel,
  ProfileStats,
  ProfileStatValue
} from './ProfileCard.styles'

type ProfileCardProps = CardVariantMap['profile']

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function ProfileCard({
  avatar,
  avatarAlt,
  avatarFallback,
  name,
  role,
  company,
  bio,
  location,
  stats,
  actions,
  ...props
}: ProfileCardProps) {
  const { imageComponent } = useMaskedConfig()
  const ImgTag = (imageComponent ?? 'img') as 'img'

  const meta = [company, location].filter(Boolean).join(' · ')

  return (
    <BaseCard {...props} hrefLabel={props.hrefLabel ?? name} hasActions={!!actions}>
      <ProfileHeader>
        <ProfileAvatar aria-hidden={avatar ? undefined : true}>
          {avatar ? (
            <ImgTag src={avatar} alt={avatarAlt ?? name} />
          ) : (
            (avatarFallback ?? initialsOf(name))
          )}
        </ProfileAvatar>
        <ProfileIdentity>
          <ProfileName>{name}</ProfileName>
          {role ? <ProfileRole>{role}</ProfileRole> : null}
          {meta ? <ProfileMeta>{meta}</ProfileMeta> : null}
        </ProfileIdentity>
      </ProfileHeader>

      {bio ? <ProfileBio>{bio}</ProfileBio> : null}

      {stats && stats.length > 0 ? (
        <ProfileStats>
          {stats.map((stat, index) => (
            <ProfileStat key={index}>
              <ProfileStatValue>{stat.value}</ProfileStatValue>
              <ProfileStatLabel>{stat.label}</ProfileStatLabel>
            </ProfileStat>
          ))}
        </ProfileStats>
      ) : null}

      {actions ? <ProfileActions>{actions}</ProfileActions> : null}
    </BaseCard>
  )
}
