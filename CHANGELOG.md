# Changelog  
  
## 2.0.0  
  
### Renamed  
  
- Package renamed from `masked-components-cli` to `masked-components`.  
  `npx masked-components` is now the install command. The old bin name  
  `masked-components-cli` still works after global install.  
  
### Breaking changes  
  
- `theme.boxShadow.*()` now returns only the shadow value (`none` returns  
  `'none'`). Callers must write `box-shadow: ${theme.boxShadow.md()};`.  
- `CurrencyInput` `onChange` now fires per digit typed (previously only on  
  complete values).  
- Removed internal barrel re-exports that duplicated hook entry points.  
- `useInView` ships exclusively with `masked-animations`; `useSmartSearch`  
  exclusively with `masked-input`. Installing `masked-hooks` no longer  
  provides them.  
  
### Added  
  
- `masked-config` package: `MaskedConfigProvider` for global defaults.  
- `ThemeSemanticColors`: `primaryGradient`, `surfaceGradient`,  
  `accentGradient` per theme.  
- `pickReadable` / `readableTextOn` tinted-dark option: text on accent  
  surfaces can resolve to a dark shade of the accent hue.  
- `themes-contrast.test.ts`: WCAG AA guard for all 17 themes.  
- `MaskedDrawer`/`MaskedPopup`: portal-based menus, `inert` support,  
  `100dvh` heights, first-open animation fix.  
  
### Fixed  
  
- Select/Time dropdowns styled and keyboard-navigable after CLI install.  
- Button text contrast on light themes (ghost/outline/link variants).  
- `borderColor` values too close to `surfaceColor` in light themes.  
- `textMuted` below 4.5:1 in `dark`, `slate`, `forest`, `dracula`.  
- Drawer/Popup flying in from the wrong side on first open.  
- Popup closing without exit animation.  
- SplitButton menu clipped behind sibling cards (now portaled).  
- `MaskedSkeleton` invisible on light themes.  
- `MaskedToaster` position variants documented; `toast` helpers exported.  
- Removed 3 empty `.styles.ts` files and duplicate hook sources.  