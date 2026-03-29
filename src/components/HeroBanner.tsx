import { type CSSProperties, memo, useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { theme } from '../styles/theme';
import { getHeroImageUrl } from '../data/mockContent';
import { getTmdbBackdropUrl, getTmdbLogoUrl, fetchTrailerKey } from '../data/tmdb';
import {
  selectFocus, selectRows, selectTrailerMuted, selectTrailerPaused,
  selectHeroFocused, selectHeroButtonIndex, selectTileTrailerPlaying, selectNavFocused,
} from '../state/selectors';
import { setActiveTrailer } from '../state/slices/trailerSlice';
import { YouTubePlayer } from './YouTubePlayer';

const HERO_BUTTONS = ['▶  Play', '+ Add to List'];

export const HeroBanner = memo(function HeroBanner() {
  const dispatch = useDispatch();
  const focus = useSelector(selectFocus);
  const rows = useSelector(selectRows);
  const trailerMuted = useSelector(selectTrailerMuted);
  const trailerPaused = useSelector(selectTrailerPaused);
  const heroFocused = useSelector(selectHeroFocused);
  const heroButtonIndex = useSelector(selectHeroButtonIndex);
  const tileTrailerPlaying = useSelector(selectTileTrailerPlaying);
  const navFocused = useSelector(selectNavFocused);
  const firstTile = rows[0]?.tiles[0];

  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const delayTimerRef = useRef<number | null>(null);
  const tileIdRef = useRef<string | null>(null);

  // Should the hero trailer be active?
  // Only when hero is focused AND no tile trailer is playing AND not paused
  const shouldPlayTrailer = heroFocused && !tileTrailerPlaying && !trailerPaused;

  // Fetch trailer key when hero becomes focused (with delay)
  useEffect(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }

    if (!shouldPlayTrailer) {
      // Stop playing — fade back to static
      setShowVideo(false);
      setVideoPlaying(false);
      dispatch(setActiveTrailer(null));
      return;
    }

    if (!firstTile?.tmdbId || !firstTile?.mediaType) return;

    const currentTileId = firstTile.id;
    tileIdRef.current = currentTileId;

    delayTimerRef.current = window.setTimeout(async () => {
      const key = await fetchTrailerKey(firstTile.tmdbId!, firstTile.mediaType!);
      if (tileIdRef.current === currentTileId && key) {
        setTrailerKey(key);
        setShowVideo(true);
      }
    }, theme.animation.trailerDwellMs);

    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    };
  }, [shouldPlayTrailer, firstTile?.id, firstTile?.tmdbId, firstTile?.mediaType, dispatch]);

  // Reset trailer key when tile changes
  useEffect(() => {
    setTrailerKey(null);
    setVideoPlaying(false);
    setShowVideo(false);
  }, [firstTile?.id]);

  const handlePlaying = useCallback(() => {
    setVideoPlaying(true);
    dispatch(setActiveTrailer('hero'));
  }, [dispatch]);

  const handleError = useCallback(() => {
    setShowVideo(false);
    setVideoPlaying(false);
  }, []);

  // Hide player when video ends so YouTube replay UI never shows
  const handleEnded = useCallback(() => {
    setShowVideo(false);
    setVideoPlaying(false);
    dispatch(setActiveTrailer(null));
  }, [dispatch]);

  // Parallax: full height when heroFocused or navFocused, shrink only when in content rows
  const scrollRatio = (heroFocused || navFocused) ? 0 : Math.min((focus.rowIndex + 1) / 3, 1);
  const fullHeight = 56; // vh units
  const minHeight = 22; // vh units
  const bannerHeightVh = fullHeight - scrollRatio * (fullHeight - minHeight);
  const bannerOpacity = 1 - scrollRatio * 0.6;

  // Hide video when banner is shrinking
  const videoVisible = showVideo && trailerKey && scrollRatio < 0.2;

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: `${bannerHeightVh}vh`,
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
    transition: `opacity ${theme.animation.trailerFadeMs}ms ease-out`,
    opacity: videoPlaying && videoVisible ? 0 : 1,
  };

  const gradientOverlayStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: theme.colors.gradientBottom,
    pointerEvents: 'none',
    zIndex: 2,
  };

  const leftGradientStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '50%',
    background: theme.colors.gradientLeft,
    pointerEvents: 'none',
    zIndex: 2,
  };

  // Dim text/buttons when trailer is actively playing so the video is more visible
  const trailerIsLive = videoPlaying && videoVisible;

  const textContainerStyle: CSSProperties = {
    position: 'absolute',
    bottom: 60,
    left: theme.spacing.edgePadding,
    maxWidth: 500,
    zIndex: 3,
    opacity: trailerIsLive ? 0.5 : 1,
    transition: `opacity ${theme.animation.trailerFadeMs}ms ease-out`,
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
    marginBottom: 20,
  };

  const buttonsRowStyle: CSSProperties = {
    display: 'flex',
    gap: 12,
    opacity: heroFocused ? 1 : 0,
    transition: 'opacity 300ms ease-out',
  };

  const muteIndicatorStyle: CSSProperties = {
    position: 'absolute',
    bottom: 16,
    right: 24,
    zIndex: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 4,
    background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: 500,
    opacity: videoVisible && videoPlaying ? 0.8 : 0,
    transition: 'opacity 300ms ease-out',
    pointerEvents: 'none',
  };

  if (!firstTile) return null;

  return (
    <div style={containerStyle}>
      {/* Static backdrop */}
      <img
        src={firstTile.backdropPath ? getTmdbBackdropUrl(firstTile.backdropPath, 'w1280') : getHeroImageUrl()}
        alt="Featured content"
        style={imgStyle}
      />

      {/* YouTube trailer layer */}
      {videoVisible && (
        <YouTubePlayer
          videoKey={trailerKey!}
          muted={trailerMuted}
          autoplay={true}
          onPlaying={handlePlaying}
          onEnded={handleEnded}
          onError={handleError}
          style={{
            zIndex: 1,
            opacity: videoPlaying ? 1 : 0,
            transition: `opacity ${theme.animation.trailerFadeMs}ms ease-out`,
          }}
        />
      )}

      {/* Gradients on top of video */}
      <div style={leftGradientStyle} />
      <div style={gradientOverlayStyle} />

      {/* Text/logo content */}
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

        {/* Hero buttons — Play & Add to List */}
        <div style={buttonsRowStyle}>
          {HERO_BUTTONS.map((label, i) => {
            const isBtnFocused = heroFocused && i === heroButtonIndex;
            const btnStyle: CSSProperties = {
              padding: '12px 28px',
              borderRadius: 4,
              border: 'none',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'default',
              color: isBtnFocused ? '#000' : theme.colors.text,
              background: isBtnFocused ? '#fff' : 'rgba(255,255,255,0.2)',
              transform: isBtnFocused ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 150ms ease-out',
              letterSpacing: 0.5,
            };
            return (
              <button key={label} style={btnStyle} tabIndex={-1}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mute indicator */}
      <div style={muteIndicatorStyle}>
        {trailerMuted ? '🔇' : '🔊'} Press M
      </div>
    </div>
  );
});
