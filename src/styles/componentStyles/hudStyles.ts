import { createStyles } from '../styleEngine';

export const hudStyles = createStyles({
  container: {
    position: 'fixed',
    top: 12,
    right: 12,
    zIndex: 9999,
    background: 'rgba(0, 0, 0, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 6,
    padding: '10px 14px',
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#0f0',
    lineHeight: 1.6,
    pointerEvents: 'none',
    minWidth: 160,
  },
});
