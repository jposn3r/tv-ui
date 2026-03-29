import { type CSSProperties } from 'react';
import { theme } from '../styles/theme';

interface FocusRingProps {
  isFocused: boolean;
  children: React.ReactNode;
  style?: CSSProperties;
  /** Override the default 1.1 focus scale (e.g., 1.2 when trailer is playing) */
  scale?: number;
  /** Override transform-origin for directional shrink animations */
  transformOrigin?: string;
}

export function FocusRing({ isFocused, children, style, scale, transformOrigin }: FocusRingProps) {
  const focusScale = scale ?? 1.1;
  const baseStyle: CSSProperties = {
    transition: `transform ${theme.animation.focusDuration}ms ease-out, box-shadow ${theme.animation.focusDuration}ms ease-out`,
    transform: isFocused ? `scale(${focusScale})` : 'scale(1)',
    transformOrigin: transformOrigin ?? 'center center',
    zIndex: isFocused ? 10 : 1,
    position: 'relative',
    boxShadow: isFocused
      ? '0 4px 16px rgba(0,0,0,0.5)'
      : 'none',
    borderRadius: theme.tile.borderRadius,
    ...style,
  };

  return <div style={baseStyle}>{children}</div>;
}
