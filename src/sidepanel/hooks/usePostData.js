import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../../shared/constants';

export function usePostData() {
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    // Read initial post data from session storage
    chrome.storage.session.get(STORAGE_KEYS.CURRENT_POST, (result) => {
      if (result[STORAGE_KEYS.CURRENT_POST]) {
        setPostData(result[STORAGE_KEYS.CURRENT_POST]);
      }
    });

    // Listen for changes (user clicks Sift on a new post while panel is open)
    const listener = (changes, area) => {
      if (area === 'session' && changes[STORAGE_KEYS.CURRENT_POST]) {
        setPostData(changes[STORAGE_KEYS.CURRENT_POST].newValue);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  return { postData };
}
