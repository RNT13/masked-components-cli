/**
 * FileInput  
 *
 * Upload com preview, drag-and-drop e dois modos:  
 * - fileMode="local": o arquivo vai no submit do formulário  
 * - fileMode="cloudinary": sobe direto e devolve a URL  
 *
 * Imagem de preview e notificações são injetáveis:  
 * - props.imageComponent ou <MaskedConfigProvider config={{ imageComponent }}>, fallback <img>  
 * - props.onError/onSuccess ou callbacks do provider, fallback silencioso  
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import type { ComponentType, CSSProperties, DragEvent } from 'react'

import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'

import { ImageIcon } from '../../icons'
import { ErrorDiv, InputLabel, MaskedInputContainer } from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'
import type { ImageComponentProps } from '../../MaskedInput.types'
import { resolveInputTokens } from '../../inputTokens'
import {
  FileCard,
  FileCardFileName,
  FileCardFooter,
  FileCardPreviewBox,
  FileDropHint,
  FileRemoveButton,
  FileTrigger,
  PreviewImageDiv
} from './FileInput.styles'

type Props = { variant: 'file' } & InputVariantMap['file']

const DEFAULT_MAX_SIZE_MB = 5

function filenameFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname
    return decodeURIComponent(path.split('/').pop() ?? url)
  } catch {
    return url
  }
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept || !accept.trim()) return true

  const patterns = accept
    .split(',')
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean)

  const mime = file.type.toLowerCase()
  const name = file.name.toLowerCase()

  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) return name.endsWith(pattern)
    if (pattern.endsWith('/*')) {
      const family = pattern.slice(0, pattern.indexOf('/'))
      return mime.startsWith(`${family}/`)
    }
    return mime === pattern
  })
}

export function FileInput(props: Props) {
  const config = useMaskedConfig()

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [fileNames, setFileNames] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const prev = useRef<string[]>([])

  const hasError = props.touched && props.error
  const multiple = Boolean(props.multiple)
  const isSingleCard = !multiple

  const existingValue = Array.isArray(props.value) ? props.value[0] : props.value
  const hasNewSelection = previews.length > 0
  const displayPreview = hasNewSelection ? previews[0] : existingValue || null
  const displayFileName = hasNewSelection
    ? fileNames[0]
    : existingValue
      ? filenameFromUrl(existingValue)
      : (props.filenameLabel ?? 'Nenhum arquivo escolhido')

  const notifyError = (message: string) => props.onError?.(message) ?? config.onError?.(message)
  const notifySuccess = (message: string) =>
    props.onSuccess?.(message) ?? config.onSuccess?.(message)

  // Renderizador de imagem: prop > provider > <img> nativo
  const ImageComponent: ComponentType<ImageComponentProps> | undefined =
    props.imageComponent ?? config.imageComponent
  const renderImage = (src: string, alt: string, style?: CSSProperties) =>
    ImageComponent ? (
      <ImageComponent src={src} alt={alt} fill style={style} />
    ) : (
      // Fallback agnóstico de framework; em Next, injete next/image via imageComponent.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }}
      />
    )

  function validateFiles(files: File[]): File[] {
    const maxSizeMB = props.maxSizeMB ?? DEFAULT_MAX_SIZE_MB
    const valid: File[] = []

    for (const file of files) {
      if (!matchesAccept(file, props.accept)) {
        notifyError(
          props.invalidTypeMessage
            ? props.invalidTypeMessage(file.name)
            : `"${file.name}" tem um tipo não permitido e foi ignorado`
        )
        continue
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        notifyError(
          props.maxSizeMessage
            ? props.maxSizeMessage(file.name, maxSizeMB)
            : `"${file.name}" excede ${maxSizeMB}MB e foi ignorado`
        )
        continue
      }
      valid.push(file)
    }

    return valid
  }

  function handleFiles(filesList: FileList | null) {
    if (!filesList || filesList.length === 0) return

    const files = validateFiles(Array.from(filesList))
    if (files.length === 0) return

    const urls = files.map((f) => URL.createObjectURL(f))

    prev.current.forEach(URL.revokeObjectURL)
    prev.current = urls

    setPreviews(urls)
    setFileNames(files.map((f) => f.name))

    props.onFileChange?.({ files, previews: urls })

    if (props.fileMode === 'local') {
      props.onChange?.(multiple ? files : files[0])
      return
    }

    uploadToCloudinary(files)
  }

  async function uploadToCloudinary(files: File[]) {
    if (!props.uploadPreset || !props.cloudName) {
      notifyError(
        props.uploadConfigMessage ?? 'Configuração de upload ausente (cloudName/uploadPreset)'
      )
      return
    }

    setIsUploading(true)
    props.onUploadingChange?.(true)

    try {
      const results = await Promise.allSettled(
        files.map(async (file) => {
          const fd = new FormData()
          fd.append('file', file)
          fd.append('upload_preset', props.uploadPreset as string)

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${props.cloudName}/image/upload`,
            { method: 'POST', body: fd }
          )

          if (!res.ok) {
            throw new Error(`Falha no upload de "${file.name}"`)
          }

          const data = await res.json()
          if (!data.secure_url) {
            throw new Error(`Resposta inválida do Cloudinary para "${file.name}"`)
          }

          return data.secure_url as string
        })
      )

      const uploaded = results
        .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
        .map((r) => r.value)

      const failedCount = results.length - uploaded.length
      if (failedCount > 0) {
        notifyError(
          props.uploadFailedMessage
            ? props.uploadFailedMessage(failedCount, files.length)
            : failedCount === files.length
              ? 'Falha ao enviar o(s) arquivo(s).'
              : `${failedCount} arquivo(s) falharam no envio.`
        )
      }

      if (uploaded.length > 0) {
        props.onChange?.(multiple ? uploaded : uploaded[0])
        notifySuccess(props.uploadSuccessMessage ?? 'Upload concluído!')
      }
    } finally {
      setIsUploading(false)
      props.onUploadingChange?.(false)
    }
  }

  function handleRemove() {
    prev.current.forEach(URL.revokeObjectURL)
    prev.current = []
    setPreviews([])
    setFileNames([])
    if (inputRef.current) inputRef.current.value = ''
    props.onRemove?.()
    props.onChange?.(multiple ? [] : null)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    if (props.disabled || isUploading) return
    handleFiles(e.dataTransfer.files)
  }

  useEffect(() => {
    return () => prev.current.forEach(URL.revokeObjectURL)
  }, [])

  const busy = isUploading || props.disabled

  return (
    <MaskedInputContainer
      $variant="file"
      $radius={props.radius}
      style={{
        ...resolveInputTokens({ colorTheme: props.colorTheme, tokens: props.tokens }),
        ...props.containerStyle
      }}
    >
      <input
        ref={inputRef}
        id={props.id}
        type="file"
        hidden
        accept={props.accept}
        multiple={multiple}
        disabled={props.disabled}
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {props.label && (
        <InputLabel htmlFor={props.id} $required={props.required}>
          {props.icon}
          <span>{props.label}</span>
        </InputLabel>
      )}

      {isSingleCard ? (
        <FileCard
          $dragOver={dragOver}
          onDragOver={(e) => {
            e.preventDefault()
            if (!busy) setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <FileCardPreviewBox $aspect={props.aspect}>
            {displayPreview
              ? renderImage(displayPreview, props.label ?? 'Preview')
              : (props.imageIcon ?? <ImageIcon />)}
          </FileCardPreviewBox>

          <FileCardFooter>
            <FileTrigger type="button" onClick={() => inputRef.current?.click()} disabled={busy}>
              {isUploading
                ? (props.uploadingLabel ?? 'Enviando...')
                : (props.chooseFileLabel ?? 'Escolher arquivo')}
            </FileTrigger>
            <FileCardFileName title={displayFileName}>{displayFileName}</FileCardFileName>
          </FileCardFooter>

          <FileDropHint>{props.dropHintLabel ?? 'ou arraste uma imagem aqui'}</FileDropHint>

          {displayPreview && (
            <FileRemoveButton type="button" onClick={handleRemove} disabled={busy}>
              {props.removeLabel ?? 'Remover arquivo'}
            </FileRemoveButton>
          )}
        </FileCard>
      ) : (
        <>
          <FileTrigger type="button" onClick={() => inputRef.current?.click()} disabled={busy}>
            {isUploading
              ? (props.uploadingLabel ?? 'Enviando...')
              : (props.selectFilesLabel ?? 'Selecionar arquivos')}
          </FileTrigger>

          {previews.length > 0 && (
            <PreviewImageDiv>
              {previews.map((src, i) => (
                <span key={src} style={{ position: 'relative', display: 'block' }}>
                  {renderImage(src, fileNames[i] ?? 'Preview')}
                </span>
              ))}
            </PreviewImageDiv>
          )}
        </>
      )}

      {hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
