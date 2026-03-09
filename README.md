# Sift

**LinkedIn comment copilot.** Sift adds a button to every LinkedIn post that generates comment suggestions in your voice. Click, copy, paste, done.

LinkedIn's algorithm rewards consistent commenting — but writing thoughtful comments that add value takes mental energy. Sift removes the friction: one click generates 3 comment options tailored to the post, in your tone.

## How it works

1. Scroll LinkedIn as usual
2. Click the **Sift** button on any post (appears alongside Like, Comment, Repost, Send)
3. The sidebar shows 3 comment suggestions in different styles:
   - **Take** — a sharp opinion that builds on or challenges the post
   - **Question** — something specific the author would want to answer
   - **Experience** — a concrete personal detail related to the post
4. Copy one, edit it, paste into LinkedIn's comment box
5. You always post manually — Sift is a copilot, not an autopilot

## Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/milleely/sift.git
   cd sift && npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. Load in Chrome:
   - Go to `chrome://extensions`
   - Enable **Developer mode**
   - Click **Load unpacked** → select the `dist/` folder

4. Configure:
   - Right-click the Sift extension icon → **Options**
   - Add your [Claude API key](https://console.anthropic.com/settings/keys)
   - Add your name, role, tone preference, and a few example comments you've written

## What Sift is NOT

- Not a feed curator or content discovery tool
- Not an auto-commenter (you always post manually)
- Not a generic AI comment generator (it writes in YOUR voice)

## Tech

Manifest V3 Chrome extension. Content script (plain JS) injects the button and reads post data. Background service worker calls the Claude API. Sidebar (React + Tailwind) displays suggestions. Built with Vite.

## Cost

~$0.005 per generation using Claude Sonnet. At 5 comments/day, that's ~$0.75/month.
