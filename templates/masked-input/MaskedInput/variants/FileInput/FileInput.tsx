/**
 * FileInput
 *
 * Campo de upload de arquivo com preview, drag-and-drop e suporte a:
 * - arquivo único ou múltiplo
 * - upload local
 * - upload direto para Cloudinary
 * - remoção com preview controlado
 *
 * @remarks
 * Use `fileMode="local"` quando o arquivo será enviado no submit do formulário.
 * Use `fileMode="cloudinary"` quando o componente deve enviar a imagem e devolver a URL final.
 *
 * A validação de tipo/tamanho aqui é apenas conveniência (client-side, contornável).
 * A validação que garante segurança é a do servidor (ex: company_write_serializer.py).
 *
 * @example
 * Upload de logo local:
 * ```tsx
 * <MaskedInput
 *   variant="file"
 *   id="logo"
 *   label="Logo"
 *   aspect="square"
 *   fileMode="local"
 *   accept="image/*"
 *   maxSizeMB={5}
 *   value={company?.logo}
 *   onChange={(file) => form.setFieldValue('logoFile', file)}
 *   onRemove={() => {
 *     form.setFieldValue('logoFile', null)
 *     form.setFieldValue('removeLogo', true)
 *   }}
 * />
 * ```
 */

'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { BsImage } from 'react-icons/bs'
import { ErrorDiv, InputLabel, MaskedInputContainer } from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'
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

/** Limite de tamanho padrão quando o pai não define `maxSizeMB`. */
const DEFAULT_MAX_SIZE_MB = 5

/** Extrai um nome de arquivo legível de uma URL (Cloudinary, Django media, etc.) */
function filenameFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname
    return decodeURIComponent(path.split('/').pop() ?? url)
  } catch {
    return url
  }
}

/**
 * Verifica se o tipo real do arquivo bate com o filtro `accept`.
 * Suporta padrões como "image/*", "image/png", ".png,.jpg" ou lista separada por vírgula.
 * Se `accept` não for informado, aceita qualquer tipo (comportamento neutro).
 */
function matchesAccept(file: File, accept?: string): boolean {
  if (!accept || !accept.trim()) return true

  const patterns = accept
    .split(',')
    .map(p => p.trim().toLowerCase())
    .filter(Boolean)

  const mime = file.type.toLowerCase()
  const name = file.name.toLowerCase()

  return patterns.some(pattern => {
    // Extensão: ".png"
    if (pattern.startsWith('.')) {
      return name.endsWith(pattern)
    }
    // Wildcard de família: "image/*"
    if (pattern.endsWith('/*')) {
      const family = pattern.slice(0, pattern.indexOf('/'))
      return mime.startsWith(`${family}/`)
    }
    // MIME exato: "image/png"
    return mime === pattern
  })
}

export function FileInput(props: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [fileNames, setFileNames] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const prev = useRef<string[]>([])

  const hasError = props.touched && props.error
  const multiple = Boolean(props.multiple)
  const isSingleCard = !multiple // logo/banner = card único; múltiplos = grid legado

  // Valor já existente (ex: URL salva no backend), usado quando nenhum arquivo novo foi escolhido.
  const existingValue = Array.isArray(props.value) ? props.value[0] : props.value
  const hasNewSelection = previews.length > 0
  const displayPreview = hasNewSelection ? previews[0] : existingValue || null
  const displayFileName = hasNewSelection
    ? fileNames[0]
    : existingValue
      ? filenameFromUrl(existingValue)
      : (props.filenameLabel ?? 'Nenhum arquivo escolhido')

  /**
   * Valida tipo real e tamanho de cada arquivo ANTES de gerar previews/uploads.
   * Arquivos inválidos são descartados com feedback ao usuário.
   */
  function validateFiles(files: File[]): File[] {
    const maxSizeMB = props.maxSizeMB ?? DEFAULT_MAX_SIZE_MB
    const valid: File[] = []

    for (const file of files) {
      // 1) Tipo real do arquivo (defesa contra accept="image/*" contornável)
      if (!matchesAccept(file, props.accept)) {
        toast.error(`"${file.name}" tem um tipo não permitido e foi ignorado`)
        continue
      }
      // 2) Tamanho
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`"${file.name}" excede ${maxSizeMB}MB e foi ignorado`)
        continue
      }
      valid.push(file)
    }

    return valid
  }

  function handleFiles(filesList: FileList | null) {
    if (!filesList || filesList.length === 0) return

    // Valida ANTES de criar object URLs, para não vazar previews de arquivos rejeitados.
    const files = validateFiles(Array.from(filesList))
    if (files.length === 0) return

    const urls = files.map(f => URL.createObjectURL(f))

    prev.current.forEach(URL.revokeObjectURL)
    prev.current = urls

    setPreviews(urls)
    setFileNames(files.map(f => f.name))

    props.onFileChange?.({ files, previews: urls })

    if (props.fileMode === 'local') {
      props.onChange?.(multiple ? files : files[0])
      return
    }

    uploadToCloudinary(files)
  }

  async function uploadToCloudinary(files: File[]) {
    if (!props.uploadPreset || !props.cloudName) {
      toast.error('Configuração de upload ausente (cloudName/uploadPreset)')
      return
    }

    setIsUploading(true)
    props.onUploadingChange?.(true)

    try {
      const results = await Promise.allSettled(
        files.map(async file => {
          const fd = new FormData()
          fd.append('file', file)
          fd.append('upload_preset', props.uploadPreset as string)

          const res = await fetch(`https://api.cloudinary.com/v1_1/${props.cloudName}/image/upload`, { method: 'POST', body: fd })

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

      const uploaded = results.filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled').map(r => r.value)

      const failedCount = results.length - uploaded.length
      if (failedCount > 0) {
        toast.error(failedCount === files.length ? 'Falha ao enviar o(s) arquivo(s).' : `${failedCount} arquivo(s) falharam no envio.`)
      }

      if (uploaded.length > 0) {
        props.onChange?.(multiple ? uploaded : uploaded[0])
        toast.success('Upload concluído!')
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

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
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
    <MaskedInputContainer $variant="file" $radius={props.radius}>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={props.accept}
        multiple={multiple}
        disabled={props.disabled}
        onChange={e => {
          handleFiles(e.target.files)
          e.target.value = '' // permite reselecionar o mesmo arquivo depois
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
          onDragOver={e => {
            e.preventDefault()
            if (!busy) setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <FileCardPreviewBox $aspect={props.aspect}>
            {displayPreview ? <Image src={displayPreview} alt={props.label ?? 'Preview'} fill sizes="100%" /> : <BsImage />}
          </FileCardPreviewBox>

          <FileCardFooter>
            <FileTrigger type="button" onClick={() => inputRef.current?.click()} disabled={busy}>
              {isUploading ? 'Enviando...' : 'Escolher arquivo'}
            </FileTrigger>
            <FileCardFileName title={displayFileName}>{displayFileName}</FileCardFileName>
          </FileCardFooter>

          <FileDropHint>ou arraste uma imagem aqui</FileDropHint>

          {displayPreview && (
            <FileRemoveButton type="button" onClick={handleRemove} disabled={busy}>
              {props.removeLabel ?? 'Remover arquivo'}
            </FileRemoveButton>
          )}
        </FileCard>
      ) : (
        <>
          <FileTrigger type="button" onClick={() => inputRef.current?.click()} disabled={busy}>
            {isUploading ? 'Enviando...' : 'Selecionar arquivos'}
          </FileTrigger>

          {previews.length > 0 && (
            <PreviewImageDiv>
              {previews.map((src, i) => (
                <Image key={src} src={src} alt={fileNames[i] ?? 'Preview'} width={88} height={88} />
              ))}
            </PreviewImageDiv>
          )}
        </>
      )}

      {hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
