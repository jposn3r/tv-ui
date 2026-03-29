import { type CSSProperties, memo, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { theme } from '../styles/theme';
import { getTileImageUrl } from '../data/mockContent';
import { getTmdbBackdropUrl, getTmdbLogoUrl } from '../data/tmdb';
import { FocusRing } from './FocusRing';
import { YouTubePlayer } from './YouTubePlayer';
import { useTrailerPreview } from '../hooks/useTrailerPreview';
import { selectLastNavAction, selectTrailerMuted, selectTrailerPaused } from '../state/selectors';
import { setTileTrailerPlaying, setActiveTrailer } from '../state/slices/trailerSlice';
import type { TileData } from '../state/slices/contentSlice';
import type { NavigationAction } from '../engine/FocusEngine';
import { tileCounter } from '../utils/tileCounter';

// Check if an image URL is already in the browser cache
function isImageCached(src: string): boolean {
  const img = new Image();
  img.src = src;
  return img.complete && img.naturalWidth > 0;
}

/** Logo with fade-in on load — instant for cached images, no flash */
function TileLogo({ logoPath, logoOnRight, isFocused, fadeOut = false }: {
  logoPath: string;
  logoOnRight: boolean;
  isFocused: boolean;
  fadeOut?: boolean;
}) {
  const src = getTmdbLogoUrl(logoPath, 'w300');
  // If cached, start loaded immediately — no fade, no flash
  const cachedOnMount = useRef(isImageCached(src)).current;
  const [loaded, setLoaded] = useState(cachedOnMount);

  const style: CSSProperties = {
    position: 'absolute',
    bottom: 8,
    ...(logoOnRight ? { right: 8 } : { left: 8 }),
    maxWidth: '55%',
    maxHeight: '40%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))',
    opacity: fadeOut ? 0 : loaded ? (isFocused ? 1 : 0.8) : 0,
    transform: loaded ? 'scale(1)' : 'scale(0.92)',
    // Skip transition for cached images — appear instantly
    transition: cachedOnMount
      ? 'opacity 200ms ease-out'
      : `opacity ${theme.animation.trailerFadeMs}ms ease-out, transform 350ms ease-out`,
  };

  return (
    <img
      src={src}
      alt=""
      style={style}
      onLoad={() => setLoaded(true)}
    />
  );
}

function getTransformOrigin(action: NavigationAction | null): string {
  switch (action) {
    case 'LEFT': return 'right center';
    case 'RIGHT': return 'left center';
    case 'UP': return 'center bottom';
    case 'DOWN': return 'center top';
    default: return 'center center';
  }
}

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
  const dispatch = useDispatch();

  // Track mounted tile count for Performance HUD
  useEffect(() => {
    tileCounter.mount();
    return () => tileCounter.unmount();
  }, []);

  const logoOnRight = tileIndex % 2 === 1;
  const lastNavAction = useSelector(selectLastNavAction);
  const trailerMuted = useSelector(selectTrailerMuted);
  const trailerPaused = useSelector(selectTrailerPaused);
  const { showTrailer, trailerKey } = useTrailerPreview(tile, isFocused, trailerPaused);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Track the last nav action when this tile loses focus for directional shrink
  const shrinkOriginRef = useRef<string>('center center');
  const wasFocusedRef = useRef(isFocused);

  useEffect(() => {
    if (wasFocusedRef.current && !isFocused) {
      // Tile just lost focus — capture the nav direction for shrink
      shrinkOriginRef.current = getTransformOrigin(lastNavAction);
    }
    wasFocusedRef.current = isFocused;
  }, [isFocused, lastNavAction]);

  // Coordinate tile trailer state with Redux
  useEffect(() => {
    if (!showTrailer) {
      setVideoPlaying(false);
      dispatch(setTileTrailerPlaying(false));
      dispatch(setActiveTrailer(null));
    }
  }, [showTrailer, dispatch]);

  const isTrailerActive = showTrailer && !!trailerKey;

  // When trailer plays, expand to 16:9 to avoid cropping the video
  const trailerWidth = isTrailerActive ? theme.tile.width * 1.15 : theme.tile.width;
  const trailerHeight = isTrailerActive ? Math.round(trailerWidth * 9 / 16) : theme.tile.height;

  const containerStyle: CSSProperties = {
    width: theme.tile.width,
    height: theme.tile.height,
    flexShrink: 0,
    cursor: 'default',
    userSelect: 'none',
    overflow: 'visible',
  };

  const brightness = isFocused ? 1.1 : isRowFocused ? 0.7 : 0.45;
  const imgStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: theme.tile.borderRadius,
    display: 'block',
    filter: `brightness(${brightness})`,
    transition: `filter ${theme.animation.focusDuration}ms ease-out, opacity ${theme.animation.trailerFadeMs}ms ease-out`,
    // Fade out backdrop when video is confirmed playing — synchronized with video fade-in
    opacity: videoPlaying ? 0 : 1,
  };


  // Determine transform origin: use shrink direction when defocusing, center when focused
  const transformOrigin = isFocused ? 'center center' : shrinkOriginRef.current;

  return (
    <div
      style={containerStyle}
      role="gridcell"
      aria-selected={isFocused}
      aria-label={`${tile.title}, ${tile.year}, ${tile.rating}`}
    >
      <FocusRing
        isFocused={isFocused}
        scale={isTrailerActive ? theme.animation.trailerScale : undefined}
        transformOrigin={transformOrigin}
      >
        <div style={{
          position: 'relative',
          width: trailerWidth,
          height: trailerHeight,
          borderRadius: theme.tile.borderRadius,
          overflow: 'hidden',
          transition: `width ${theme.animation.trailerFadeMs}ms ease-out, height ${theme.animation.trailerFadeMs}ms ease-out`,
        }}>
          <img
            src={tile.backdropPath ? getTmdbBackdropUrl(tile.backdropPath) : getTileImageUrl(tile.imageIndex)}
            alt={tile.title}
            style={imgStyle}
            loading="lazy"
          />
          {/* YouTube trailer overlay */}
          {isTrailerActive && (
            <YouTubePlayer
              videoKey={trailerKey!}
              muted={trailerMuted}
              autoplay={true}
              onPlaying={() => {
                setVideoPlaying(true);
                dispatch(setTileTrailerPlaying(true));
                dispatch(setActiveTrailer('tile'));
              }}
              onEnded={() => setVideoPlaying(false)}
              onError={() => setVideoPlaying(false)}
              style={{
                borderRadius: theme.tile.borderRadius,
              }}
            />
          )}
          {/* Logo overlay — fade in on load, fade out with backdrop when video plays */}
          {tile.logoPath && (
            <TileLogo
              logoPath={tile.logoPath}
              logoOnRight={logoOnRight}
              isFocused={isFocused}
              fadeOut={videoPlaying}
            />
          )}
          {/* Mute hint — visible when trailer is playing */}
          {videoPlaying && (
            <div style={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              padding: '3px 7px',
              borderRadius: 3,
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 500,
              opacity: 0.7,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              {trailerMuted ? '🔇' : '🔊'} M
            </div>
          )}
        </div>
      </FocusRing>
    </div>
  );
});
