# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development

```bash
npm run build          # Full build: pages → scripts → copy static assets to dist/
npm run build:pages    # Vite build for React pages (sidepanel + settings)
npm run build:scripts  # Vite build for background service worker (IIFE bundle)
npm run build:copy     # Copies manifest.json, icons, content.js, content.css to dist/
```

After building, load `dist/` as an unpacked extension at `chrome://extensions` (enable Developer mode).

No test framework is configured yet. No linter is configured yet.

## Architecture

Sift is a Manifest V3 Chrome extension that adds a "Sift" button to LinkedIn posts to generate AI comment suggestions via the Claude API. It is a copilot, not an autopilot — users always edit and post comments manually.

### Four Entry Points

1. **Content script** (`src/content/content.js`) — Plain JS, no build step (copied directly to dist). Injects the Sift button into LinkedIn's DOM and extracts post data on click. All LinkedIn DOM selectors live in the `SELECTORS` object at the top of this file — this is the single place to update when LinkedIn changes markup.

2. **Background service worker** (`src/background/background.js`) — Plain JS, bundled as IIFE via Vite. Receives messages from the content script, calls the Claude API, and relays results. **Critical**: `chrome.sidePanel.open()` must be called synchronously in the `onMessage` callback before any `await` to preserve the user gesture chain.

3. **Sidepanel** (`src/sidepanel/`) — React + Tailwind. Displays comment suggestions. Reads initial post data from `chrome.storage.session` on mount (avoids race condition with panel not being ready when message is sent), then listens for `chrome.runtime.onMessage` for results.

4. **Settings page** (`src/settings/`) — React + Tailwind. Saves user profile, tone preference, example comments, and API key to `chrome.storage.local`.

### Data Flow

```
Content Script → sendMessage({SIFT_CLICKED, postData}) → Background
Background → sidePanel.open() (sync) → storage.session.set(postData) → Claude API
Background → sendMessage({COMMENTS_READY, comments}) → Sidepanel
```

The handoff uses `chrome.storage.session` as a buffer because the sidepanel's React app may not have mounted its message listener yet when `sidePanel.open()` is called.

### Build System

Two Vite configs handle different output requirements:
- `vite.config.pages.js` — Multi-page app build for sidepanel and settings (React + Tailwind, relative asset paths via `base: ''`)
- `vite.config.scripts.js` — Library/IIFE build for background.js only (single entry, all imports inlined)
- `content.js` and `content.css` are plain files copied directly (no build step)

### Shared Code

`src/shared/constants.js` defines message types (`MSG`), storage keys (`STORAGE_KEYS`), and defaults (`DEFAULTS`). `src/shared/storage.js` wraps `chrome.storage.local` and `chrome.storage.session` APIs.

## Design Tokens

All styling uses design tokens from `docs/BRAND.md`, mapped into `tailwind.config.js` as custom theme values. Use Tailwind classes like `bg-primary`, `text-text-secondary`, `rounded-card`, `shadow-card`, `p-card-pad`. Font is DM Sans loaded from Google Fonts. Icons use `lucide-react` in React components, inline SVG in the content script.

## Hard Rules

- The extension never scrolls the page, intercepts network requests, or auto-posts anything
- The only DOM interaction is injecting the Sift button and reading post content on click
- All LinkedIn selectors go in the `SELECTORS` object in `src/content/content.js`
- The Claude API key is stored in `chrome.storage.local` (user provides their own key)
