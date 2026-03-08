import { STORAGE_KEYS } from './constants.js';

export function getLocal(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => resolve(result[key]));
  });
}

export function setLocal(key, value) {
  return chrome.storage.local.set({ [key]: value });
}

export function getSession(key) {
  return new Promise((resolve) => {
    chrome.storage.session.get(key, (result) => resolve(result[key]));
  });
}

export function setSession(key, value) {
  return chrome.storage.session.set({ [key]: value });
}

export function getUserProfile() {
  return getLocal(STORAGE_KEYS.USER_PROFILE);
}

export function getApiKey() {
  return getLocal(STORAGE_KEYS.API_KEY);
}
