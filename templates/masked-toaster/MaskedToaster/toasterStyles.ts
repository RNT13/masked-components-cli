/**
 * CSS do toaster como string (zero dependência). Cores via variáveis:
 * --mc-toast-* (prop `tokens`) > --mc-* (ThemeEngine) > fallback fixo.
 */
export const TOASTER_CSS = `
.mc-toaster{position:fixed;z-index:var(--mc-toast-z,1000);display:flex;flex-direction:column;gap:var(--mc-toast-gap,8px);width:min(380px,calc(100vw - 2 * var(--mc-toast-offset,16px)));pointer-events:none}
.mc-toaster[data-position^="top"]{top:calc(var(--mc-toast-offset,16px) + env(safe-area-inset-top,0px));flex-direction:column-reverse}
.mc-toaster[data-position^="bottom"]{bottom:calc(var(--mc-toast-offset,16px) + env(safe-area-inset-bottom,0px))}
.mc-toaster[data-position$="left"]{left:calc(var(--mc-toast-offset,16px) + env(safe-area-inset-left,0px))}
.mc-toaster[data-position$="right"]{right:calc(var(--mc-toast-offset,16px) + env(safe-area-inset-right,0px))}
.mc-toaster[data-position$="center"]{left:50%;transform:translateX(-50%)}

.mc-toast{--_accent:var(--mc-toast-info,var(--mc-info,#3b82f6));--_from:12px;pointer-events:auto;display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:var(--mc-toast-radius,12px);border:1px solid var(--mc-toast-border,var(--mc-border,rgba(128,128,128,.35)));border-left:4px solid var(--_accent);background:var(--mc-toast-bg,var(--mc-surface,#1f2430));color:var(--mc-toast-fg,var(--mc-text,#f2f4f8));box-shadow:var(--mc-toast-shadow,0 10px 30px rgba(0,0,0,.28));font-family:var(--primary-font,system-ui),sans-serif;font-size:14px;font-weight:500;line-height:1.4;animation:mc-toast-in .22s ease both}
.mc-toaster[data-position^="top"] .mc-toast{--_from:-12px}
.mc-toast[data-type="default"]{--_accent:var(--mc-border,rgba(128,128,128,.6))}
.mc-toast[data-type="success"]{--_accent:var(--mc-toast-success,var(--mc-success,#22a55a))}
.mc-toast[data-type="error"]{--_accent:var(--mc-toast-error,var(--mc-danger,#e5484d))}
.mc-toast[data-type="warning"]{--_accent:var(--mc-toast-warning,var(--mc-warning,#f5a524))}
.mc-toast[data-type="loading"]{--_accent:var(--mc-accent,#3b82f6)}
.mc-toast[data-visible="false"]{animation:mc-toast-out .2s ease both;pointer-events:none}

.mc-toast__icon{display:inline-flex;flex:none;margin-top:1px;color:var(--_accent)}
.mc-toast__body{flex:1;min-width:0;overflow-wrap:anywhere}
.mc-toast__action,.mc-toast__close{flex:none;font:inherit;color:inherit;background:transparent;border:1px solid transparent;border-radius:8px;cursor:pointer}
.mc-toast__action{padding:4px 10px;font-weight:700;color:var(--_accent);border-color:var(--_accent)}
.mc-toast__close{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;margin:-4px -6px -4px 0;opacity:.7}
.mc-toast__close:hover,.mc-toast__action:hover{opacity:1;background:rgba(128,128,128,.18)}
.mc-toast__action:focus-visible,.mc-toast__close:focus-visible{outline:2px solid var(--_accent);outline-offset:2px}
.mc-toast__spinner{animation:mc-toast-spin .8s linear infinite}

@keyframes mc-toast-in{from{opacity:0;transform:translateY(var(--_from)) scale(.98)}to{opacity:1;transform:none}}
@keyframes mc-toast-out{from{opacity:1;transform:none}to{opacity:0;transform:translateY(var(--_from)) scale(.98)}}
@keyframes mc-toast-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.mc-toast{animation-duration:.01ms}.mc-toast__spinner{animation-duration:2s}}
`
