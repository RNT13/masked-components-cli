// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { useControllable } from '../../templates/masked-hooks/useControllable'

afterEach(cleanup)

function Uncontrolled({ onChange }: { onChange?: (v: string) => void }) {
  const [value, setValue] = useControllable({ defaultValue: 'a', onChange })
  return <input aria-label="campo" value={value} onChange={(e) => setValue(e.target.value)} />
}

function Controlled({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [current, setCurrent] = useControllable({ value, onChange })
  return <input aria-label="campo" value={current} onChange={(e) => setCurrent(e.target.value)} />
}

const inputValue = () => (screen.getByLabelText('campo') as HTMLInputElement).value

describe('useControllable', () => {
  it('não-controlado: atualiza estado interno e dispara onChange', () => {
    const onChange = vi.fn()
    render(<Uncontrolled onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('campo'), { target: { value: 'ab' } })
    expect(onChange).toHaveBeenCalledWith('ab')
    expect(inputValue()).toBe('ab')
  })

  it('controlado: dispara onChange mas não muda valor sem o pai atualizar', () => {
    const onChange = vi.fn()
    render(<Controlled value="fixo" onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('campo'), { target: { value: 'novo' } })
    expect(onChange).toHaveBeenCalledWith('novo')
    expect(inputValue()).toBe('fixo')
  })

  it('controlado: reflete mudança de value vinda do pai', () => {
    function Wrapper() {
      const [v, setV] = useState('x')
      return (
        <>
          <Controlled value={v} onChange={() => {}} />
          <button onClick={() => setV('y')}>trocar</button>
        </>
      )
    }
    render(<Wrapper />)
    expect(inputValue()).toBe('x')
    fireEvent.click(screen.getByText('trocar'))
    expect(inputValue()).toBe('y')
  })
})
