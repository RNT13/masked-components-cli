'use client'  
  
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'  
import { createPortal } from 'react-dom'  
import { resolveButtonTokens } from '../../buttonTokens'  
import { ButtonVariantMap } from '../../MaskedButton.types'  
import {  
  ChevronIcon,  
  SplitButtonWrapper,  
  SplitGroup,  
  SplitMainButton,  
  SplitMenu,  
  SplitMenuButton,  
  SplitMenuCheck,  
  SplitMenuItem,  
  SplitMenuItemDescription,  
  SplitMenuItemLabel,  
  SplitMenuText  
} from './SplitButton.styles'  
  
type Props = { $variant: 'split' } & ButtonVariantMap['split']  
  
const ITEM_SELECTOR = '[role="menuitem"], [role="menuitemradio"]'  
const VIEWPORT_MARGIN = 8  
  
function CheckGlyph() {  
  return (  
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">  
      <path  
        d="M3 8.5l3.2 3L13 4.5"  
        stroke="currentColor"  
        strokeWidth="2"  
        strokeLinecap="round"  
        strokeLinejoin="round"  
      />  
    </svg>  
  )  
}  
  
export default function SplitButton(props: Props) {  
  const {  
    options,  
    onOptionSelect,  
    selectedValue,  
    menuLabel = 'More options',  
    onClick,  
    children,  
    state = 'default',  
    $position,  
    $variant: _variant,  
    colorTheme,  
    tokens,  
    size,  
    ...buttonProps  
  } = props  
  void _variant  
  
  const [open, setOpen] = useState(false)  
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})  
  const rootRef = useRef<HTMLDivElement>(null)  
  const menuRef = useRef<HTMLDivElement>(null)  
  const triggerRef = useRef<HTMLButtonElement>(null)  
  
  const isDisabled = state === 'disabled' || state === 'loading'  
  const hasSelection = selectedValue !== undefined  
  const itemRole = hasSelection ? 'menuitemradio' : 'menuitem'  
  
  /* posição do menu: ancorado na seta, via portal (escapa de stacking  
     contexts criados por transform/animation nos ancestrais) */  
  useEffect(() => {  
    if (!open) return  
  
    const update = () => {  
      const trigger = triggerRef.current  
      const menu = menuRef.current  
      if (!trigger) return  
      const rect = trigger.getBoundingClientRect()  
      const menuWidth = menu?.offsetWidth ?? 260  
      const menuHeight = menu?.offsetHeight ?? 0  
  
      let left = rect.right - menuWidth  
      left = Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - menuWidth - VIEWPORT_MARGIN))  
  
      let top = rect.bottom + 6  
      if (menuHeight > 0 && top + menuHeight > window.innerHeight - VIEWPORT_MARGIN) {  
        top = Math.max(VIEWPORT_MARGIN, rect.top - menuHeight - 6)  
      }  
  
      setMenuStyle({ top, left })  
    }  
  
    update()  
    window.addEventListener('resize', update)  
    window.addEventListener('scroll', update, true)  
    return () => {  
      window.removeEventListener('resize', update)  
      window.removeEventListener('scroll', update, true)  
    }  
  }, [open])  
  
  /* fecha ao clicar fora / Escape (e devolve o foco ao botão da seta) */  
  useEffect(() => {  
    if (!open) return  
  
    const onPointerDown = (e: PointerEvent) => {  
      const target = e.target as Node  
      const insideRoot = rootRef.current?.contains(target)  
      const insideMenu = menuRef.current?.contains(target)  
      if (!insideRoot && !insideMenu) setOpen(false)  
    }  
    const onKeyDown = (e: globalThis.KeyboardEvent) => {  
      if (e.key === 'Escape') {  
        setOpen(false)  
        triggerRef.current?.focus()  
      }  
    }  
  
    document.addEventListener('pointerdown', onPointerDown)  
    document.addEventListener('keydown', onKeyDown)  
    return () => {  
      document.removeEventListener('pointerdown', onPointerDown)  
      document.removeEventListener('keydown', onKeyDown)  
    }  
  }, [open])  
  
  /* ao abrir, foca o item marcado (ou o primeiro) */  
  useEffect(() => {  
    if (!open) return  
    const items = [...(menuRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? [])]  
    const target = items.find((el) => el.getAttribute('aria-checked') === 'true') ?? items[0]  
    target?.focus()  
  }, [open])  
  
  function onMenuKeyDown(e: KeyboardEvent<HTMLDivElement>) {  
    const items = [...(menuRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? [])]  
    if (items.length === 0) return  
    const current = items.indexOf(document.activeElement as HTMLElement)  
  
    let next: number | null = null  
    if (e.key === 'ArrowDown') next = (current + 1) % items.length  
    else if (e.key === 'ArrowUp') next = (current - 1 + items.length) % items.length  
    else if (e.key === 'Home') next = 0  
    else if (e.key === 'End') next = items.length - 1  
    else if (e.key === 'Tab') setOpen(false)  
  
    if (next !== null) {  
      e.preventDefault()  
      items[next]?.focus()  
    }  
  }  
  
  const select = (value: string) => {  
    setOpen(false)  
    onOptionSelect?.(value)  
    triggerRef.current?.focus()  
  }  
  
  const menu = open ? (  
    <SplitMenu  
      ref={menuRef}  
      role="menu"  
      aria-label={menuLabel}  
      onKeyDown={onMenuKeyDown}  
      style={menuStyle}  
    >  
      {options.map((opt) => {  
        const selected = hasSelection && opt.value === selectedValue  
        return (  
          <SplitMenuItem  
            key={opt.value}  
            type="button"  
            role={itemRole}  
            aria-checked={hasSelection ? selected : undefined}  
            $selected={selected}  
            onClick={() => select(opt.value)}  
          >  
            <SplitMenuCheck aria-hidden>{selected ? <CheckGlyph /> : null}</SplitMenuCheck>  
            <SplitMenuText>  
              <SplitMenuItemLabel>{opt.label}</SplitMenuItemLabel>  
              {opt.description && (  
                <SplitMenuItemDescription>{opt.description}</SplitMenuItemDescription>  
              )}  
            </SplitMenuText>  
          </SplitMenuItem>  
        )  
      })}  
    </SplitMenu>  
  ) : null  
  
  return (  
    <SplitButtonWrapper  
      $position={$position}  
      ref={rootRef}  
      style={resolveButtonTokens({ colorTheme, tokens })}  
    >  
      <SplitGroup>  
        <SplitMainButton  
          {...buttonProps}  
          colorTheme={colorTheme}  
          tokens={tokens}  
          size={size}  
          state={state}  
          data-testid="split-button-main"  
          onClick={onClick}  
          $isError={state === 'error'}  
          $isDisabled={state === 'disabled'}  
        >  
          {children}  
        </SplitMainButton>  
  
        <SplitMenuButton  
          ref={triggerRef}  
          type="button"  
          data-testid="split-button-menu"  
          aria-label={menuLabel}  
          aria-haspopup="menu"  
          aria-expanded={open}  
          disabled={isDisabled}  
          onClick={() => setOpen((v) => !v)}  
          $isError={state === 'error'}  
          $isDisabled={state === 'disabled'}  
        >  
          <ChevronIcon $open={open} aria-hidden />  
        </SplitMenuButton>  
      </SplitGroup>  
  
      {menu && typeof document !== 'undefined' ? createPortal(menu, document.body) : menu}  
    </SplitButtonWrapper>  
  )  
}  