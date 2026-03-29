import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectActivePage, selectNavFocused, selectNavIndex } from '../state/selectors';
import { NAV_ITEMS } from '../data/pageConfigs';
import { navStyles } from '../styles/componentStyles/navStyles';

export const NavBar = memo(function NavBar() {
  const activePage = useSelector(selectActivePage);
  const navFocused = useSelector(selectNavFocused);
  const navIndex = useSelector(selectNavIndex);

  return (
    <nav style={navStyles.container(navFocused)} role="navigation" aria-label="Main navigation">
      <div style={navStyles.logo}>J</div>
      <ul style={navStyles.navList}>
        {NAV_ITEMS.map((item, i) => {
          const isActive = activePage === item.id;
          const isFocused = navFocused && navIndex === i;

          return (
            <li key={item.id} style={navStyles.navItem(isActive, isFocused)}>
              {item.id === 'search' ? (
                <span style={navStyles.searchLabel}>
                  <svg style={navStyles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.5" y1="16.5" x2="21" y2="21" />
                  </svg>
                  {item.label}
                </span>
              ) : (
                item.label
              )}
              <div style={navStyles.underline(isActive)} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
});
