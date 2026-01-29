'use client'

import { forwardRef } from 'react'
import { VscLoading } from 'react-icons/vsc'
import { BaseButtonProps } from '../MaskedButton.types'
import { BaseButtonContainer, ButtonContent, IconWrapper, LabelDiv } from './BaseButton.styles'

type BaseButtonInternalProps = BaseButtonProps & {
  href?: string
  target?: string
  rel?: string
}


export const BaseButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, BaseButtonInternalProps>(
  function BaseButton(
    {
      size = 'md',
      state = 'default',
      label,
      children,
      leftIcon,
      rightIcon,
      fullWidth,
      href,
      target,
      rel,
      type = 'button',
      shapes = 'rounded',
      ...props
    },
    ref
  ) {
    const isDisabled = state === 'disabled' || state === 'loading'

    const Component = href ? 'a' : 'button'

    const content = (
      <ButtonContent $state={state}>
        {state === 'loading' ? (
          <>
            {<IconWrapper>{<VscLoading />}</IconWrapper>}
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
            {<span>{children}</span>}
            {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
          </>
        )}
        {label && <LabelDiv>{label}</LabelDiv>}
      </ButtonContent>
    )

    return (
      <BaseButtonContainer
        as={Component}
        href={href}
        target={target}
        rel={rel}
        ref={ref as unknown as React.Ref<HTMLButtonElement>}
        disabled={!href && isDisabled}
        aria-disabled={href ? isDisabled : undefined}
        type={!href ? type : undefined}
        $size={size}
        $state={state}
        $fullWidth={fullWidth}
        $shape={shapes}
        {...props}
      >
        {content}
      </BaseButtonContainer>
    )
  })
