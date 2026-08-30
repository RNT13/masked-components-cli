/* ============================================================
 * FILE PREVIEW
 * ============================================================ */

import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import styled from 'styled-components'

export const PreviewImageDiv = styled.div`
  margin-top: ${maskedTheme.spacing.md};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: ${maskedTheme.spacing.md};

  img {
    border-radius: ${maskedTheme.radius.md};
    object-fit: cover;
    border: 2px solid ${maskedTheme.colors.baseBlue.light20};
    background: ${maskedTheme.colors.baseBlue.light02};
  }
`

/* ============================================================
 * FILE BUTTON
 * ============================================================ */

export const FileTrigger = styled.button`
  width: 100%;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  border-radius: 16px;
  border: 2px solid ${maskedTheme.colors.baseBlue.light20};
  color: ${maskedTheme.colors.baseBlue.light40};
  background-color: ${maskedTheme.colors.baseBlue.dark20};
  font-size: 0.95rem;
  font-weight: 500;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    border-color: ${maskedTheme.colors.baseBlue.base};
    background: ${maskedTheme.colors.baseBlue.light};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${maskedTheme.colors.baseBlue.light20};
  }
`

/* ============================================================
 * FILE — CARD (logo/banner single-image upload)
 * ============================================================ */

export const FileCard = styled.div<{ $dragOver?: boolean }>`
  display: grid;
  gap: ${maskedTheme.spacing.sm};
  padding: ${maskedTheme.spacing.md};
  border-radius: ${maskedTheme.radius.lg};
  border: 2px dashed ${({ $dragOver }) => ($dragOver ? maskedTheme.colors.baseBlue.base : maskedTheme.colors.baseBlue.light20)};
  background: ${({ $dragOver }) => ($dragOver ? maskedTheme.colors.baseBlue.light40 : maskedTheme.colors.baseBlue.light02)};
  transition: ${maskedTheme.transition.default};
`

export const FileCardPreviewBox = styled.div<{ $aspect?: 'square' | 'wide' }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $aspect }) => ($aspect === 'wide' ? '10 / 5' : '1 / 1')};
  max-height: ${({ $aspect }) => ($aspect === 'wide' ? '160px' : '200px')};
  border-radius: ${maskedTheme.radius.md};
  overflow: hidden;
  background-color: ${maskedTheme.colors.baseBlue.light20};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${maskedTheme.colors.baseBlue.light40};
  font-size: 2rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: ${({ $aspect }) => ($aspect === 'wide' ? 'cover' : 'contain')};
  }
`

export const FileCardFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${maskedTheme.spacing.xs};
  min-width: 0;
`

export const FileCardFileName = styled.span`
  display: block;
  min-width: 0;
  max-width: 100%;
  font-size: ${maskedTheme.fontSize.sm};
  font-weight: 600;
  color: ${maskedTheme.colors.baseBlue.dark20};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const FileRemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${maskedTheme.spacing.xs};

  width: fit-content;
  padding: ${maskedTheme.spacing.xs} ${maskedTheme.spacing.sm};
  border-radius: ${maskedTheme.radius.md};

  border: 2px solid ${maskedTheme.colors.baseRed.light20};
  background: ${maskedTheme.colors.baseRed.light02};
  color: ${maskedTheme.colors.baseRed.base};

  font-size: ${maskedTheme.fontSize.sm};
  font-weight: ${maskedTheme.fontWeight.bold};
  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;

  &:hover {
    background: ${maskedTheme.colors.baseRed.light};
    border-color: ${maskedTheme.colors.baseRed.base};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${maskedTheme.colors.baseRed.light20};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
`

export const FileDropHint = styled.span`
  font-size: 0.75rem;
  color: ${maskedTheme.colors.baseBlue.light40};
`
