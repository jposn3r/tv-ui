import { memo, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectDetailOverlay, selectWatchlist, selectTrailerMuted, selectCurrentProfileId } from '../state/selectors';
import { closeDetail } from '../state/slices/uiSlice';
import { toggleWatchlist } from '../state/slices/watchlistSlice';
import { setTrailerPaused } from '../state/slices/trailerSlice';
import { getTileImageUrl } from '../data/mockContent';
import { getTmdbBackdropUrl, getTmdbLogoUrl } from '../data/tmdb';
import { fetchTrailerKey, fetchTvSeasons, fetchEpisodes } from '../data/tmdb';
import { overlayStyles } from '../styles/componentStyles/overlayStyles';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { easeOut } from '../engine/easing';
import { mergeStyles } from '../styles/styleEngine';
import { YouTubePlayer } from './YouTubePlayer';
import { EpisodeBrowser } from './EpisodeBrowser';
import { useIsTvMode, useIsWebMode } from '../hooks/useMode';
import { useSettings } from '../hooks/useSettings';
import { theme } from '../styles/theme';
import type { CSSProperties } from 'react';

export const DetailOverlay = memo(function DetailOverlay() {
  const dispatch = useDispatch();
  const { open, tile, buttonIndex, zone, seasonIndex, episodeIndex } = useSelector(selectDetailOverlay);
  const watchlist = useSelector(selectWatchlist);
  const trailerMuted = useSelector(selectTrailerMuted);
  const currentProfileId = useSelector(selectCurrentProfileId);
  const settings = useSettings();
  const isTv = useIsTvMode();
  const isWeb = useIsWebMode();
  const inList = !!tile && watchlist.some((t) => t.id === tile.id);
  const BUTTONS = settings.disableMyList
    ? ['Play', 'Like']
    : ['Play', inList ? 'Remove from List' : 'Add to List', 'Like'];

  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [, setVideoPlaying] = useState(false);

  useEffect(() => {
    if (!open || !tile?.tmdbId || !tile?.mediaType || settings.disableAutoplay) {
      setTrailerKey(null);
      setVideoPlaying(false);
      return;
    }
    let cancelled = false;
    fetchTrailerKey(tile.tmdbId, tile.mediaType).then((key) => {
      if (!cancelled) setTrailerKey(key);
    });
    return () => { cancelled = true; };
  }, [open, tile?.tmdbId, tile?.mediaType, settings.disableAutoplay]);

  // Pre-warm season + first season's episode caches when opening a TV show overlay,
  // so the input navigation handler can synchronously read counts and switch zones.
  useEffect(() => {
    if (!open || !tile?.tmdbId || tile.mediaType !== 'tv') return;
    let cancelled = false;
    const tvId = tile.tmdbId;
    fetchTvSeasons(tvId).then((seasons) => {
      if (cancelled || seasons.length === 0) return;
      // Also pre-fetch the first season's episodes
      fetchEpisodes(tvId, seasons[0].seasonNumber);
    });
    return () => { cancelled = true; };
  }, [open, tile?.tmdbId, tile?.mediaType]);

  const slideAnim = useScrollAnimation('detail-slide', 100);

  useEffect(() => {
    if (open) {
      slideAnim.animate(0, 300, easeOut);
    }
  }, [open, slideAnim]);

  const handleClose = useCallback(() => {
    dispatch(closeDetail());
    dispatch(setTrailerPaused(false));
  }, [dispatch]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (isWeb && e.target === e.currentTarget) {
      handleClose();
    }
  }, [isWeb, handleClose]);

  const handleButtonClick = useCallback((label: string) => {
    if (!isWeb || !tile || !currentProfileId) return;
    if (label === 'Add to List' || label === 'Remove from List') {
      dispatch(toggleWatchlist({ profileId: currentProfileId, tile }));
    }
  }, [dispatch, isWeb, tile, currentProfileId]);

  // Web mode: close on Escape
  useEffect(() => {
    if (!isWeb || !open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isWeb, open, handleClose]);

  if (!open || !tile) return null;

  const backdropSrc = tile.backdropPath
    ? getTmdbBackdropUrl(tile.backdropPath, 'w1280')
    : getTileImageUrl(tile.imageIndex);
  const logoSrc = tile.logoPath ? getTmdbLogoUrl(tile.logoPath, 'w500') : null;
  const match = 75 + (parseInt(tile.id.replace(/\D/g, '') || '0', 10) % 24);
  const genres = tile.genre.split(/,\s*/);
  const isTvShow = tile.mediaType === 'tv';

  // --- TV MODE: Full-screen takeover ---
  if (isTv) {
    const fullscreen: CSSProperties = {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: theme.colors.background,
      overflowY: 'auto',
      overflowX: 'hidden',
    };

    const heroSection: CSSProperties = {
      position: 'relative',
      width: '100%',
      height: '50vh',
      overflow: 'hidden',
    };

    const gradient: CSSProperties = {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '70%',
      background: `linear-gradient(180deg, transparent 0%, ${theme.colors.background} 100%)`,
      pointerEvents: 'none',
    };

    const gradientLeft: CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '50%',
      background: theme.colors.gradientLeft,
      pointerEvents: 'none',
      zIndex: 1,
    };

    const infoContainer: CSSProperties = {
      position: 'absolute',
      bottom: 40,
      left: 48,
      maxWidth: 500,
      zIndex: 2,
    };

    return (
      <div style={fullscreen} role="dialog" aria-label={`Details for ${tile.title}`}>
        {/* Hero with trailer */}
        <div style={heroSection}>
          <img src={backdropSrc} alt={tile.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {trailerKey && (
            <YouTubePlayer
              videoKey={trailerKey}
              muted={trailerMuted}
              autoplay={true}
              onPlaying={() => setVideoPlaying(true)}
              onEnded={() => setVideoPlaying(false)}
              onError={() => setVideoPlaying(false)}
              fadeDuration={600}
            />
          )}
          <div style={gradientLeft} />
          <div style={gradient} />
          <div style={infoContainer}>
            {logoSrc ? (
              <img src={logoSrc} alt={tile.title} style={{ maxWidth: 300, maxHeight: 100, marginBottom: 16, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.7))' }} />
            ) : (
              <div style={{ color: '#fff', fontSize: 36, fontWeight: 700, marginBottom: 16, textShadow: '0 2px 8px rgba(0,0,0,0.7)', fontFamily: theme.typography.fontFamily }}>{tile.title}</div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, marginBottom: 12, fontFamily: theme.typography.fontFamily }}>
              <span style={{ color: '#46d369', fontWeight: 600 }}>{match}% Match</span>
              <span style={{ color: theme.colors.textSecondary }}>{tile.year}</span>
              <span style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '1px 6px', fontSize: 12, color: theme.colors.textSecondary, borderRadius: 3 }}>{tile.rating}</span>
            </div>
            <div style={{ color: '#fff', fontSize: 14, lineHeight: 1.5, opacity: 0.9, marginBottom: 20, fontFamily: theme.typography.fontFamily }}>
              {tile.synopsis}
            </div>
            {/* Action buttons — only highlight when the buttons zone has focus */}
            <div style={{ display: 'flex', gap: 12 }}>
              {BUTTONS.map((label, i) => (
                <button
                  key={label}
                  style={overlayStyles.button(zone === 'buttons' && i === buttonIndex)}
                  tabIndex={-1}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Genre tags */}
        <div style={{ padding: '16px 48px 8px', fontFamily: theme.typography.fontFamily }}>
          <span style={{ color: theme.colors.textMuted, fontSize: 13 }}>Genres: </span>
          <span style={{ color: theme.colors.textSecondary, fontSize: 13 }}>
            {genres.join(' \u2022 ')}
          </span>
        </div>

        {/* Episode browser for TV shows. Focus state comes from Redux when the user
            navigates with arrow keys — seasons zone tracks seasonIndex with episode = -1,
            episodes zone tracks episodeIndex with the active season selected. */}
        {isTvShow && tile.tmdbId && (
          <EpisodeBrowser
            tvId={tile.tmdbId}
            isTv={true}
            focusedSeason={seasonIndex}
            focusedEpisode={zone === 'episodes' ? episodeIndex : -1}
          />
        )}
      </div>
    );
  }

  // --- WEB MODE: Centered modal ---
  const panelAnimStyle = {
    transform: `translateY(${slideAnim.value}%)`,
  };

  return (
    <div
      style={overlayStyles.backdrop}
      role="dialog"
      aria-label={`Details for ${tile.title}`}
      onClick={handleBackdropClick}
    >
      <div style={mergeStyles(overlayStyles.panel, panelAnimStyle)}>
        {/* Close button */}
        <button style={overlayStyles.closeButton} onClick={handleClose} aria-label="Close">
          {'\u2715'}
        </button>

        {/* Hero section */}
        <div style={overlayStyles.heroSection}>
          <img src={backdropSrc} alt={tile.title} style={overlayStyles.heroImage} />
          {trailerKey && (
            <YouTubePlayer
              videoKey={trailerKey}
              muted={trailerMuted}
              autoplay={true}
              onPlaying={() => setVideoPlaying(true)}
              onEnded={() => setVideoPlaying(false)}
              onError={() => setVideoPlaying(false)}
              fadeDuration={600}
            />
          )}
          <div style={overlayStyles.heroGradient} />
          <div style={overlayStyles.heroOverlay}>
            {logoSrc ? (
              <img src={logoSrc} alt={tile.title} style={overlayStyles.heroLogo} />
            ) : (
              <div style={overlayStyles.heroTitle}>{tile.title}</div>
            )}
          </div>
        </div>

        {/* Info section */}
        <div style={overlayStyles.infoSection}>
          <div style={overlayStyles.infoLeft}>
            <div style={overlayStyles.metaRow}>
              <span style={overlayStyles.matchBadge}>{match}% Match</span>
              <span style={overlayStyles.yearText}>{tile.year}</span>
              <span style={overlayStyles.ratingBadge}>{tile.rating}</span>
            </div>
            <div style={overlayStyles.synopsis}>{tile.synopsis}</div>
          </div>
          <div style={overlayStyles.infoRight}>
            <div style={overlayStyles.genreLabel}>Genres:</div>
            <div style={overlayStyles.genreList}>
              {genres.map((g, i) => (
                <span key={g}>
                  {i > 0 && <span style={overlayStyles.genreDot}>{' \u2022 '}</span>}
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={overlayStyles.buttonsRow}>
          {BUTTONS.map((label) => (
            <button
              key={label}
              style={overlayStyles.button(false, true)}
              tabIndex={0}
              onClick={() => handleButtonClick(label)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Episode browser for TV shows (web mode) */}
        {isTvShow && tile.tmdbId && (
          <EpisodeBrowser tvId={tile.tmdbId} isTv={false} />
        )}
      </div>
    </div>
  );
});
