// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createRef } from 'react'
import { useEscapeKey } from '../../templates/masked-primitives/useEscapeKey'
import { useLockBodyScroll } from '../../templates/masked-primitives/useLockBodyScroll'
import { useClickOutside } from '../../templates/masked-primitives/useClickOutside'
import { useFocusTrap, FOCUSABLE_SELECTOR } from '../../templates/masked-primitives/useFocusTrap'
import { composeRefs } from '../../templates/masked-primitives/composeRefs'

const keydown = (key: string, shiftKey = false) =>
  act(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }))
  })

describe('useEscapeKey', () => {
  it('chama o handler em Escape quando ativo', () => {
    const handler = vi.fn()
    renderHook(({ active }) => useEscapeKey(active, handler), { initialProps: { active: true } })
    keydown('Escape')
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('ignora Escape quando inativo e outras teclas', () => {
    const handler = vi.fn()
    renderHook(() => useEscapeKey(false, handler))
    keydown('Escape')
    renderHook(() => useEscapeKey(true, handler))
    keydown('Enter')
    expect(handler).not.toHaveBeenCalled()
  })
})

describe('useLockBodyScroll', () => {
  it('trava e destrava o overflow do body', () => {
    const { unmount } = renderHook(() => useLockBodyScroll(true))
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('mantém a trava enquanto houver consumidores (contador)', () => {
    const a = renderHook(() => useLockBodyScroll(true))
    const b = renderHook(() => useLockBodyScroll(true))
    a.unmount()
    expect(document.body.style.overflow).toBe('hidden')
    b.unmount()
    expect(document.body.style.overflow).toBe('')
  })
})

describe('useClickOutside', () => {
  it('dispara fora e ignora dentro', () => {
    const handler = vi.fn()
    const inside = document.createElement('div')
    const outside = document.createElement('div')
    document.body.append(inside, outside)

    const ref = createRef<HTMLElement>() as React.RefObject<HTMLElement>
    ;(ref as { current: HTMLElement | null }).current = inside

    renderHook(() => useClickOutside(ref, true, handler))

    act(() => {
      inside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    })
    expect(handler).not.toHaveBeenCalled()

    act(() => {
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    })
    expect(handler).toHaveBeenCalledTimes(1)
  })
})

describe('useFocusTrap', () => {
  it('cicla Tab do último para o primeiro focável', () => {
    const container = document.createElement('div')
    container.innerHTML = '<button id="a">a</button><button id="b">b</button>'
    document.body.appendChild(container)

    const ref = createRef<HTMLElement>() as React.RefObject<HTMLElement>
    ;(ref as { current: HTMLElement | null }).current = container

    renderHook(() => useFocusTrap(ref, true))

    const last = container.querySelector<HTMLElement>('#b')!
    last.focus()
    keydown('Tab')
    expect(document.activeElement?.id).toBe('a')
  })

  it('exporta o seletor de focáveis', () => {
    expect(FOCUSABLE_SELECTOR).toContain('button:not([disabled])')
  })
})

describe('composeRefs', () => {
  it('alimenta callback refs e object refs', () => {
    const node = document.createElement('div')
    const obj = createRef<HTMLDivElement>()
    const fn = vi.fn()
    composeRefs<HTMLDivElement>(obj, fn)(node)
    expect(obj.current).toBe(node)
    expect(fn).toHaveBeenCalledWith(node)
  })
})
