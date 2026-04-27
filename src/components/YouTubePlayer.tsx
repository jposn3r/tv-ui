import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useYouTubeApi } from '../hooks/useYouTubeApi';

interface YouTubePlayerProps {
  videoKey: string;
  muted?: boolean;
  autoplay?: boolean;
  onReady?: () => void;
  onPlaying?: () => void;
  onEnded?: () => void;
  onError?: () => void;
  /** Additional styles for the outer container */
  style?: CSSProperties;
  /** Fade duration in ms — player is hidden until PLAYING, then fades in */
  fadeDuration?: number;
}

let playerIdCounter = 0;

export function YouTubePlayer({
  videoKey,
  muted = true,
  autoplay = true,
  onReady,
  onPlaying,
  onEnded,
  onError,
  style,
  fadeDuration = 500,
}: YouTubePlayerProps) {
  const { apiReady } = useYouTubeApi();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const idRef = useRef(`yt-player-${++playerIdCounter}`);
  const [isPlaying, setIsPlaying] = useState(false);

  // Store latest callbacks in refs to avoid recreating player
  const cbRef = useRef({ onReady, onPlaying, onEnded, onError });
  cbRef.current = { onReady, onPlaying, onEnded, onError };

  // Create player when API is ready
  useEffect(() => {
    if (!apiReady || !containerRef.current || !videoKey) return;

    setIsPlaying(false);

    // Create a div for the player inside our container
    const el = document.createElement('div');
    el.id = idRef.current;
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(el);

    const player = new YT.Player(el, {
      videoId: videoKey,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: autoplay ? 1 : 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3, // hide annotations
        modestbranding: 1,
        mute: muted ? 1 : 0,
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          cbRef.current.onReady?.();
        },
        onStateChange: (event: YT.PlayerEvent) => {
          if (event.data === YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            cbRef.current.onPlaying?.();
          } else if (event.data === YT.PlayerState.ENDED) {
            cbRef.current.onEnded?.();
          }
        },
        onError: () => {
          cbRef.current.onError?.();
        },
      },
    });

    playerRef.current = player;

    return () => {
      try {
        player.destroy();
      } catch {
        // Player may already be destroyed
      }
      playerRef.current = null;
    };
  }, [apiReady, videoKey, autoplay]); // muted handled separately below

  // Respond to muted prop changes without recreating player
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    try {
      if (muted) {
        player.mute();
      } else {
        player.unMute();
      }
    } catch {
      // Player not ready yet
    }
  }, [muted]);

  const wrapperStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    opacity: isPlaying ? 1 : 0,
    transition: `opacity ${fadeDuration}ms ease-out`,
    ...style,
  };

  const iframeContainerStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
  };

  // Mask the top of the player so the YouTube title bar (and any share / watch-later
  // icons that pop in on hover) is never visible. Gradient fades to transparent so
  // it doesn't visually chop the video — the dark portion just covers where the
  // title text would render.
  const topMaskStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '32%',
    background:
      'linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.45) 75%, transparent 100%)',
    pointerEvents: 'none',
    zIndex: 2,
  };
  // Smaller bottom mask in case YouTube's progress bar tries to render despite controls=0.
  const bottomMaskStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '14%',
    background:
      'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
    pointerEvents: 'none',
    zIndex: 2,
  };

  return (
    <div style={wrapperStyle}>
      <div ref={containerRef} style={iframeContainerStyle} />
      <div style={topMaskStyle} />
      <div style={bottomMaskStyle} />
    </div>
  );
}
