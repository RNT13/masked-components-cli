// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MaskedInput } from '../../templates/masked-input/MaskedInput/MaskedInput'

afterEach(cleanup)

describe('FileInput — uploadHandler', () => {
  it('usa o handler injetável e devolve a URL', async () => {
    const uploadHandler = vi.fn(async (file: File) => ({ url: `https://cdn.test/${file.name}` }))
    const onChange = vi.fn()

    render(
      <MaskedInput
        variant="file"
        label="Logo"
        fileMode="remote"
        uploadHandler={uploadHandler}
        onChange={onChange}
      />
    )

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'logo.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('https://cdn.test/logo.png'))
    expect(uploadHandler).toHaveBeenCalledWith(file)
  })

  it('sem handler e sem cloudinary → notifica configuração ausente', async () => {
    const onError = vi.fn()
    render(<MaskedInput variant="file" label="Logo" fileMode="remote" onError={onError} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'a.png', { type: 'image/png' })] }
    })
    await waitFor(() => expect(onError).toHaveBeenCalled())
  })
})
