import { type CSSProperties, useRef, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../styles/theme';
import { selectRows, selectFocus, selectActivePage, selectNavFocused, selectSearchResults, selectHeroFocused } from '../state/selectors';
import { ContentRow } from './ContentRow';
import { HeroBanner } from './HeroBanner';
import { DetailOverlay } from './DetailOverlay';
import { NavBar } from './NavBar';
import { SearchPage } from './SearchPage';
import { MyListPage } from './MyListPage';
import { PerformanceHUD } from './PerformanceHUD';
import { KEYBOARD_GRID, KEYBOARD_COLS, ROW_BUFFER } from '../utils/constants';

const KEYBOARD_ROW_COUNT = Math.ceil(KEYBOARD_GRID.length / KEYBOARD_COLS);

export function Shell() {
  const rows = useSelector(selectRows);
  const focus = useSelector(selectFocus);
  const activePage = useSelector(selectActivePage);
  const navFocused = useSelector(selectNavFocused);
  const heroFocused = useSelector(selectHeroFocused);
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

  // --- Vertical virtualization: deferred unmount ---
  // Track the previous row window so rows stay mounted during scroll animation
  const prevRangeRef = useRef<{ start: number; end: number }>({ start: 0, end: ROW_BUFFER + 2 });
  const collapseTimerRef = useRef<number | null>(null);
  const [deferredRange, setDeferredRange] = useState<{ start: number; end: number } | null>(null);

  const scheduleCollapse = useCallback(() => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = window.setTimeout(() => {
      setDeferredRange(null);
    }, theme.animation.rowScrollDuration + 100); // wait for scroll animation + margin
  }, []);

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, []);

  // Track focus changes and defer old row range removal until after scroll animation
  const anchorRow = (!isSearch && !isMyList && (heroFocused || navFocused)) ? 0 : focus.rowIndex;
  useEffect(() => {
    if (isSearch || isMyList) return;
    const newStart = Math.max(0, anchorRow - ROW_BUFFER);
    const newEnd = Math.min(rows.length - 1, anchorRow + ROW_BUFFER + ((heroFocused || navFocused) ? 2 : 0));
    const prev = prevRangeRef.current;

    if (newStart !== prev.start || newEnd !== prev.end) {
      // Keep old range alive during scroll animation
      setDeferredRange(prev);
      prevRangeRef.current = { start: newStart, end: newEnd };
      scheduleCollapse();
    }
  }, [anchorRow, heroFocused, navFocused, rows.length, isSearch, isMyList, scheduleCollapse]);

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
  } else if (!isSearch && !isMyList && !heroFocused && focus.rowIndex >= 0) {
    // When scrolling into content rows, offset accounts for the hero banner
    // Row 0: scroll just enough to bring the first row into good view below the hero
    // Row 1+: standard offset with previous row peeking
    if (focus.rowIndex === 0) {
      verticalOffset = 0; // Hero still visible but shrinking via its own height calc
    } else {
      verticalOffset = Math.max(0, focus.rowIndex - 1) * rowHeight;
    }
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
          <div style={{ position: 'relative', height: rows.length * rowHeight, paddingTop: 20 }}>
            {(() => {
              // Vertical virtualization: render rows near focus
              // Keep previous range mounted during scroll animation to prevent pop-out
              const anchorRow = (heroFocused || navFocused) ? 0 : focus.rowIndex;
              const newStart = Math.max(0, anchorRow - ROW_BUFFER);
              const newEnd = Math.min(rows.length - 1, anchorRow + ROW_BUFFER + ((heroFocused || navFocused) ? 2 : 0));

              // Merge with deferred (previous) range to cover both old and new positions
              const startRow = deferredRange ? Math.min(newStart, deferredRange.start) : newStart;
              const endRow = deferredRange ? Math.max(newEnd, deferredRange.end) : newEnd;

              return rows.slice(startRow, endRow + 1).map((row, i) => {
                const idx = startRow + i;
                return (
                  <div
                    key={row.id}
                    style={{
                      position: 'absolute',
                      top: idx * rowHeight,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <ContentRow row={row} rowIndex={idx} />
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
      <DetailOverlay />
      <PerformanceHUD />
    </div>
  );
}
