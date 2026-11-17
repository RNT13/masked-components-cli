'use client'

import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { CardVariantMap } from '../../MaskedCards.types'
import { BaseCard } from '../../Base/BaseCard'
import {
  ArticleActions,
  ArticleAuthorAvatar,
  ArticleCategory,
  ArticleExcerpt,
  ArticleFooter,
  ArticleMedia,
  ArticleMeta,
  ArticleTitle
} from './ArticleCard.styles'

type ArticleCardProps = CardVariantMap['article']

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function ArticleCard({
  image,
  imageAlt,
  category,
  title,
  excerpt,
  author,
  authorAvatar,
  date,
  readTime,
  actions,
  ...props
}: ArticleCardProps) {
  const { imageComponent } = useMaskedConfig()
  const ImgTag = (imageComponent ?? 'img') as 'img'

  const meta = [author, date, readTime].filter(Boolean).join(' · ')

  return (
    <BaseCard {...props} hrefLabel={props.hrefLabel ?? title} hasActions={!!actions}>
      {image ? (
        <ArticleMedia $ratio={props.mediaRatio}>
          <ImgTag src={image} alt={imageAlt ?? title} />
        </ArticleMedia>
      ) : null}

      {category ? <ArticleCategory>{category}</ArticleCategory> : null}
      <ArticleTitle>{title}</ArticleTitle>
      {excerpt ? <ArticleExcerpt>{excerpt}</ArticleExcerpt> : null}

      {meta || actions ? (
        <ArticleFooter>
          {authorAvatar || author ? (
            <ArticleAuthorAvatar aria-hidden={authorAvatar ? undefined : true}>
              {authorAvatar ? <ImgTag src={authorAvatar} alt="" /> : initialsOf(author ?? '')}
            </ArticleAuthorAvatar>
          ) : null}
          {meta ? <ArticleMeta>{meta}</ArticleMeta> : null}
          {actions ? <ArticleActions>{actions}</ArticleActions> : null}
        </ArticleFooter>
      ) : null}
    </BaseCard>
  )
}
