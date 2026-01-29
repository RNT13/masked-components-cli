'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { ErrorDiv, FileTrigger, InputLabel, MaskedInputContainer, PreviewImageDiv } from '../MaskedInput.styles'
import { InputVariantMap } from '../MaskedInput.types'

type Props = { variant: 'file' } & InputVariantMap['file']

export function FileInput(props: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const prev = useRef<string[]>([])

  const hasError = props.touched && props.error

  function handleFiles(filesList: FileList | null) {
    if (!filesList) return

    const files = Array.from(filesList)
    const urls = files.map(f => URL.createObjectURL(f))

    prev.current.forEach(URL.revokeObjectURL)
    prev.current = urls

    if (props.previewMode !== 'replace') setPreviews(urls)

    props.onFileChange?.({ files, previews: urls })

    if (props.fileMode === 'local') {
      props.onChange?.(props.multiple ? files : files[0])
      return
    }

    uploadToCloudinary(files)
  }

  async function uploadToCloudinary(files: File[]) {
    if (!props.uploadPreset || !props.cloudName) return

    props.onUploadingChange?.(true)
    const uploaded: string[] = []

    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', props.uploadPreset)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${props.cloudName}/image/upload`, {
        method: 'POST',
        body: fd
      })

      const data = await res.json()
      uploaded.push(data.secure_url)
    }

    props.onChange?.(props.multiple ? uploaded : uploaded[0])
    toast.success('Upload concluído!')
    props.onUploadingChange?.(false)
  }

  useEffect(() => {
    return () => prev.current.forEach(URL.revokeObjectURL)
  }, [])

  return (
    <MaskedInputContainer $variant="file">
      <input ref={inputRef} type="file" hidden multiple={props.multiple} onChange={e => handleFiles(e.target.files)} />

      {props.label && (
        <InputLabel>
          {props.icon && props.icon}
          {props.label && <label>{props.label}</label>}
        </InputLabel>
      )}

      <FileTrigger type="button" onClick={() => inputRef.current?.click()}>
        {props.multiple ? 'Selecionar arquivos' : 'Selecionar arquivo'}
      </FileTrigger>

      {props.previewMode !== 'replace' && previews.length > 0 && (
        <PreviewImageDiv>
          {previews.map((src, i) => (
            <Image key={i} src={src} alt="Preview" width={88} height={88} />
          ))}
        </PreviewImageDiv>
      )}

      {props.showError && hasError && <ErrorDiv>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
