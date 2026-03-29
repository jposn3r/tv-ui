import { createStyles } from '../styleEngine';
import { theme } from '../theme';

export const navStyles = createStyles({
  container: (navFocused: boolean) => ({
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    height: theme.spacing.headerHeight,
    display: 'flex' as const,
    alignItems: 'center' as const,
    paddingLeft: theme.spacing.edgePadding,
    paddingRight: theme.spacing.edgePadding,
    background: navFocused
      ? 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 80%, transparent 100%)'
      : 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
    transition: 'background 300ms ease-out',
    fontFamily: theme.typography.fontFamily,
  }),

  logo: {
    color: '#e50914',
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: -1,
    marginRight: 40,
    flexShrink: 0,
  },

  navList: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },

  searchIcon: {
    width: 18,
    height: 18,
    display: 'inline-block',
    verticalAlign: 'middle',
  },

  navItem: (isActive: boolean, isFocused: boolean) => ({
    padding: '6px 14px',
    fontSize: 14,
    fontWeight: isActive ? 700 : 400,
    color: (isFocused || isActive) ? '#ffffff' : 'rgba(255,255,255,0.7)',
    cursor: 'default' as const,
    borderRadius: 4,
    background: isFocused ? 'rgba(255,255,255,0.15)' : 'transparent',
    transition: 'all 150ms ease-out',
    transform: isFocused ? 'scale(1.05)' : 'scale(1)',
    whiteSpace: 'nowrap' as const,
    position: 'relative' as const,
  }),

  underline: (isActive: boolean) => ({
    position: 'absolute' as const,
    bottom: 2,
    left: '50%',
    transform: 'translateX(-50%)',
    width: isActive ? '60%' : '0%',
    height: 2,
    background: '#e50914',
    borderRadius: 1,
    transition: 'width 200ms ease-out',
  }),

  searchLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
});
