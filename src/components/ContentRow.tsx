import { type CSSProperties, memo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../styles/theme';
import { ContentTile } from './ContentTile';
import { RowTitle } from './RowTitle';
import { selectFocus, selectHeroFocused, selectNavFocused, selectLastNavAction } from '../state/selectors';
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

  if (isRowFocused) {
    const currTile = focus.tileIndex;
    const isHorizontalMove = lastNavAction === 'LEFT' || lastNavAction === 'RIGHT';

    // Only scroll when the user explicitly presses Left/Right — never on vertical nav
    if (isHorizontalMove && currTile !== lastTileIndexRef.current) {
      scrollOffsetRef.current =
        Math.max(0, currTile - 1) *
        (theme.tile.width + theme.spacing.tileGap);
    }

    lastTileIndexRef.current = currTile;
  }

  const scrollOffset = scrollOffsetRef.current;

  const rowContainerStyle: CSSProperties = {
    marginBottom: theme.spacing.rowGap,
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
          {row.tiles.map((tile, tileIndex) => (
            <ContentTile
              key={tile.id}
              tile={tile}
              tileIndex={tileIndex}
              isFocused={isRowFocused && focus.tileIndex === tileIndex}
              isRowFocused={isRowFocused}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
