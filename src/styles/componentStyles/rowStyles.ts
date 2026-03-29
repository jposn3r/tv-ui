import { createStyles } from '../styleEngine';
import { theme } from '../theme';

export const rowStyles = createStyles({
  container: {},

  overflowWrapper: {
    overflow: 'hidden',
    paddingTop: 40,
    paddingBottom: 40,
    marginTop: -40,
    marginBottom: -40,
  },

  tilesWrapper: (scrollOffset: number) => ({
    display: 'flex' as const,
    gap: theme.spacing.tileGap,
    paddingLeft: theme.spacing.edgePadding,
    paddingRight: theme.spacing.edgePadding,
    transform: `translateX(-${scrollOffset}px)`,
  }),

  leftSpacer: (width: number) => ({
    width,
    flexShrink: 0,
  }),
});
