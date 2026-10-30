"use client";

import { createContext, useContext } from "react";
import type { ComponentType, ReactNode } from "react";

/**
 * Provider GLOBAL opcional da biblioteca.
 * Todos os componentes funcionam sem ele (fallbacks nativos):
 *  - linkComponent: `<a>` nativo
 *  - imageComponent: `<img>` nativo
 *  - onError/onSuccess: sem toaster (callbacks simplesmente não disparam UI)
 *  - locale: "pt-BR"
 *
 * Requer "use client" — registre uma vez na raiz do app.
 */

/** Assinatura mínima de um componente de link (compatível com next/link). */
export interface LinkComponentProps {
  href: string;
  className?: string;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: unknown;
}

/** Assinatura mínima de um componente de imagem (compatível com next/image). */
export interface ImageComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  [key: string]: unknown;
}

export interface MaskedConfig {
  /** Componente de link usado por MaskedButton/MaskedCards quando `href` é passado. */
  linkComponent?: ComponentType<LinkComponentProps>;
  /** Componente de imagem usado pelo FileInput (preview). */
  imageComponent?: ComponentType<ImageComponentProps>;
  /** Toaster injetável (ex.: react-hot-toast). Chamado por FileInput em falha/sucesso de upload. */
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
  /** Locale padrão lido pelos componentes (dicionários pt-BR/en embutidos; utils seguem recebendo `locale` por parâmetro). */
  locale?: string;
}

const MaskedConfigContext = createContext<MaskedConfig>({});

export function MaskedConfigProvider(props: {
  config?: MaskedConfig;
  children: ReactNode;
}) {
  return (
    <MaskedConfigContext.Provider value={props.config ?? {}}>
      {props.children}
    </MaskedConfigContext.Provider>
  );
}

/** Lê a config global. Sem provider, retorna `{}` (fallbacks nativos). */
export function useMaskedConfig(): MaskedConfig {
  return useContext(MaskedConfigContext);
}
