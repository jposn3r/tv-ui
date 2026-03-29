import { memo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../styles/theme';
import { rowStyles } from '../styles/componentStyles/rowStyles';
import { ContentTile } from './ContentTile';
import { RowTitle } from './RowTitle';
import { selectFocus, selectHeroFocused, selectNavFocused, selectLastNavAction } from '../state/selectors';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { easeOutQuart } from '../engine/easing';
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
  const isRowFocused = focus.rowIndex === rowIndex && !heroFocused && !navFocused;

  // ScrollEngine-driven horizontal scroll
  const scroll = useScrollAnimation(`row-${rowIndex}-scroll`, 0);
  const lastTileIndexRef = useRef(0);
  const targetOffsetRef = useRef(0);
  // Track the previous scroll target for virtualization window
  const prevTargetRef = useRef(0);

  if (isRowFocused) {
    const currTile = focus.tileIndex;
    const isHorizontalMove = lastNavAction === 'LEFT' || lastNavAction === 'RIGHT';

    if (isHorizontalMove && currTile !== lastTileIndexRef.current) {
      prevTargetRef.current = targetOffsetRef.current;
      const newTarget = Math.max(0, currTile - 1) * (theme.tile.width + theme.spacing.tileGap);
      targetOffsetRef.current = newTarget;

      scroll.animate(newTarget, 350, easeOutQuart, () => {
        // Collapse prev target after animation completes
        prevTargetRef.current = targetOffsetRef.current;
      });
    }

    lastTileIndexRef.current = currTile;
  }

  const scrollOffset = scroll.value;

  // Horizontal virtualization: cover both previous and current scroll targets
  const tileCount = row.tiles.length;
  const minTilesForVirtualization = VISIBLE_TILES + TILE_BUFFER * 2 + 2;
  const shouldVirtualize = tileCount > minTilesForVirtualization;

  let startTile = 0;
  let endTile = tileCount - 1;

  if (shouldVirtualize) {
    const minOffset = Math.min(prevTargetRef.current, targetOffsetRef.current);
    const maxOffset = Math.max(prevTargetRef.current, targetOffsetRef.current);

    startTile = Math.max(0, Math.floor(minOffset / TILE_STEP) - TILE_BUFFER);
    endTile = Math.min(
      tileCount - 1,
      Math.ceil((maxOffset + window.innerWidth) / TILE_STEP) + TILE_BUFFER
    );
    if (isRowFocused) {
      startTile = Math.min(startTile, focus.tileIndex);
      endTile = Math.max(endTile, focus.tileIndex);
    }
  }

  const leftSpacer = startTile * TILE_STEP;

  const visibleTiles = row.tiles.slice(startTile, endTile + 1);

  return (
    <div style={rowStyles.container} role="row" aria-label={row.title}>
      <RowTitle title={row.title} isRowFocused={isRowFocused} />
      <div style={rowStyles.overflowWrapper}>
        <div style={rowStyles.tilesWrapper(scrollOffset)}>
          {leftSpacer > 0 && <div style={rowStyles.leftSpacer(leftSpacer)} />}
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
