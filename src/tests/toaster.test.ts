import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from '../../templates/masked-toaster/MaskedToaster/toast'
import {
  clearToasts,
  dismissToast,
  getSnapshot
} from '../../templates/masked-toaster/MaskedToaster/toastStore'

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('window', {}) // o store é no-op no servidor
  clearToasts()
})
afterEach(() => {
  clearToasts()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('toast store', () => {
  it('cria com duração padrão por tipo', () => {
    toast.success('ok')
    toast.loading('...')
    const [a, b] = getSnapshot()
    expect(a).toMatchObject({ type: 'success', duration: 4000, visible: true })
    expect(b.duration).toBe(Infinity)
  })

  it('mesmo id atualiza no lugar e preserva createdAt', () => {
    toast.loading('enviando', { id: 'x' })
    const created = getSnapshot()[0].createdAt
    vi.advanceTimersByTime(50)
    toast.success('pronto', { id: 'x' })
    expect(getSnapshot()).toHaveLength(1)
    expect(getSnapshot()[0]).toMatchObject({
      type: 'success',
      message: 'pronto',
      createdAt: created
    })
  })

  it('dismiss esconde, chama onDismiss e remove após a animação', () => {
    const onDismiss = vi.fn()
    const id = toast('a', { onDismiss })
    dismissToast(id)
    expect(getSnapshot()[0].visible).toBe(false)
    expect(onDismiss).toHaveBeenCalledWith(id)
    vi.advanceTimersByTime(300)
    expect(getSnapshot()).toHaveLength(0)
  })

  it('dismiss() sem id dispensa todos os visíveis', () => {
    toast('a')
    toast('b')
    toast.dismiss()
    expect(getSnapshot().every((t) => !t.visible)).toBe(true)
  })

  it('promise: loading -> success, com função de mensagem', async () => {
    const p = toast.promise(Promise.resolve(42), {
      loading: 'carregando',
      success: (n) => `got ${n}`,
      error: 'falhou'
    })
    expect(getSnapshot()[0].type).toBe('loading')
    await p
    expect(getSnapshot()[0]).toMatchObject({ type: 'success', message: 'got 42' })
  })

  it('promise: rejeição vira error e a promise continua rejeitando', async () => {
    const p = toast.promise(Promise.reject(new Error('boom')), {
      loading: '...',
      success: 'ok',
      error: (e) => (e as Error).message
    })
    await expect(p).rejects.toThrow('boom')
    expect(getSnapshot()[0]).toMatchObject({ type: 'error', message: 'boom' })
  })

  it('no servidor é no-op', () => {
    vi.unstubAllGlobals()
    toast('x')
    expect(getSnapshot()).toHaveLength(0)
  })
})
