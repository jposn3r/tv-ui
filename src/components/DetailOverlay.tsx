import { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectDetailOverlay } from '../state/selectors';
import { getTileImageUrl } from '../data/mockContent';
import { getTmdbBackdropUrl } from '../data/tmdb';
import { overlayStyles } from '../styles/componentStyles/overlayStyles';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { easeOut } from '../engine/easing';
import { mergeStyles } from '../styles/styleEngine';

const BUTTONS = ['Play', 'Add to List', 'Like'];

export const DetailOverlay = memo(function DetailOverlay() {
  const { open, tile, buttonIndex } = useSelector(selectDetailOverlay);

  // Slide-up animation driven by ScrollEngine
  const slideAnim = useScrollAnimation('detail-slide', 100);

  useEffect(() => {
    if (open) {
      slideAnim.animate(0, 300, easeOut);
    }
  }, [open, slideAnim]);

  if (!open || !tile) return null;

  const panelAnimStyle = {
    transform: `translateY(${slideAnim.value}%)`,
  };

  return (
    <div style={overlayStyles.backdrop} role="dialog" aria-label={`Details for ${tile.title}`}>
      <div style={mergeStyles(overlayStyles.panel, panelAnimStyle)}>
        <img
          src={tile.backdropPath ? getTmdbBackdropUrl(tile.backdropPath) : getTileImageUrl(tile.imageIndex)}
          alt={tile.title}
          style={overlayStyles.poster}
        />
        <div style={overlayStyles.info}>
          <div style={overlayStyles.title}>{tile.title}</div>
          <div style={overlayStyles.meta}>
            {tile.year} &middot; {tile.rating} &middot; {tile.genre}
          </div>
          <div style={overlayStyles.synopsis}>{tile.synopsis}</div>
          <div style={overlayStyles.buttonsRow}>
            {BUTTONS.map((label, i) => (
              <button key={label} style={overlayStyles.button(i === buttonIndex)} tabIndex={-1}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
