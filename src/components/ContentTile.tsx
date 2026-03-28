import { type CSSProperties, memo } from 'react';
import { theme } from '../styles/theme';
import { getTileImageUrl } from '../data/mockContent';
import { getTmdbBackdropUrl, getTmdbLogoUrl } from '../data/tmdb';
import { FocusRing } from './FocusRing';
import type { TileData } from '../state/slices/contentSlice';

interface ContentTileProps {
  tile: TileData;
  tileIndex: number;
  isFocused: boolean;
  isRowFocused: boolean;
}

export const ContentTile = memo(function ContentTile({
  tile,
  tileIndex,
  isFocused,
  isRowFocused,
}: ContentTileProps) {
  const logoOnRight = tileIndex % 2 === 1;
  const containerStyle: CSSProperties = {
    width: theme.tile.width,
    height: theme.tile.height,
    flexShrink: 0,
    cursor: 'default',
    userSelect: 'none',
  };

  const brightness = isFocused ? 1.1 : isRowFocused ? 0.7 : 0.45;
  const imgStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: theme.tile.borderRadius,
    display: 'block',
    filter: `brightness(${brightness})`,
    transition: `filter ${theme.animation.focusDuration}ms ease-out`,
  };

  const titleStyle: CSSProperties = {
    color: theme.colors.text,
    fontSize: theme.typography.tileTitle.fontSize,
    fontWeight: theme.typography.tileTitle.fontWeight,
    marginTop: 6,
    opacity: isRowFocused ? 1 : 0,
    transition: 'opacity 200ms ease-out',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: theme.tile.width,
  };

  const metaStyle: CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.tileMetadata.fontSize,
    fontWeight: theme.typography.tileMetadata.fontWeight,
    opacity: isFocused ? 1 : 0,
    transition: 'opacity 200ms ease-out',
  };

  return (
    <div
      style={containerStyle}
      role="gridcell"
      aria-selected={isFocused}
      aria-label={`${tile.title}, ${tile.year}, ${tile.rating}`}
    >
      <FocusRing isFocused={isFocused}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src={tile.backdropPath ? getTmdbBackdropUrl(tile.backdropPath) : getTileImageUrl(tile.imageIndex)}
            alt={tile.title}
            style={imgStyle}
            loading="lazy"
          />
          {tile.logoPath && (
            <img
              src={getTmdbLogoUrl(tile.logoPath, 'w300')}
              alt=""
              style={{
                position: 'absolute',
                bottom: 8,
                ...(logoOnRight ? { right: 8 } : { left: 8 }),
                maxWidth: '55%',
                maxHeight: '40%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))',
                opacity: isFocused ? 1 : 0.8,
                transition: `opacity ${theme.animation.focusDuration}ms ease-out`,
              }}
            />
          )}
        </div>
      </FocusRing>
      <div style={titleStyle}>{tile.title}</div>
      <div style={metaStyle}>
        {tile.year} &middot; {tile.rating} &middot; {tile.genre}
      </div>
    </div>
  );
});
