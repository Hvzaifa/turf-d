import { useEffect, useState } from "react";

import { useMotionProfile } from "../../lib/motion/motionProfile";

/** Beat of "thinking" dots before the reply starts arriving. */
const THINKING_MS = 550;
/** Characters revealed per tick, and the tick interval. */
const CHARS_PER_TICK = 2;
const TICK_MS = 16;

export type Typewriter = {
  /** The portion of the answer revealed so far. */
  typed: string;
  /** True while the typing indicator should show instead of text. */
  typing: boolean;
};

/**
 * Types `text` out as if someone were replying, restarting whenever `text` or
 * `key` changes — `key` lets re-selecting the same answer replay it.
 *
 * Reduced motion skips straight to the full answer.
 */
export function useTypewriter(text: string, key: number): Typewriter {
  const { reduce } = useMotionProfile();
  const [state, setState] = useState<Typewriter>({ typed: "", typing: true });

  useEffect(() => {
    if (reduce) {
      setState({ typed: text, typing: false });
      return;
    }

    setState({ typed: "", typing: true });

    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      let i = 0;
      setState({ typed: "", typing: false });
      interval = setInterval(() => {
        i += CHARS_PER_TICK;
        setState({ typed: text.slice(0, i), typing: false });
        if (i >= text.length) clearInterval(interval);
      }, TICK_MS);
    }, THINKING_MS);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, key, reduce]);

  return state;
}
