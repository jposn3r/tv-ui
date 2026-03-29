import { type CSSProperties, memo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../styles/theme';
import { ContentTile } from './ContentTile';
import { RowTitle } from './RowTitle';
import { selectFocus, selectHeroFocused, selectNavFocused, selectLastNavAction } from '../state/selectors';
import { TILE_BUFFER, VISIBLE_TILES, TILE_STEP } from '../utils/constants';
import type { RowData } from '../state/slices/contentSlice';

interface ContentRowProps {
  row: RowData;
  rowIndex: number;
}

export const ContentRow = memo(function ContentRow({
  row,
  rowIndex,
}: ContentRowProps) {
  const focus = useSelector(selectFocus);
  const heroFocused = useSelector(selectHeroFocused);
  const navFocused = useSelector(selectNavFocused);
  const lastNavAction = useSelector(selectLastNavAction);
  // Row is only truly focused when it has focus AND neither hero nor nav is focused
  const isRowFocused = focus.rowIndex === rowIndex && !heroFocused && !navFocused;
  const lastTileIndexRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const prevScrollOffsetRef = useRef(0);
  const scrollCollapseRef = useRef<number | null>(null);

  // Clean up collapse timer on unmount
  useEffect(() => {
    return () => {
      if (scrollCollapseRef.current) clearTimeout(scrollCollapseRef.current);
    };
  }, []);

  if (isRowFocused) {
    const currTile = focus.tileIndex;
    const isHorizontalMove = lastNavAction === 'LEFT' || lastNavAction === 'RIGHT';

    // Only scroll when the user explicitly presses Left/Right — never on vertical nav
    if (isHorizontalMove && currTile !== lastTileIndexRef.current) {
      prevScrollOffsetRef.current = scrollOffsetRef.current;
      scrollOffsetRef.current =
        Math.max(0, currTile - 1) *
        (theme.tile.width + theme.spacing.tileGap);
      // Collapse prev offset after scroll animation completes so the render window tightens
      scrollCollapseRef.current = window.setTimeout(() => {
        prevScrollOffsetRef.current = scrollOffsetRef.current;
      }, theme.animation.scrollDuration + 50);
    }

    lastTileIndexRef.current = currTile;
  }

  const scrollOffset = scrollOffsetRef.current;

  // Horizontal virtualization: render tiles covering both the previous and current
  // scroll positions so nothing pops in/out during the CSS transition animation.
  const tileCount = row.tiles.length;
  const minTilesForVirtualization = VISIBLE_TILES + TILE_BUFFER * 2 + 2;
  const shouldVirtualize = tileCount > minTilesForVirtualization;

  let startTile = 0;
  let endTile = tileCount - 1;

  if (shouldVirtualize) {
    // Cover the full range between previous and current scroll positions
    const minOffset = Math.min(prevScrollOffsetRef.current, scrollOffset);
    const maxOffset = Math.max(prevScrollOffsetRef.current, scrollOffset);

    startTile = Math.max(0, Math.floor(minOffset / TILE_STEP) - TILE_BUFFER);
    endTile = Math.min(
      tileCount - 1,
      Math.ceil((maxOffset + window.innerWidth) / TILE_STEP) + TILE_BUFFER
    );
    // Always include the focused tile if this row is focused
    if (isRowFocused) {
      startTile = Math.min(startTile, focus.tileIndex);
      endTile = Math.max(endTile, focus.tileIndex);
    }
  }

  const leftSpacer = startTile * TILE_STEP;

  const rowContainerStyle: CSSProperties = {
    // No marginBottom — vertical positioning handled by Shell's absolute layout
  };

  const tilesWrapperStyle: CSSProperties = {
    display: 'flex',
    gap: theme.spacing.tileGap,
    paddingLeft: theme.spacing.edgePadding,
    paddingRight: theme.spacing.edgePadding,
    transform: `translateX(-${scrollOffset}px)`,
    transition: `transform ${theme.animation.scrollDuration}ms ease-out`,
    willChange: 'transform',
  };

  const visibleTiles = row.tiles.slice(startTile, endTile + 1);

  return (
    <div style={rowContainerStyle} role="row" aria-label={row.title}>
      <RowTitle title={row.title} isRowFocused={isRowFocused} />
      <div style={{
        overflow: 'hidden',
        paddingTop: 40,
        paddingBottom: 40,
        marginTop: -40,
        marginBottom: -40,
      }}>
        <div style={tilesWrapperStyle}>
          {leftSpacer > 0 && <div style={{ width: leftSpacer, flexShrink: 0 }} />}
          {visibleTiles.map((tile, i) => {
            const tileIndex = startTile + i;
            return (
              <ContentTile
                key={tile.id}
                tile={tile}
                tileIndex={tileIndex}
                isFocused={isRowFocused && focus.tileIndex === tileIndex}
                isRowFocused={isRowFocused}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});
