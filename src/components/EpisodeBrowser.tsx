import { useState, useEffect, useRef } from 'react';
import { theme } from '../styles/theme';
import { fetchTvSeasons, fetchEpisodes, getTmdbStillUrl } from '../data/tmdb';
import type { SeasonSummary, Episode } from '../data/tmdb';
import type { CSSProperties } from 'react';

interface EpisodeBrowserProps {
  tvId: number;
  isTv: boolean;
  focusedSeason?: number;
  focusedEpisode?: number;
}

export function EpisodeBrowser({ tvId, isTv, focusedSeason = 0, focusedEpisode = -1 }: EpisodeBrowserProps) {
  const [seasons, setSeasons] = useState<SeasonSummary[]>([]);
  const [activeSeason, setActiveSeason] = useState(0);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const focusedEpisodeRef = useRef<HTMLDivElement>(null);
  const seasonTabsRef = useRef<HTMLDivElement>(null);

  // Fetch seasons on mount
  useEffect(() => {
    let cancelled = false;
    fetchTvSeasons(tvId).then((s) => {
      if (!cancelled && s.length > 0) {
        setSeasons(s);
        setActiveSeason(0);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [tvId]);

  // Sync focused season from TV navigation
  useEffect(() => {
    if (isTv && focusedSeason >= 0 && focusedSeason < seasons.length) {
      setActiveSeason(focusedSeason);
    }
  }, [isTv, focusedSeason, seasons.length]);

  // Fetch episodes when season changes
  useEffect(() => {
    if (seasons.length === 0) return;
    const season = seasons[activeSeason];
    if (!season) return;
    let cancelled = false;
    fetchEpisodes(tvId, season.seasonNumber).then((eps) => {
      if (!cancelled) setEpisodes(eps);
    });
    return () => { cancelled = true; };
  }, [tvId, activeSeason, seasons]);

  // Scroll the focused episode into view when navigating in TV mode
  useEffect(() => {
    if (!isTv) return;
    if (focusedEpisode >= 0 && focusedEpisodeRef.current) {
      focusedEpisodeRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    } else if (focusedEpisode === -1 && seasonTabsRef.current) {
      // Seasons zone — scroll the tab row into view
      seasonTabsRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [isTv, focusedEpisode, focusedSeason]);

  if (loading || seasons.length === 0) return null;

  const container: CSSProperties = {
    padding: isTv ? '16px 48px 32px' : '16px 32px 24px',
    fontFamily: theme.typography.fontFamily,
  };

  const seasonTabs: CSSProperties = {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
    overflowX: 'auto',
    scrollbarWidth: 'none',
  };

  return (
    <div style={container}>
      {/* Season tabs */}
      <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Episodes</div>
      <div ref={seasonTabsRef} style={seasonTabs as CSSProperties}>
        {seasons.map((s, i) => {
          const isActive = i === activeSeason;
          const isFocusedTab = isTv && focusedEpisode === -1 && i === focusedSeason;
          const tabStyle: CSSProperties = {
            padding: '6px 16px',
            borderRadius: 4,
            border: isFocusedTab ? '2px solid #fff' : 'none',
            background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
            fontSize: 13,
            fontWeight: isActive ? 600 : 400,
            cursor: isTv ? 'default' : 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            fontFamily: theme.typography.fontFamily,
          };
          return (
            <button key={s.seasonNumber} style={tabStyle} onClick={() => !isTv && setActiveSeason(i)}>
              {s.name}
            </button>
          );
        })}
      </div>

      {/* Episode list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {episodes.map((ep, i) => {
          const isFocusedEp = isTv && focusedEpisode === i;
          const epStyle: CSSProperties = {
            display: 'flex',
            gap: 16,
            padding: 12,
            borderRadius: 6,
            background: isFocusedEp ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
            border: isFocusedEp ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
            transition: 'background 150ms, border 150ms',
            cursor: isTv ? 'default' : 'pointer',
          };

          return (
            <div
              key={ep.episodeNumber}
              ref={isFocusedEp ? focusedEpisodeRef : null}
              style={epStyle}
            >
              {/* Episode thumbnail */}
              <div style={{
                width: isTv ? 180 : 140,
                height: isTv ? 100 : 80,
                borderRadius: 4,
                overflow: 'hidden',
                flexShrink: 0,
                background: '#333',
              }}>
                {ep.stillPath && (
                  <img
                    src={getTmdbStillUrl(ep.stillPath)}
                    alt={ep.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                )}
              </div>
              {/* Episode info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: theme.typography.fontFamily }}>
                    {ep.episodeNumber}. {ep.name}
                  </div>
                  {ep.runtime && (
                    <div style={{ color: theme.colors.textMuted, fontSize: 12, flexShrink: 0, marginLeft: 8, fontFamily: theme.typography.fontFamily }}>
                      {ep.runtime}m
                    </div>
                  )}
                </div>
                <div style={{
                  color: theme.colors.textSecondary,
                  fontSize: 12,
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  fontFamily: theme.typography.fontFamily,
                }}>
                  {ep.overview}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
