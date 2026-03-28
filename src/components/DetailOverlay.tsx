import { type CSSProperties, memo } from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../styles/theme';
import { selectDetailOverlay } from '../state/selectors';
import { getTileImageUrl } from '../data/mockContent';
import { getTmdbBackdropUrl } from '../data/tmdb';

const BUTTONS = ['Play', 'Add to List', 'Like'];

export const DetailOverlay = memo(function DetailOverlay() {
  const { open, tile, buttonIndex } = useSelector(selectDetailOverlay);

  if (!open || !tile) return null;

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: theme.colors.overlayBg,
    zIndex: 100,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  };

  const panelStyle: CSSProperties = {
    width: '100%',
    maxWidth: 900,
    background: theme.colors.surface,
    borderRadius: '12px 12px 0 0',
    padding: 40,
    display: 'flex',
    gap: 32,
    animation: 'slideUp 300ms ease-out',
  };

  const posterStyle: CSSProperties = {
    width: 200,
    height: 300,
    borderRadius: 8,
    objectFit: 'cover',
    flexShrink: 0,
  };

  const infoStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  };

  const titleStyle: CSSProperties = {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: 700,
  };

  const metaStyle: CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: 14,
  };

  const synopsisStyle: CSSProperties = {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 1.5,
    opacity: 0.85,
  };

  const buttonsRowStyle: CSSProperties = {
    display: 'flex',
    gap: 12,
    marginTop: 16,
  };

  return (
    <div style={backdropStyle} role="dialog" aria-label={`Details for ${tile.title}`}>
      <div style={panelStyle}>
        <img
          src={tile.backdropPath ? getTmdbBackdropUrl(tile.backdropPath) : getTileImageUrl(tile.imageIndex)}
          alt={tile.title}
          style={posterStyle}
        />
        <div style={infoStyle}>
          <div style={titleStyle}>{tile.title}</div>
          <div style={metaStyle}>
            {tile.year} &middot; {tile.rating} &middot; {tile.genre}
          </div>
          <div style={synopsisStyle}>{tile.synopsis}</div>
          <div style={buttonsRowStyle}>
            {BUTTONS.map((label, i) => {
              const isBtnFocused = i === buttonIndex;
              const btnStyle: CSSProperties = {
                padding: '10px 24px',
                borderRadius: 4,
                border: 'none',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'default',
                color: isBtnFocused ? '#000' : theme.colors.text,
                background: isBtnFocused ? '#fff' : 'rgba(255,255,255,0.15)',
                transform: isBtnFocused ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 150ms ease-out',
              };
              return (
                <button key={label} style={btnStyle} tabIndex={-1}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
