# Changelog

## 2026-03-09
- Redesigned Sift button: vertical layout (icon on top, label below) matching LinkedIn's native action bar
- Switched icon from star to sparkles (filled, 3 four-pointed stars)
- Generated crisp anti-aliased icons using sharp with Lanczos3 resampling (16/24/32/48/128px)
- Added `action.default_icon` in manifest for proper toolbar DPI matching
- Fixed loading state race condition: sidepanel now reads session storage on mount to detect in-flight API calls
- Set up custom command `/update our docs` for doc maintenance
- Created CHANGELOG.md, MEMORY.md, TODO.md

## 2026-03-08
- Prompt engineering overhaul: 30-word cap, anti-AI rules, casual tone, banned generic phrases
- Clean author name extraction (strips "2nd", "Verified", degree badges)
- Clean headline extraction (deduplicates accessibility-doubled text)
- Fixed CORS: added `anthropic-dangerous-direct-browser-access` header
- Fixed messaging: switched background→sidepanel from `sendMessage` to `chrome.storage.session`
- Added `api.anthropic.com` to `host_permissions`
- Fixed empty state: welcome screen shows when no comments/loading/error
- Added CLAUDE.md

## 2026-03-08 (initial)
- Phase 1 scaffold: Manifest V3 Chrome extension
- Content script: Sift button injection, MutationObserver, sponsored post filtering
- Background service worker: Claude API integration with prompt template
- Sidepanel (React + Tailwind): welcome/loading/results states, comment cards with copy
- Settings page (React + Tailwind): profile, tone, example comments, API key
- Vite dual-config build system
- Design tokens from BRAND.md mapped to Tailwind theme
