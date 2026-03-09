import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../../shared/constants';

export function useSiftMessages() {
  const [comments, setComments] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const listener = (changes, area) => {
      if (area !== 'session') return;

      // Post data changed — new generation starting
      if (changes[STORAGE_KEYS.CURRENT_POST]) {
        setIsLoading(true);
        setComments(null);
        setError(null);
      }

      // Results arrived
      if (changes[STORAGE_KEYS.COMMENTS_RESULT]) {
        const result = changes[STORAGE_KEYS.COMMENTS_RESULT].newValue;
        if (!result) return; // cleared to null, ignore
        if (result.comments) {
          setComments(result.comments);
          setError(null);
        } else if (result.error) {
          setError(result.error);
          setComments(null);
        }
        setIsLoading(false);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  return { comments, error, isLoading };
}
