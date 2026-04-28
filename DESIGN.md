# Design

## Visual Theme

Light. A student using their phone in a bright café or bus window — ambient light is warm. The surface should feel like warm paper, not a clinical white screen. Coral is the signature color: present enough to feel alive, restrained enough to not exhaust.

## Color Palette

OKLCH throughout. Neutrals tinted warm toward the coral hue.

| Role | Value | Usage |
|---|---|---|
| `--color-coral` | `oklch(0.63 0.17 28)` | Primary actions, active states, CTAs |
| `--color-coral-light` | `oklch(0.93 0.06 28)` | Backgrounds behind coral elements, tints |
| `--color-coral-dark` | `oklch(0.47 0.16 28)` | Hover states on coral buttons |
| `--color-yellow` | `oklch(0.87 0.14 82)` | Accent, celebration moments, Blobb happy state |
| `--color-yellow-light` | `oklch(0.96 0.05 82)` | Subtle warmth on empty states |
| `--color-bg` | `oklch(0.99 0.006 65)` | Page background |
| `--color-surface` | `oklch(0.97 0.008 65)` | Cards, inputs, panels |
| `--color-surface-2` | `oklch(0.94 0.009 65)` | Hover states, pressed states |
| `--color-border` | `oklch(0.90 0.008 65)` | Dividers, input borders |
| `--color-text` | `oklch(0.17 0.012 55)` | Body text, labels |
| `--color-text-muted` | `oklch(0.48 0.012 55)` | Secondary text, placeholders |
| `--color-text-faint` | `oklch(0.72 0.010 55)` | Disabled, tertiary |

Semantic:
| Role | Value |
|---|---|
| `--color-success` | `oklch(0.58 0.16 155)` |
| `--color-warning` | `oklch(0.72 0.16 75)` |
| `--color-error` | `oklch(0.55 0.20 20)` |

## Typography

One family: **Plus Jakarta Sans** (Google Fonts). Friendly, slightly rounded, strong enough for a grade moment, readable at 13px for dense content. Not Inter. Not Roboto.

Scale (fixed rem, not fluid):

| Step | Size | Weight | Usage |
|---|---|---|---|
| `--text-xs` | `0.75rem / 12px` | 500 | Tags, badges, timestamps |
| `--text-sm` | `0.875rem / 14px` | 400/500 | Body, labels, captions |
| `--text-base` | `1rem / 16px` | 400 | Primary body |
| `--text-lg` | `1.125rem / 16px` | 600 | Section headings, card titles |
| `--text-xl` | `1.375rem / 22px` | 700 | Page headings |
| `--text-2xl` | `1.75rem / 28px` | 800 | Grade reveal, hero moments |
| `--text-3xl` | `2.5rem / 40px` | 800 | Landing hero only |

Line heights: body 1.6, headings 1.2.

## Spacing

Base 4px grid. Primary rhythm: 4, 8, 12, 16, 24, 32, 48, 64px.

Card padding: 16px mobile / 24px desktop.
Section gaps: 24px mobile / 48px desktop.
Tap target minimum: 44px.

## Elevation

No box-shadow by default. One level only, used sparingly:
- Floating elements (mobile nav bar, modal): `0 -1px 0 var(--color-border), 0 8px 24px oklch(0.17 0.012 55 / 0.08)`

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `8px` | Inputs, chips, small buttons |
| `--radius-md` | `12px` | Cards, panels |
| `--radius-lg` | `16px` | Sheets, bottom sheets |
| `--radius-full` | `9999px` | Pills, avatars |

## Components

**Buttons**
- Primary: coral fill, white text, radius-sm, 44px height min
- Secondary: surface fill, text color, border, radius-sm
- Ghost: no background, coral text on hover
- Destructive: error fill

**Inputs**
- Surface background, border on default, coral border on focus
- 44px height minimum, radius-sm

**Cards**
- Surface background, single border (no shadow except floating)
- radius-md, no nested cards

**Grade Badge**
- Large, centered, 2xl type, coral for 5-6, warning for 3-4, error for 1-2

## Motion

`prefers-reduced-motion` respected globally.
- Micro-interactions: 150ms ease-out
- Page transitions: 200ms ease-out
- Blobb animations: handled by Rive (Phase 6); placeholder uses CSS keyframes

## Iconography

Lucide React. Stroke weight 1.5px. Size 20px default, 16px in dense contexts.
