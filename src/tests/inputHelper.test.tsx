// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MaskedInput } from '../../templates/masked-input/MaskedInput/MaskedInput'

afterEach(cleanup)

describe('MaskedInput — helperText', () => {
  it('renderiza helper e referencia no describedby', () => {
    render(<MaskedInput variant="default" label="Nome" helperText="dica" />)
    const input = screen.getByLabelText('Nome')
    expect(screen.getByText('dica')).toBeTruthy()
    expect(input.getAttribute('aria-describedby')).toContain('-helper')
  })

  it('erro e helper coexistem no describedby', () => {
    render(
      <MaskedInput variant="default" label="Nome" helperText="dica" error="obrigatório" touched />
    )
    const input = screen.getByLabelText('Nome')
    const describedby = input.getAttribute('aria-describedby') ?? ''
    expect(describedby).toContain('-error')
    expect(describedby).toContain('-helper')
    expect(screen.getByText('dica')).toBeTruthy()
    expect(screen.getByText('obrigatório')).toBeTruthy()
  })
})
