# Brand Token Guide

This document defines the core design tokens used throughout the application. Tokens are implemented as CSS custom properties in `src/index.css` so that both Tailwind utility classes and custom components can reference the same source-of-truth colors.

## Palette

| Token | HSL (space-separated) | Hex | Purpose |
|-------|-----------------------|------|---------|
| `--brand-bg` | `210 53% 11%` | `#0D1B2A` | Page background / primary dark surface |
| `--brand-card-bg` | `210 40% 14%` | `#142433` | Card & secondary surfaces |
| `--brand-accent` | `180 42% 76%` | `#A7DADB` | Primary accent for CTAs / highlights |
| `--brand-accent-dark` | `180 42% 55%` | `#6EC8C9` | Accent – hover / pressed state |
| `--brand-accent-light` | `180 42% 90%` | `#E7F8F9` | Accent – subtle backgrounds |
| `--primary` (secondary brand) | `243 72% 58%` | `#4F46E5` | Secondary accent (links, focus) |

### Contrast
All text placed on `--brand-bg` or `--brand-card-bg` must use `--text-main` (`#FFFFFF` equivalent) or ensure a contrast ratio ≥ 4.5:1. Automated tests via Lighthouse should enforce this.

## Typography Scale
| Class | Size | Line Height | Use |
|-------|------|-------------|-----|
| `text-h1` | 3rem | 1.1 | Hero / page title |
| `text-h2` | 2.25rem | 1.2 | Section headings |
| `text-body` | 1rem | 1.6 | Default paragraph |

## Usage Examples
```html
<button class="bg-brand-accent hover:bg-brand-accent-dark text-sidebar-foreground px-6 py-3 rounded-lg">CTA</button>

<h2 class="text-h2 font-quicksand text-primary mb-4">Section heading</h2>

<div class="bg-brand-card-bg p-6 rounded-xl shadow-lg">
  ...
</div>
```

Keep this guide updated whenever new tokens are introduced.
