import { useEffect, useState } from 'react';
import { fetchContent } from './api.js';
import { DEFAULT_CONTENT } from './defaults.js';

// Renders default copy immediately, swaps in live copy when the API answers,
// and retries a few times so a Render cold start does not leave the page on fallback text.
export default function useContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer;

    const load = async (attempt) => {
      try {
        const data = await fetchContent();
        if (!cancelled) {
          setContent({ ...DEFAULT_CONTENT, ...data });
          setLive(true);
        }
      } catch {
        if (!cancelled && attempt < 4) timer = setTimeout(() => load(attempt + 1), 8000);
      }
    };

    load(0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { content, live };
}
