import { type CSSProperties, memo } from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../styles/theme';
import { getHeroImageUrl } from '../data/mockContent';
import { getTmdbBackdropUrl, getTmdbLogoUrl } from '../data/tmdb';
import { selectFocus, selectRows } from '../state/selectors';

export const HeroBanner = memo(function HeroBanner() {
  const focus = useSelector(selectFocus);
  const rows = useSelector(selectRows);
  const firstTile = rows[0]?.tiles[0];

  // Parallax: shrink and fade as user scrolls down rows
  const scrollRatio = Math.min(focus.rowIndex / 3, 1);
  const bannerHeight = 400 - scrollRatio * 200;
  const bannerOpacity = 1 - scrollRatio * 0.7;

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: bannerHeight,
    overflow: 'hidden',
    transition: 'height 400ms ease-out, opacity 400ms ease-out',
    opacity: bannerOpacity,
    flexShrink: 0,
  };

  const imgStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  const gradientOverlayStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: theme.colors.gradientBottom,
    pointerEvents: 'none',
  };

  const leftGradientStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '50%',
    background: theme.colors.gradientLeft,
    pointerEvents: 'none',
  };

  const textContainerStyle: CSSProperties = {
    position: 'absolute',
    bottom: 40,
    left: theme.spacing.edgePadding,
    maxWidth: 500,
  };

  const titleStyle: CSSProperties = {
    color: theme.colors.text,
    fontSize: theme.typography.heroTitle.fontSize,
    fontWeight: theme.typography.heroTitle.fontWeight,
    marginBottom: 12,
    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
  };

  const synopsisStyle: CSSProperties = {
    color: theme.colors.text,
    fontSize: theme.typography.heroSynopsis.fontSize,
    fontWeight: theme.typography.heroSynopsis.fontWeight,
    lineHeight: theme.typography.heroSynopsis.lineHeight,
    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
    opacity: 0.9,
  };

  if (!firstTile) return null;

  return (
    <div style={containerStyle}>
      <img src={firstTile.backdropPath ? getTmdbBackdropUrl(firstTile.backdropPath, 'w1280') : getHeroImageUrl()} alt="Featured content" style={imgStyle} />
      <div style={leftGradientStyle} />
      <div style={gradientOverlayStyle} />
      <div style={textContainerStyle}>
        {firstTile.logoPath ? (
          <img
            src={getTmdbLogoUrl(firstTile.logoPath)}
            alt={firstTile.title}
            style={{
              maxWidth: 350,
              maxHeight: 120,
              marginBottom: 16,
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
              display: 'block',
            }}
          />
        ) : (
          <div style={titleStyle}>{firstTile.title}</div>
        )}
        <div style={synopsisStyle}>{firstTile.synopsis}</div>
      </div>
    </div>
  );
});
