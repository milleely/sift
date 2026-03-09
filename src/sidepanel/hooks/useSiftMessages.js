import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../../shared/constants';

export function useSiftMessages() {
  const [comments, setComments] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // On mount: check if a generation is already in flight
    chrome.storage.session.get(
      [STORAGE_KEYS.CURRENT_POST, STORAGE_KEYS.COMMENTS_RESULT],
      (result) => {
        const post = result[STORAGE_KEYS.CURRENT_POST];
        const commentsResult = result[STORAGE_KEYS.COMMENTS_RESULT];

        if (commentsResult?.comments) {
          setComments(commentsResult.comments);
        } else if (commentsResult?.error) {
          setError(commentsResult.error);
        } else if (post) {
          // Post exists but no result yet — generation in flight
          setIsLoading(true);
        }
      }
    );

    // Live updates for subsequent interactions
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
