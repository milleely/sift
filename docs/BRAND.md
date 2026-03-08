# Sift Brand & Design Tokens

## Colors

### Primary
- Primary Blue: `#2E6BE6` (CTAs, links, active states, topic match badges)
- Primary Light: `#EBF1FD` (badge backgrounds, hover states, active tab backgrounds)
- Primary Hover: `#1D5BD6` (button hover, pressed states)

### Accent
- Amber: `#E8A23E` (target account badges, priority signals)
- Amber Light: `#FEF5E7` (amber badge backgrounds)

### Surfaces
- Background: `#FAFAFA` (sidebar body)
- Card: `#FFFFFF` (post cards, header, footer)
- Border: `#E8E8E6` (card borders, dividers)
- Border Light: `#F0F0EE` (subtle inner dividers)

### Text
- Primary: `#1A1A1A` (headings, author names)
- Secondary: `#6B6B6B` (body text, post previews)
- Muted: `#9B9B9B` (timestamps, metadata, captions)

### Status
- Success: `#2E9E6B` (draft ready, positive indicators)
- Success Light: `#E8F5EF` (success badge backgrounds)
- Warning: `#D4850A` (alerts, attention needed)

### Extended Badges
- Purple: `#7C5CBF` on `#F3EEFB` (high engagement)
- Teal: `#2E8E8E` on `#E8F5F5` (new connection)

---

## Typography

### Font
- Family: `DM Sans` (Google Fonts)
- Import: `https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap`
- Fallback: `-apple-system, BlinkMacSystemFont, sans-serif`

### Scale
| Use | Weight | Size | Color |
|-----|--------|------|-------|
| Page title | 700 | 16px | #1A1A1A |
| Author name | 600 | 13px | #1A1A1A |
| Body / preview | 500 | 12.5px | #6B6B6B |
| Badge label | 500-600 | 10.5-11px | varies |
| Caption / timestamp | 500 | 11px | #9B9B9B |

### Letter spacing
- Headings: `-0.3px`
- Body: default
- Uppercase labels: `1px`

---

## Spacing

- Base unit: `8px`
- Card padding: `12px`
- Header/footer padding: `16px`
- Gap between cards: `6px`
- Gap between sections: `28-32px`

---

## Border Radius

| Element | Radius |
|---------|--------|
| Cards | 10px |
| Buttons | 8px |
| Logo icon | 8px |
| Badges | 5-6px |
| Sidebar container | 12px |

---

## Shadows

- Card shadow: `0 4px 24px rgba(0,0,0,0.06)`
- No harsh drop shadows anywhere

---

## Sidebar Specs

- Width: `360px`
- Max height: viewport height
- Position: right side of LinkedIn feed
- Scrollable: post list area only (header and footer fixed)

---

## Component Patterns

### Post Card
- White background, 10px radius, 1px border (#F0F0EE)
- Layout: author + timestamp top row, 2-line preview middle, badges + metadata bottom row
- Post preview: 2 lines max, overflow ellipsis

### Badges
- Padding: `3px 8px`
- Border radius: `5px`
- Font: 10.5px, weight 500
- Color-coded by type (see Extended Badges above)

### Buttons
- Primary: #2E6BE6 background, white text, 8px radius
- Secondary/tab: transparent background, #6B6B6B text (active: #EBF1FD background, #2E6BE6 text)
- Font: 12-13px, weight 600

### Transitions
- All interactive elements: `150ms ease`

---

## Icons

- Library: Lucide React (`lucide-react`)
- Style: default stroke width
- Size: 16-20px depending on context

---

## Design Principles

1. **LinkedIn-native**: Light surfaces, familiar card patterns. Feels like it belongs on linkedin.com.
2. **Warm, not corporate**: Soft off-whites, rounded corners, no harsh shadows. Notion-inspired warmth.
3. **Scannable**: Every post card gives author, context, and action in one glance. 5 min daily usage.
4. **Quiet confidence**: No flashy gradients or animations. Tool fades into background so you focus on content.
