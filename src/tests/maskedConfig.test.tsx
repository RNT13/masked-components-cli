import { describe, expect, it } from "vitest";
import { createElement } from "react";
// @ts-expect-error react-dom/server typings are unavailable in this project
import { renderToStaticMarkup } from "react-dom/server";
import { MaskedConfigProvider, useMaskedConfig } from "../../templates/masked-config";

function Probe(props: {
  onRead: (cfg: ReturnType<typeof useMaskedConfig>) => void;
}) {
  props.onRead(useMaskedConfig());
  return null;
}

describe("MaskedConfigProvider", () => {
  it("sem provider: config vazia (fallbacks nativos)", () => {
    let cfg: ReturnType<typeof useMaskedConfig> | undefined;
    renderToStaticMarkup(createElement(Probe, { onRead: (c) => (cfg = c) }));
    expect(cfg).toEqual({});
  });

  it("com provider: expõe linkComponent/locale/callbacks", () => {
    let cfg: ReturnType<typeof useMaskedConfig> | undefined;
    const Link = (p: { href: string }) => createElement("a", { href: p.href });
    const onError = () => undefined;
    renderToStaticMarkup(
      createElement(
        MaskedConfigProvider,
        {
          config: { linkComponent: Link as never, onError, locale: "en" },
          children: createElement(Probe, { onRead: (c) => (cfg = c) }),
        },
      ),
    );
    expect(cfg?.linkComponent).toBe(Link);
    expect(cfg?.onError).toBe(onError);
    expect(cfg?.locale).toBe("en");
  });
});
