import { type CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import { theme } from '../styles/theme';
import { selectRows, selectFocus } from '../state/selectors';
import { ContentRow } from './ContentRow';
import { HeroBanner } from './HeroBanner';
import { DetailOverlay } from './DetailOverlay';

export function Shell() {
  const rows = useSelector(selectRows);
  const focus = useSelector(selectFocus);

  // Vertical scroll: keep focused row near top
  const rowHeight = theme.tile.height + 40 + theme.spacing.rowGap; // tile + title + metadata + gap
  const verticalOffset = Math.max(0, focus.rowIndex - 1) * rowHeight;

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
    <div style={shellStyle} role="grid" aria-label="Content browser">
      <div style={scrollContainerStyle}>
        <HeroBanner />
        <div style={{ paddingTop: 20 }}>
          {rows.map((row, i) => (
            <ContentRow key={row.id} row={row} rowIndex={i} />
          ))}
        </div>
      </div>
      <DetailOverlay />
    </div>
  );
}
