'use client'  
  
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'  
import { createPortal } from 'react-dom'  
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'  
import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'  
import { DrawerOverlay, DrawerPanel } from './MaskedDrawer.styles'  
import { MaskedDrawerProps, type DrawerSide } from './MaskedDrawer.types'  
import { readableTextOn } from '@/utils/masked-utils'  
  
const FOCUSABLE =  
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'  
  
export function MaskedDrawer({  
  children,  
  isOpen,  
  onClose,  
  side = 'left',  
  width = '280px',  
  height = '60dvh',  
  overlay = true,  
  overlayBlur = false,  
  transition = 'slide',  
  zIndex = maskedTheme.zIndex.modal,  
  closeOnEscape = true,  
  lockScroll = true,  
  portal = true,  
  colorTheme,  
  tokens,  
  className,  
  style  
}: MaskedDrawerProps) {  
  const panelRef = useRef<HTMLDivElement>(null)  
  
  /* onClose via ref: trocar a callback não re-executa o efeito de foco */  
  const onCloseRef = useRef(onClose)  
  useEffect(() => {  
    onCloseRef.current = onClose  
  }, [onClose])  
  
  const mounted = useSyncExternalStore(  
    () => () => { },  
    () => true, // client  
    () => false // server  
  )  
  
  /*  
   * Lado exibido + abertura interna: quando `side` muda, o painel primeiro  
   * remonta FECHADO no lado novo (sem animar o transform antigo atravessando  
   * a tela) e só então abre — dois rAFs garantem um frame fechado pintado.  
   */  
  const [shownSide, setShownSide] = useState<DrawerSide>(side)  
  const [open, setOpen] = useState(false)  
  
  useEffect(() => {  
    if (!isOpen) {  
      setOpen(false)  
      if (side !== shownSide) setShownSide(side)  
      return  
    }  
    if (side !== shownSide) {  
      setShownSide(side)  
      setOpen(false)  
      const raf = requestAnimationFrame(() =>  
        requestAnimationFrame(() => setOpen(true))  
      )  
      return () => cancelAnimationFrame(raf)  
    }  
    const raf = requestAnimationFrame(() => setOpen(true))  
    return () => cancelAnimationFrame(raf)  
  }, [isOpen, side, shownSide])  
  
  // Escape + focus inicial + focus trap  
  useEffect(() => {  
    if (!open) return  
  
    const panel = panelRef.current  
    const prevActive = document.activeElement as HTMLElement | null  
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus()  
  
    const onKeyDown = (e: KeyboardEvent) => {  
      if (e.key === 'Escape' && closeOnEscape) {  
        onCloseRef.current()  
        return  
      }  
      if (e.key !== 'Tab' || !panel) return  
  
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)]  
      if (items.length === 0) {  
        e.preventDefault()  
        return  
      }  
      const first = items[0]  
      const last = items[items.length - 1]  
      if (e.shiftKey && document.activeElement === first) {  
        e.preventDefault()  
        last.focus()  
      } else if (!e.shiftKey && document.activeElement === last) {  
        e.preventDefault()  
        first.focus()  
      }  
    }  
  
    document.addEventListener('keydown', onKeyDown)  
    return () => {  
      document.removeEventListener('keydown', onKeyDown)  
      prevActive?.focus?.()  
    }  
  }, [open, closeOnEscape])  
  
  // Scroll lock  
  useEffect(() => {  
    if (!open || !lockScroll) return  
    const prev = document.body.style.overflow  
    document.body.style.overflow = 'hidden'  
    return () => {  
      document.body.style.overflow = prev  
    }  
  }, [open, lockScroll])  
  
  const isHorizontal = shownSide === 'left' || shownSide === 'right'  
  const size = isHorizontal ? width : height  
  const fallback = isHorizontal ? '280px' : '60dvh'  
  
  const themeVars = resolveColorTheme(colorTheme, maskedTheme)  
  
  const vars = {  
    ...(themeVars?.base  
      ? {  
        '--mc-drawer-panel-bg': themeVars.base,  
        '--mc-drawer-panel-fg': themeVars.onBase ?? readableTextOn(themeVars.base)  
      }  
      : {}),  
    ...(tokens?.overlayBg ? { '--mc-drawer-overlay-bg': tokens.overlayBg } : {}),  
    ...(tokens?.panelBg ? { '--mc-drawer-panel-bg': tokens.panelBg } : {})  
  } as CSSProperties  
  
  const content = (  
    <>  
      {overlay && (  
        <DrawerOverlay  
          $isOpen={open}  
          $blur={overlayBlur}  
          $zIndex={zIndex}  
          style={vars}  
          aria-hidden="true"  
          onClick={() => onCloseRef.current()}  
        />  
      )}  
      <DrawerPanel  
        ref={panelRef}  
        role="dialog"  
        aria-modal="true"  
        aria-hidden={!open}  
        inert={!open}  
        $side={shownSide}  
        $isOpen={open}  
        $size={size}  
        $fallback={fallback}  
        $transition={transition}  
        $zIndex={zIndex}  
        className={className}  
        style={{ ...vars, ...style }}  
      >  
        {children}  
      </DrawerPanel>  
    </>  
  )  
  
  if (!portal || !mounted) return content  
  return createPortal(content, document.body)  
}  