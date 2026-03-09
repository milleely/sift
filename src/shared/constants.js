// Message types for chrome.runtime messaging
export const MSG = {
  SIFT_CLICKED: 'SIFT_CLICKED',
  COMMENTS_READY: 'COMMENTS_READY',
  COMMENTS_ERROR: 'COMMENTS_ERROR',
};

// chrome.storage keys
export const STORAGE_KEYS = {
  API_KEY: 'sift_api_key',
  USER_PROFILE: 'sift_user_profile',
  CURRENT_POST: 'sift_current_post',
  COMMENTS_RESULT: 'sift_comments_result',
};

// Defaults
export const DEFAULTS = {
  TONE: 'insightful',
  MODEL: 'claude-sonnet-4-5-20250929',
  MAX_COMMENT_WORDS: 30,
};
