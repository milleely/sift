# Sift - Product Spec v0.2

**Created:** March 3, 2026
**Updated:** March 7, 2026
**Owner:** Michael
**Status:** In Development
**Format:** Chrome Extension

---

## The Problem

LinkedIn's algorithm rewards consistent commenting on others' posts. Most advice says 5 comments/day is the bar for meaningful engagement growth. But even when you find a post worth engaging with, drafting a thoughtful comment that adds value takes mental energy. After doing it once or twice, most people (including creators with 10K+ followers) stop and move on.

The result: you post consistently but under-invest in commenting, which is the highest-ROI LinkedIn activity for visibility and follower growth.

**Current state:** 1-5 comments/week
**Target state:** 5 comments/day
**Core friction:** Not finding posts. Writing comments that sound like you and add value.

---

## The Solution

A Chrome extension that adds a "Sift" button to every LinkedIn post. Click it, and the extension generates 2-3 comment suggestions in your voice. You pick one, edit it, paste it, done.

**Core philosophy:** Copilot, not autopilot. You always edit and post manually. No auto-commenting. No engagement pods. No gaming the algorithm. The AI structures your thoughts; you own the words.

**What Sift is NOT:**
- Not a feed curator or content discovery tool
- Not an auto-commenter (you always post manually)
- Not a generic AI comment generator (it writes in YOUR voice)

---

## How It Works

### User Flow (Target: 30 seconds per comment)

1. You scroll LinkedIn naturally, browsing your feed as usual
2. You see a post that interests you
3. You click the Sift button (appears alongside Like/Comment/Repost/Send)
4. The sidebar opens showing:
   - The post author and a content preview
   - 2-3 AI-generated comment suggestions in different styles
   - Each comment is editable inline
5. You pick one, tweak it, click "Copy"
6. Paste into LinkedIn's comment box, post manually
7. Move on to the next post

### Comment Generation

When the user clicks the Sift button on a post:

1. Content script extracts the post text, author name, and author headline
2. Sends to Claude API (Sonnet for cost efficiency)
3. Claude generates 2-3 comment options based on:
   - The post content (what are they actually saying?)
   - The user's background and expertise (stored in settings)
   - The user's tone preference
4. Comments appear in the sidebar within 2-3 seconds

### Comment Quality Rules (Non-Negotiable)

- Never generic ("Great post!", "Love this!", "So true!")
- Must reference something specific from the post
- Must add a perspective, question, or personal experience
- Under 50 words by default (short comments perform best on LinkedIn)
- No hashtags in comments
- No emojis unless the user's style includes them
- Should sound like something the user would actually write

### Comment Styles

Each generation produces 2-3 options from these styles:

1. **Add a take** - Share a perspective or opinion that builds on the post ("I've seen the opposite in my experience. When I was building [X]...")
2. **Ask a question** - Genuine curiosity that invites the author to respond ("Curious how this applies to [specific scenario]?")
3. **Share an experience** - Relate it to something personal ("This happened to me when I was [doing X]. The part about [Y] especially resonates because...")

The user can configure which styles they prefer in settings.

---

## AI Prompt Design

```
You are a LinkedIn comment assistant. Generate 2-3 comment options for the following post.

User Profile:
- Name: {user.name}
- Role: {user.role}
- Background: {user.background}
- Tone: {user.tone_preference}

Here are examples of how this user actually writes comments on LinkedIn:
1. "{example_comment_1}"
2. "{example_comment_2}"
3. "{example_comment_3}"

Match this voice, vocabulary, and sentence structure.

Post being commented on:
- Author: {post.author_name}
- Author headline: {post.author_headline}
- Content: {post.content}

Rules:
- Each comment must be under 50 words
- Each comment must reference something specific from the post
- Each comment must add value (a take, question, or experience)
- Never use "Great post", "Love this", "Thanks for sharing", "So true", or similar generic phrases
- Never use hashtags
- Match the user's tone: {user.tone_preference}
- Sound like a real person, not an AI
- Never use em dashes

Generate exactly 3 comments, one for each style:
1. ADD A TAKE: Share a perspective that builds on or challenges the post
2. ASK A QUESTION: Ask something specific that invites a response
3. SHARE AN EXPERIENCE: Relate it to a personal experience

Format as JSON:
[
  {"style": "take", "comment": "..."},
  {"style": "question", "comment": "..."},
  {"style": "experience", "comment": "..."}
]
```

---

## User Settings

**Profile (one-time setup):**
- Your name
- Your role/background (1-2 sentences, used for comment relevance)
- Tone preference: witty / insightful / supportive / direct / casual
- 3-5 example comments you've written that represent your voice

**Preferences:**
- Default number of suggestions: 2 or 3
- Preferred comment styles (take / question / experience)
- Max comment length (default: 50 words)

---

## Technical Architecture

### Chrome Extension

**Stack:**
- Manifest V3 Chrome Extension
- Content script: injects Sift button on LinkedIn posts, extracts post data on click
- Sidepanel: React + Tailwind, displays comment suggestions
- Background service worker: handles Claude API calls

**Content Script responsibilities:**
- On linkedin.com/feed load, inject a Sift button into each post's action bar
- Use MutationObserver to inject buttons on new posts as user scrolls (LinkedIn lazy-loads)
- On button click: extract post content, author name, author headline from that specific post
- Send extracted data to background worker via chrome.runtime.sendMessage
- Do NOT inject button on sponsored/promoted posts (check for "Promoted" text in `.update-components-actor__sub-description`)

**Sift Button placement:**
- Inject alongside LinkedIn's existing action buttons (Like, Comment, Repost, Send)
- Small, unobtrusive icon + "Sift" label
- Matches LinkedIn's action bar styling so it feels native
- On hover: tooltip "Generate comment ideas"

**DOM selectors (confirmed March 2026):**
```javascript
const SELECTORS = {
  // Action bar where Like/Comment/Repost/Send live
  actionBar: '.feed-shared-social-action-bar',
  // Post content to extract when button is clicked
  authorName: '.update-components-actor__title',
  authorHeadline: '.update-components-actor__description',
  postContent: '.update-components-update-v2__commentary',
  // Sponsored post filter
  sponsoredCheck: '.update-components-actor__sub-description',
};
```

**Sidepanel responsibilities:**
- Display loading state while Claude generates ("Generating comments...")
- Show 2-3 comment cards with style label, comment text, and action buttons
- Inline editing on each comment card
- "Copy" button on each card (copies to clipboard)
- "Regenerate" button to get fresh suggestions
- History of recent comments generated (stored locally)

**Background Worker responsibilities:**
- Receive post data from content script
- Load user settings (profile, tone, example comments) from chrome.storage
- Call Claude API (Sonnet) with assembled prompt
- Parse response and send comment suggestions back to sidepanel

### Data Storage

**Chrome Storage (local):**
- User profile and settings
- Example comments for voice matching
- Comment history (last 50 generated comments)
- No post data persisted, no feed data stored

### API and Costs

- Model: Claude Sonnet (claude-sonnet-4-5-20250929)
- Estimated cost per generation: ~$0.005 (short input, short output)
- 5 comments/day = 5 generations/day = ~$0.025/day = ~$0.75/month per user
- API key stored securely in chrome.storage (user provides their own key for personal use, or backend proxy for public version)

---

## Build Phases

### Phase 1: Personal MVP (1 week)

**Goal:** Working extension that generates comments on demand. Personal use only.

- [ ] Chrome extension scaffold (Manifest V3, sidepanel, content script)
- [ ] Content script injects Sift button on each post's action bar
- [ ] MutationObserver to handle dynamically loaded posts as user scrolls
- [ ] Button click extracts post content, author, headline
- [ ] Background worker calls Claude API with extracted data + user profile
- [ ] Sidepanel displays 2-3 comment suggestions
- [ ] Copy to clipboard button on each suggestion
- [ ] Settings page for profile, tone, and example comments
- [ ] Do NOT inject button on sponsored/promoted posts
- [ ] Dogfood for 2 weeks

**Success criteria:** Using it daily. Commenting 5x/day. Comments sound like me after minimal editing.

### Phase 2: Polish and Voice Tuning (1 week)

**Goal:** Comments consistently sound like the user with minimal editing.

- [ ] Prompt engineering: iterate on Claude prompt for better output
- [ ] Add few-shot examples to prompt (user's real comments)
- [ ] Inline editing in sidebar so user can tweak before copying
- [ ] Regenerate button for fresh suggestions
- [ ] Comment history (view past generated comments)
- [ ] Refine button injection styling to feel native to LinkedIn
- [ ] Handle edge cases: very short posts, image-only posts, article shares, polls

**Success criteria:** Comments require less than 20% editing. Users can't tell which comments were AI-assisted.

### Phase 3: Public-Ready (1-2 weeks)

**Goal:** Make Sift installable by others.

- [ ] Auth layer (Clerk) for multi-user support
- [ ] API key management (user provides own Claude API key, or backend proxy)
- [ ] Onboarding flow: set up profile, paste 3-5 example comments, pick tone
- [ ] Landing page (single page with "Add to Chrome" CTA)
- [ ] Chrome Web Store listing
- [ ] Error handling (API failures, rate limits, LinkedIn DOM changes)
- [ ] Privacy policy (required for Chrome Web Store)

**Success criteria:** 5 beta users installing and using daily without hand-holding.

### Phase 4: Monetization (future)

**Goal:** Sustainable revenue if there's demand.

**Free tier:**
- 5 comment generations per day
- 2 comment styles

**Pro tier ($9/month):**
- Unlimited generations
- All 3 comment styles
- Comment history
- Priority support

**Unit economics:**
- API cost: ~$0.75/mo per active user
- At $9/mo: ~$8 margin per user

---

## Competitive Positioning

| Tool | What it does | How Sift is different |
|------|-------------|----------------------|
| Engage AI ($29/mo) | AI comment suggestions with tone slider | Generic output. Doesn't learn your voice. Expensive. |
| Commenter AI | Highlight post, get AI comment | One-size-fits-all tone. No voice training. |
| LiGo | Chrome extension, comment generation | Generic templates. No personalization. |
| FlyEngage | AI comment generator for sales reps | Sales-focused, not creator-focused. |
| **Sift ($9/mo)** | Comments in YOUR voice via Claude | Learns from your real comments. Few-shot voice matching. Creator-first. |

**One-liner:** Other tools generate comments. Sift generates YOUR comments.

---

## Risks

**Risk 1: LinkedIn DOM changes break button injection**
- Likelihood: Medium
- Impact: Medium (only one selector to maintain for the action bar)
- Mitigation: Abstract selector into config. Single point of failure vs. the old approach which had 8+ selectors.

**Risk 2: Comments sound generic despite voice training**
- Likelihood: Medium
- Impact: High (core value prop)
- Mitigation: Few-shot examples are the key lever. More examples = better voice match. Iterate on prompt until output passes the "would I actually post this?" test.

**Risk 3: Users just use ChatGPT instead**
- Likelihood: Medium
- Impact: High
- Mitigation: Sift eliminates the copy-paste-prompt-copy-paste-back workflow. One click on the post, comments appear. Convenience is the moat, not AI quality.

**Risk 4: LinkedIn cracks down on AI-generated comments**
- Likelihood: Low-Medium (the 2025 authenticity update targets patterns, not individual comments)
- Impact: High
- Mitigation: User always edits and posts manually. No automation, no patterns. Comments are human-reviewed before posting.

**Risk 5: Low retention**
- Likelihood: Medium
- Impact: Medium
- Mitigation: The habit loop is built into daily LinkedIn usage. If you open LinkedIn, the button is there. No separate app to remember.

---

## Open Questions

1. **API key management for public version:** Do users bring their own Claude API key, or do we proxy through a backend? Own key = simpler, no backend needed. Proxy = better UX but requires infrastructure and payment processing.

2. **Button placement:** Does LinkedIn's action bar structure allow clean injection, or will the button look out of place? Need to test styling carefully.

3. **Post types:** How do we handle image-only posts, polls, article shares, and video posts where there's minimal text to analyze?

4. **Domain/naming:** Check availability for Sift-related domains. Extension doesn't need a domain for Chrome Web Store, but landing page will need one for public distribution.

5. **Voice training depth:** Is 3-5 example comments enough for good voice matching, or do we need more? Test during dogfooding.

---

*Scoping doc v0.2. Rewritten to focus on comment generation rather than feed curation. Convert to full PRD when ready to build.*