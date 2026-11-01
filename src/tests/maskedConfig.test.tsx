// src/tests/maskedConfig.test.tsx
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import {
  MaskedConfigProvider,
  useMaskedConfig
} from '../../templates/masked-config/MaskedConfigProvider'

function Probe() {
  const config = useMaskedConfig()
  return (
    <output data-probe="true">
      {JSON.stringify({
        hasLink: config.linkComponent !== undefined,
        hasImage: config.imageComponent !== undefined,
        locale: config.locale ?? null,
        hasOnError: config.onError !== undefined,
        hasOnSuccess: config.onSuccess !== undefined
      })}
    </output>
  )
}

const FakeLink = (props: { href: string; children?: React.ReactNode }) => (
  <a href={props.href}>{props.children}</a>
)

describe('MaskedConfigProvider', () => {
  it('sem provider: config vazia (fallbacks nativos)', () => {
    const html = renderToStaticMarkup(<Probe />)
    // renderToStaticMarkup escapa aspas como &quot;
    expect(html).toContain('&quot;hasLink&quot;:false')
    expect(html).toContain('&quot;hasImage&quot;:false')
    expect(html).toContain('&quot;locale&quot;:null')
    expect(html).toContain('&quot;hasOnError&quot;:false')
    expect(html).toContain('&quot;hasOnSuccess&quot;:false')
  })

  it('com provider: expõe linkComponent/locale/callbacks', () => {
    const html = renderToStaticMarkup(
      <MaskedConfigProvider
        config={{
          linkComponent: FakeLink,
          locale: 'en-US',
          onError: () => {},
          onSuccess: () => {}
        }}
      >
        <Probe />
      </MaskedConfigProvider>
    )
    expect(html).toContain('&quot;hasLink&quot;:true')
    expect(html).toContain('&quot;locale&quot;:&quot;en-US&quot;')
    expect(html).toContain('&quot;hasOnError&quot;:true')
    expect(html).toContain('&quot;hasOnSuccess&quot;:true')
  })
})
