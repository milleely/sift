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

  // Async work: store post data, call API, relay results
  (async () => {
    try {
      // Write post data to session storage so sidepanel can read on mount
      await setSession(STORAGE_KEYS.CURRENT_POST, message.postData);

      const apiKey = await getLocal(STORAGE_KEYS.API_KEY);
      if (!apiKey) {
        chrome.runtime.sendMessage({
          type: MSG.COMMENTS_ERROR,
          error: 'No API key configured. Open Sift settings to add your Claude API key.',
        });
        return;
      }

      const profile = await getLocal(STORAGE_KEYS.USER_PROFILE);
      const prompt = buildPrompt(profile, message.postData);
      const comments = await generateComments(apiKey, prompt);

      chrome.runtime.sendMessage({ type: MSG.COMMENTS_READY, comments });
    } catch (err) {
      chrome.runtime.sendMessage({
        type: MSG.COMMENTS_ERROR,
        error: err.message || 'Something went wrong. Try again.',
      });
    }
  })();

  // Return true to indicate async response handling
  return true;
});
