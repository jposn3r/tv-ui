import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

interface ResponsiveState {
  width: number;
  isMobile: boolean;
  isDesktop: boolean;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => ({
    width: window.innerWidth,
    isMobile: window.innerWidth < MOBILE_BREAKPOINT,
    isDesktop: window.innerWidth >= MOBILE_BREAKPOINT,
  }));

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => {
      setState({
        width: window.innerWidth,
        isMobile: mq.matches,
        isDesktop: !mq.matches,
      });
    };
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return state;
}
