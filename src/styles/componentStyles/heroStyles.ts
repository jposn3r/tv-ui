import { createStyles } from '../styleEngine';
import { theme } from '../theme';

export const heroStyles = createStyles({
  container: (heightVh: number, opacity: number) => ({
    position: 'relative' as const,
    width: '100%',
    height: `${heightVh}vh`,
    overflow: 'hidden' as const,
    opacity,
    flexShrink: 0,
  }),

  backdrop: (opacity: number) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block' as const,
    transition: `opacity ${theme.animation.trailerFadeMs}ms ease-out`,
    opacity,
  }),

  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: theme.colors.gradientBottom,
    pointerEvents: 'none',
    zIndex: 2,
  },

  gradientLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '50%',
    background: theme.colors.gradientLeft,
    pointerEvents: 'none',
    zIndex: 2,
  },

  textContainer: (dimmed: boolean) => ({
    position: 'absolute' as const,
    bottom: 60,
    left: theme.spacing.edgePadding,
    maxWidth: 500,
    zIndex: 3,
    opacity: dimmed ? 0.5 : 1,
    transition: `opacity ${theme.animation.trailerFadeMs}ms ease-out`,
  }),

  title: {
    color: theme.colors.text,
    fontSize: theme.typography.heroTitle.fontSize,
    fontWeight: theme.typography.heroTitle.fontWeight,
    marginBottom: 12,
    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
  },

  synopsis: {
    color: theme.colors.text,
    fontSize: theme.typography.heroSynopsis.fontSize,
    fontWeight: theme.typography.heroSynopsis.fontWeight,
    lineHeight: theme.typography.heroSynopsis.lineHeight,
    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
    opacity: 0.9,
    marginBottom: 20,
  },

  logoImage: {
    maxWidth: 350,
    maxHeight: 120,
    marginBottom: 16,
    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
    display: 'block',
  },

  buttonsRow: (visible: boolean) => ({
    display: 'flex' as const,
    gap: 12,
    opacity: visible ? 1 : 0,
    transition: 'opacity 300ms ease-out',
  }),

  heroButton: (isFocused: boolean, _isWeb = false) => ({
    padding: '12px 28px',
    borderRadius: 4,
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer' as const,
    color: isFocused ? '#000' : theme.colors.text,
    background: isFocused ? '#fff' : 'rgba(255,255,255,0.2)',
    transform: isFocused ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 150ms ease-out',
    letterSpacing: 0.5,
  }),

  muteIndicator: (visible: boolean) => ({
    position: 'absolute' as const,
    bottom: 16,
    right: 24,
    zIndex: 4,
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 6,
    padding: '6px 12px',
    borderRadius: 4,
    background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: 500,
    opacity: visible ? 0.8 : 0,
    transition: 'opacity 300ms ease-out',
    pointerEvents: 'none' as const,
  }),

  videoLayer: (playing: boolean) => ({
    zIndex: 1,
    opacity: playing ? 1 : 0,
    transition: `opacity ${theme.animation.trailerFadeMs}ms ease-out`,
  }),
});
