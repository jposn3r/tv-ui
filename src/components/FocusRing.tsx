import { type CSSProperties } from 'react';
import { theme } from '../styles/theme';

interface FocusRingProps {
  isFocused: boolean;
  children: React.ReactNode;
  style?: CSSProperties;
}

export function FocusRing({ isFocused, children, style }: FocusRingProps) {
  const baseStyle: CSSProperties = {
    transition: `transform ${theme.animation.focusDuration}ms ease-out, box-shadow ${theme.animation.focusDuration}ms ease-out`,
    transform: isFocused ? 'scale(1.1)' : 'scale(1)',
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
