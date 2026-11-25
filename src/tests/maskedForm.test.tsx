// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  MaskedForm,
  MaskedField,
  formDataToValues
} from '../../templates/masked-forms/MaskedForm/MaskedForm'
import { MaskedInput } from '../../templates/masked-input/MaskedInput/MaskedInput'

afterEach(cleanup)

describe('formDataToValues', () => {
  it('names repetidos viram array', () => {
    const fd = new FormData()
    fd.append('tag', 'a')
    fd.append('tag', 'b')
    fd.append('nome', 'x')
    expect(formDataToValues(fd)).toEqual({ tag: ['a', 'b'], nome: 'x' })
  })
})

describe('MaskedForm', () => {
  it('chama onSubmit com os valores do FormData', async () => {
    const onSubmit = vi.fn()
    render(
      <MaskedForm onSubmit={onSubmit}>
        <MaskedField name="nome">
          <MaskedInput variant="default" label="Nome" />
        </MaskedField>
        <button type="submit">Enviar</button>
      </MaskedForm>
    )
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana' } })
    fireEvent.click(screen.getByText('Enviar'))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ nome: 'Ana' })
  })

  it('validators bloqueiam submit e injetam erro no campo', async () => {
    const onSubmit = vi.fn()
    render(
      <MaskedForm onSubmit={onSubmit} validators={{ nome: (v) => (!v ? 'obrigatório' : null) }}>
        <MaskedField name="nome">
          <MaskedInput variant="default" label="Nome" />
        </MaskedField>
        <button type="submit">Enviar</button>
      </MaskedForm>
    )
    fireEvent.click(screen.getByText('Enviar'))
    await waitFor(() => expect(screen.getByText('obrigatório')).toBeTruthy())
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('erros externos têm precedência e aparecem no campo', () => {
    render(
      <MaskedForm onSubmit={vi.fn()} errors={{ nome: 'já existe' }}>
        <MaskedField name="nome">
          <MaskedInput variant="default" label="Nome" />
        </MaskedField>
      </MaskedForm>
    )
    expect(screen.getByText('já existe')).toBeTruthy()
  })

  it('revalida onChange após submit falho', async () => {
    render(
      <MaskedForm onSubmit={vi.fn()} validators={{ nome: (v) => (!v ? 'obrigatório' : null) }}>
        <MaskedField name="nome">
          <MaskedInput variant="default" label="Nome" />
        </MaskedField>
        <button type="submit">Enviar</button>
      </MaskedForm>
    )
    fireEvent.click(screen.getByText('Enviar'))
    await waitFor(() => expect(screen.getByText('obrigatório')).toBeTruthy())
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana' } })
    await waitFor(() => expect(screen.queryByText('obrigatório')).toBeNull())
  })
})
