import { type CSSProperties, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../styles/theme';
import { selectRows, selectFocus, selectActivePage, selectNavFocused, selectSearchResults } from '../state/selectors';
import { ContentRow } from './ContentRow';
import { HeroBanner } from './HeroBanner';
import { DetailOverlay } from './DetailOverlay';
import { NavBar } from './NavBar';
import { SearchPage } from './SearchPage';
import { MyListPage } from './MyListPage';
import { KEYBOARD_GRID, KEYBOARD_COLS } from '../utils/constants';

const KEYBOARD_ROW_COUNT = Math.ceil(KEYBOARD_GRID.length / KEYBOARD_COLS);

export function Shell() {
  const rows = useSelector(selectRows);
  const focus = useSelector(selectFocus);
  const activePage = useSelector(selectActivePage);
  const navFocused = useSelector(selectNavFocused);
  const searchResults = useSelector(selectSearchResults);
  const shellRef = useRef<HTMLDivElement>(null);

  const isSearch = activePage === 'search';
  const isMyList = activePage === 'myList';

  // Reset shell scrollTop whenever leaving search (in case overflow:auto left it scrolled)
  useEffect(() => {
    if (!isSearch && shellRef.current) {
      shellRef.current.scrollTop = 0;
    }
  }, [isSearch]);

  // Vertical scroll calculation
  const rowHeight = theme.tile.height + 40 + theme.spacing.rowGap;
  let verticalOffset = 0;

  if (isSearch && !navFocused) {
    // For search: scroll when focus enters result rows below the keyboard
    const isInResults = focus.rowIndex >= KEYBOARD_ROW_COUNT;
    if (isInResults) {
      const resultIdx = focus.rowIndex - KEYBOARD_ROW_COUNT;
      // Use same pattern as content pages: focused row near top, previous row peeking
      // The "previous row" for the first result is the keyboard
      const keyboardHeight = KEYBOARD_ROW_COUNT * (48 + 4) + 40;
      const searchBarHeight = 80;
      const headerPad = theme.spacing.headerHeight + 20;
      const resultsTop = headerPad + searchBarHeight + keyboardHeight;
      // Match content page pattern: focused row near top, previous content peeks above
      // For resultIdx 0: keyboard last rows peek above. For 1+: previous result row peeks.
      verticalOffset = resultsTop - (rowHeight * 1.5) + Math.max(0, resultIdx) * rowHeight;
      verticalOffset = Math.max(0, verticalOffset);
    }
  } else if (!isSearch && !isMyList && focus.rowIndex >= 0) {
    verticalOffset = Math.max(0, focus.rowIndex - 1) * rowHeight;
  }

  const shellStyle: CSSProperties = {
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    background: theme.colors.background,
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
  };

  const scrollContainerStyle: CSSProperties = {
    transform: `translateY(-${verticalOffset}px)`,
    transition: `transform ${theme.animation.rowScrollDuration}ms ease-out`,
    willChange: 'transform',
  };

  return (
    <div ref={shellRef} style={shellStyle} role="grid" aria-label="Content browser">
      <NavBar />
      {isSearch ? (
        <div style={scrollContainerStyle}>
          <SearchPage />
        </div>
      ) : isMyList ? (
        <MyListPage />
      ) : (
        <div style={scrollContainerStyle}>
          <HeroBanner />
          <div style={{ paddingTop: 20 }}>
            {rows.map((row, i) => (
              <ContentRow key={row.id} row={row} rowIndex={i} />
            ))}
          </div>
        </div>
      )}
      <DetailOverlay />
    </div>
  );
}
