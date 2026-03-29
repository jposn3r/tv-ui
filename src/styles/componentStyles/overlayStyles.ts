import { createStyles } from '../styleEngine';
import { theme } from '../theme';

export const overlayStyles = createStyles({
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: theme.colors.overlayBg,
    zIndex: 100,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  panel: {
    width: '100%',
    maxWidth: 900,
    background: theme.colors.surface,
    borderRadius: '12px 12px 0 0',
    padding: 40,
    display: 'flex',
    gap: 32,
  },

  poster: {
    width: 200,
    height: 300,
    borderRadius: 8,
    objectFit: 'cover',
    flexShrink: 0,
  },

  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: theme.typography.fontWeightBold,
  },

  meta: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },

  synopsis: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 1.5,
    opacity: 0.85,
  },

  buttonsRow: {
    display: 'flex',
    gap: 12,
    marginTop: 16,
  },

  button: (isFocused: boolean) => ({
    padding: '10px 24px',
    borderRadius: 4,
    border: 'none',
    fontSize: 15,
    fontWeight: theme.typography.fontWeightSemibold,
    cursor: 'default' as const,
    color: isFocused ? '#000' : theme.colors.text,
    background: isFocused ? '#fff' : 'rgba(255,255,255,0.15)',
    transform: isFocused ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 150ms ease-out',
  }),
});
