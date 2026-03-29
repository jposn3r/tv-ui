import { createStyles } from '../styleEngine';
import { theme } from '../theme';

export const shellStyles = createStyles({
  shell: {
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    background: theme.colors.background,
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
  },

  scrollContainer: (offset: number) => ({
    transform: `translateY(-${offset}px)`,
  }),

  rowsContainer: (totalHeight: number) => ({
    position: 'relative' as const,
    height: totalHeight,
    paddingTop: 20,
  }),

  rowWrapper: (top: number) => ({
    position: 'absolute' as const,
    top,
    left: 0,
    right: 0,
  }),
});
