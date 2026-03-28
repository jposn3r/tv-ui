import { type CSSProperties, memo } from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../styles/theme';
import { selectActivePage, selectNavFocused, selectNavIndex } from '../state/selectors';
import { NAV_ITEMS } from '../data/pageConfigs';

export const NavBar = memo(function NavBar() {
  const activePage = useSelector(selectActivePage);
  const navFocused = useSelector(selectNavFocused);
  const navIndex = useSelector(selectNavIndex);

  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    height: theme.spacing.headerHeight,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.edgePadding,
    paddingRight: theme.spacing.edgePadding,
    background: navFocused
      ? 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 80%, transparent 100%)'
      : 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
    transition: 'background 300ms ease-out',
    fontFamily: theme.typography.fontFamily,
  };

  const logoStyle: CSSProperties = {
    color: '#e50914',
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: -1,
    marginRight: 40,
    flexShrink: 0,
  };

  const navListStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };

  const searchIconStyle: CSSProperties = {
    width: 18,
    height: 18,
    display: 'inline-block',
    verticalAlign: 'middle',
  };

  return (
    <nav style={containerStyle} role="navigation" aria-label="Main navigation">
      <div style={logoStyle}>J</div>
      <ul style={navListStyle}>
        {NAV_ITEMS.map((item, i) => {
          const isActive = activePage === item.id;
          const isFocused = navFocused && navIndex === i;

          const itemStyle: CSSProperties = {
            padding: '6px 14px',
            fontSize: 14,
            fontWeight: isActive ? 700 : 400,
            color: isFocused
              ? '#ffffff'
              : isActive
                ? '#ffffff'
                : 'rgba(255,255,255,0.7)',
            cursor: 'default',
            borderRadius: 4,
            background: isFocused
              ? 'rgba(255,255,255,0.15)'
              : 'transparent',
            transition: 'all 150ms ease-out',
            transform: isFocused ? 'scale(1.05)' : 'scale(1)',
            whiteSpace: 'nowrap',
            position: 'relative',
          };

          const underlineStyle: CSSProperties = {
            position: 'absolute',
            bottom: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            width: isActive ? '60%' : '0%',
            height: 2,
            background: '#e50914',
            borderRadius: 1,
            transition: 'width 200ms ease-out',
          };

          return (
            <li key={item.id} style={itemStyle}>
              {item.id === 'search' ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg style={searchIconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.5" y1="16.5" x2="21" y2="21" />
                  </svg>
                  {item.label}
                </span>
              ) : (
                item.label
              )}
              <div style={underlineStyle} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
});
