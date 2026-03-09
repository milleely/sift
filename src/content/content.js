// ─── SELECTORS ───────────────────────────────────────────────
// Single source of truth for all LinkedIn DOM queries.
// Update here if LinkedIn changes their markup.
const SELECTORS = {
  actionBar: '.feed-shared-social-action-bar',
  authorName: '.update-components-actor__title',
  authorHeadline: '.update-components-actor__description',
  postContent: '.update-components-update-v2__commentary',
  sponsoredCheck: '.update-components-actor__sub-description',
};

const SIFT_ATTR = 'data-sift-injected';

// ─── SIFT BUTTON SVG ICON (sparkles) ────────────────────────
const SIFT_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L13.5 7.5L19 9L13.5 10.5L12 16L10.5 10.5L5 9L10.5 7.5L12 2Z" fill="currentColor"/>
  <path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25L19 14Z" fill="currentColor"/>
  <path d="M5 14L5.5 15.5L7 16L5.5 16.5L5 18L4.5 16.5L3 16L4.5 15.5L5 14Z" fill="currentColor"/>
</svg>`;

// ─── HELPERS ─────────────────────────────────────────────────

function getPostContainer(actionBar) {
  // Walk up to the post root — LinkedIn wraps each post in an element with data-urn
  let el = actionBar.closest('[data-urn]');
  if (el) return el;
  // Fallback: walk up until we find an element containing both author and content
  el = actionBar.parentElement;
  while (el && el !== document.body) {
    if (el.querySelector(SELECTORS.authorName) && el.querySelector(SELECTORS.postContent)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

function isSponsored(postContainer) {
  if (!postContainer) return false;
  const sub = postContainer.querySelector(SELECTORS.sponsoredCheck);
  if (!sub) return false;
  return sub.textContent.trim().toLowerCase().includes('promoted');
}

function cleanAuthorName(raw) {
  return raw
    .replace(/\s*[\·\•·]\s*(1st|2nd|3rd)\+?\s*/g, '')
    .replace(/\b(1st|2nd|3rd)\+?\b/g, '')
    .replace(/Verified/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanHeadline(raw) {
  const trimmed = raw.replace(/\s+/g, ' ').trim();
  // LinkedIn sometimes renders headline twice for accessibility — deduplicate
  const mid = Math.floor(trimmed.length / 2);
  if (trimmed.length > 20 && trimmed.slice(0, mid).trim() === trimmed.slice(mid).trim()) {
    return trimmed.slice(0, mid).trim();
  }
  return trimmed;
}

function extractPostData(postContainer) {
  if (!postContainer) return null;

  const nameEl = postContainer.querySelector(SELECTORS.authorName);
  const headlineEl = postContainer.querySelector(SELECTORS.authorHeadline);
  const contentEl = postContainer.querySelector(SELECTORS.postContent);

  const authorName = nameEl ? cleanAuthorName(nameEl.innerText) : '';
  const authorHeadline = headlineEl ? cleanHeadline(headlineEl.innerText) : '';
  const content = contentEl ? contentEl.innerText.trim() : '';

  if (!content) return null;

  return { authorName, authorHeadline, content };
}

// ─── BUTTON CREATION ─────────────────────────────────────────

function createSiftButton() {
  const btn = document.createElement('button');
  btn.className = 'sift-btn';
  btn.setAttribute('title', 'Generate comment ideas');
  btn.innerHTML = `${SIFT_ICON}<span class="sift-btn__label">Sift</span>`;
  return btn;
}

// ─── INJECTION ───────────────────────────────────────────────

function injectButton(actionBar) {
  if (actionBar.hasAttribute(SIFT_ATTR)) return;

  const postContainer = getPostContainer(actionBar);
  if (!postContainer) return;
  if (isSponsored(postContainer)) return;

  actionBar.setAttribute(SIFT_ATTR, 'true');

  const btn = createSiftButton();
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const postData = extractPostData(postContainer);
    if (!postData) return;

    btn.classList.add('sift-btn--active');
    chrome.runtime.sendMessage({ type: 'SIFT_CLICKED', postData });
  });

  actionBar.appendChild(btn);
}

function processExistingPosts() {
  const bars = document.querySelectorAll(SELECTORS.actionBar);
  bars.forEach(injectButton);
}

// ─── MUTATION OBSERVER ───────────────────────────────────────

let debounceTimer = null;

function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    let hasNewNodes = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        hasNewNodes = true;
        break;
      }
    }
    if (!hasNewNodes) return;

    // Debounce to batch processing when LinkedIn loads multiple posts at once
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      processExistingPosts();
    }, 200);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// ─── INIT ────────────────────────────────────────────────────

processExistingPosts();
setupObserver();
