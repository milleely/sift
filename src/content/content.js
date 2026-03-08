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

// ─── SIFT BUTTON SVG ICON ───────────────────────────────────
const SIFT_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 1L10 5.5L15 6.5L11.5 10L12.5 15L8 12.5L3.5 15L4.5 10L1 6.5L6 5.5L8 1Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
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

function extractPostData(postContainer) {
  if (!postContainer) return null;

  const nameEl = postContainer.querySelector(SELECTORS.authorName);
  const headlineEl = postContainer.querySelector(SELECTORS.authorHeadline);
  const contentEl = postContainer.querySelector(SELECTORS.postContent);

  const authorName = nameEl ? nameEl.innerText.trim() : '';
  const authorHeadline = headlineEl ? headlineEl.innerText.trim() : '';
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
