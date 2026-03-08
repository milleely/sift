import { useState, useEffect } from 'react';
import { MSG, STORAGE_KEYS } from '../../shared/constants';

export function useSiftMessages() {
  const [comments, setComments] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When post data changes in session storage, we know a generation is starting
    const storageListener = (changes, area) => {
      if (area === 'session' && changes[STORAGE_KEYS.CURRENT_POST]) {
        setIsLoading(true);
        setComments(null);
        setError(null);
      }
    };

    // Listen for results from background worker
    const messageListener = (message) => {
      if (message.type === MSG.COMMENTS_READY) {
        setComments(message.comments);
        setIsLoading(false);
        setError(null);
      } else if (message.type === MSG.COMMENTS_ERROR) {
        setError(message.error);
        setIsLoading(false);
        setComments(null);
      }
    };

    chrome.storage.onChanged.addListener(storageListener);
    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return { comments, error, isLoading };
}
