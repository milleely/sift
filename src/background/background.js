import { MSG, STORAGE_KEYS } from '../shared/constants.js';
import { getLocal, setSession } from '../shared/storage.js';
import { buildPrompt } from './prompt.js';
import { generateComments } from './api.js';

// Allow sidepanel to open when extension icon is clicked
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== MSG.SIFT_CLICKED) return;

  const tabId = sender.tab?.id;

  // MUST open sidepanel synchronously to preserve user gesture chain
  if (tabId) {
    chrome.sidePanel.open({ tabId });
  }

  // Async work: store post data, call API, write results to session storage
  (async () => {
    try {
      // Write post data + clear previous results so sidepanel shows loading
      await setSession(STORAGE_KEYS.CURRENT_POST, message.postData);
      await setSession(STORAGE_KEYS.COMMENTS_RESULT, null);

      const apiKey = await getLocal(STORAGE_KEYS.API_KEY);
      if (!apiKey) {
        await setSession(STORAGE_KEYS.COMMENTS_RESULT, {
          error: 'No API key configured. Open Sift settings to add your Claude API key.',
        });
        return;
      }

      const profile = await getLocal(STORAGE_KEYS.USER_PROFILE);
      const prompt = buildPrompt(profile, message.postData);
      const comments = await generateComments(apiKey, prompt);

      await setSession(STORAGE_KEYS.COMMENTS_RESULT, { comments });
    } catch (err) {
      await setSession(STORAGE_KEYS.COMMENTS_RESULT, {
        error: err.message || 'Something went wrong. Try again.',
      });
    }
  })();

  return true;
});
