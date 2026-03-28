import { type CSSProperties, memo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../styles/theme';
import { ContentTile } from './ContentTile';
import { RowTitle } from './RowTitle';
import { selectFocus } from '../state/selectors';
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
  const isRowFocused = focus.rowIndex === rowIndex;
  const lastTileIndexRef = useRef(0);
  const scrollOffsetRef = useRef(0);

  if (isRowFocused) {
    const prevTile = lastTileIndexRef.current;
    const currTile = focus.tileIndex;

    // Only update scroll when the user moves Left/Right within this row
    if (currTile !== prevTile) {
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
      <div style={{ overflow: 'hidden' }}>
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
