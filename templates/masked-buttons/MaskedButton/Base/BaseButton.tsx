'use client'

import { forwardRef, MouseEvent } from 'react'
import { resolveButtonTokens } from '../buttonTokens'
import { BaseButtonProps, ButtonClickEvent } from '../MaskedButton.types'
import { BaseButtonContainer, ButtonContent, IconWrapper, LabelDiv } from './BaseButton.styles'
import { SpinnerIcon } from './icons'

export const BaseButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, BaseButtonProps>(
  function BaseButton(
    {
      size = 'md',
      state = 'default',
      label,
      ariaLabel,
      loadingText = 'Loading...',
      children,
      leftIcon,
      rightIcon,
      fullWidth,
      href,
      target,
      rel,
      type = 'button',
      shapes = 'rounded',
      name,
      value,
      onClick,
      colorTheme,
      tokens,
      linkComponent,
      ...props
    },
    ref
  ) {
    const isDisabled = state === 'disabled' || state === 'loading'

    // linkComponent (provider/prop) > <a> nativo; sem href sempre <button>
    const Component = href ? (linkComponent ?? 'a') : 'button'
    const accessibleName = ariaLabel ?? label
    const tokenStyle = resolveButtonTokens({ colorTheme, tokens })

    function handleClick(event: ButtonClickEvent) {
      if (isDisabled) {
        event.preventDefault()
        return
      }
      onClick?.(event)
    }

    const content = (
      <>
        <ButtonContent $state={state}>
          {state === 'loading' ? (
            <>
              <IconWrapper $size={size}>
                <SpinnerIcon />
              </IconWrapper>
              {loadingText && <span>{loadingText}</span>}
            </>
          ) : (
            <>
              {leftIcon && <IconWrapper $size={size}>{leftIcon}</IconWrapper>}
              {children && <span className="btn-text">{children}</span>}
              {rightIcon && <IconWrapper $size={size}>{rightIcon}</IconWrapper>}
            </>
          )}
        </ButtonContent>
        {label && <LabelDiv>{label}</LabelDiv>}
      </>
    )

    return (
      <BaseButtonContainer
        as={Component}
        href={href && !isDisabled ? href : undefined}
        target={href ? target : undefined}
        rel={href ? rel : undefined}
        ref={ref as unknown as React.Ref<HTMLButtonElement>}
        disabled={!href && isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-label={accessibleName}
        role={href && isDisabled ? 'link' : undefined}
        tabIndex={href && isDisabled ? -1 : undefined}
        type={!href ? type : undefined}
        name={!href ? name : undefined}
        value={!href ? value : undefined}
        onClick={handleClick as (event: MouseEvent<HTMLButtonElement>) => void}
        style={tokenStyle}
        $size={size}
        $state={state}
        $fullWidth={fullWidth}
        $shape={shapes}
        {...props}
      >
        {content}
      </BaseButtonContainer>
    )
  }
)
