// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MaskedButtonGroup } from '../../templates/masked-buttons/MaskedButton/MaskedButtonGroup'
import { MaskedRadioGroup } from '../../templates/masked-buttons/MaskedButton/MaskedRadioGroup'

afterEach(cleanup)

const opts = [
  { value: 'a', label: 'Opção A' },
  { value: 'b', label: 'Opção B' }
]

describe('MaskedButtonGroup — radio', () => {
  it('radios compartilham o name do grupo', () => {
    render(<MaskedButtonGroup variant="radio" name="plano" options={opts} />)
    const radios = screen.getAllByRole('radio')
    expect(radios.every((r) => r.getAttribute('name') === 'plano')).toBe(true)
  })

  it('seleciona e dispara onChange', () => {
    const onChange = vi.fn()
    render(<MaskedButtonGroup variant="radio" name="plano" options={opts} onChange={onChange} />)
    fireEvent.click(screen.getByLabelText('Opção B'))
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('renderiza legend, erro e helper com describedby', () => {
    render(
      <MaskedButtonGroup
        variant="radio"
        name="plano"
        label="Plano"
        options={opts}
        error="escolha um"
        helperText="dica"
      />
    )
    expect(screen.getByText('Plano')).toBeTruthy()
    expect(screen.getByText('escolha um')).toBeTruthy()
    expect(screen.getByText('dica')).toBeTruthy()
  })
})

describe('MaskedRadioGroup', () => {
  it('required propaga para os inputs', () => {
    render(<MaskedRadioGroup name="plano" required options={opts} />)
    const radios = screen.getAllByRole('radio')
    expect(radios.every((r) => (r as HTMLInputElement).required)).toBe(true)
  })
})
