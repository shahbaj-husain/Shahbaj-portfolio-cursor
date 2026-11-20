import { useEffect, useState } from 'react';

export interface TypewriterState {
  displayed: string;
  done: boolean;
}

export function useTypewriter(
  text: string,
  speed = 38,
  startDelay = 600
): TypewriterState {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    let intervalId: number | undefined;
    let index = 0;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          setDone(true);
          if (intervalId !== undefined) {
            window.clearInterval(intervalId);
          }
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
