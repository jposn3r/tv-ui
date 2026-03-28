import type { RowData, TileData } from '../state/slices/contentSlice';

const TOKEN = import.meta.env.VITE_TMDB_TOKEN as string;
const IMG_BASE = 'https://image.tmdb.org/t/p';

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

interface TmdbResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
  media_type?: string;
}

interface TmdbResponse {
  results: TmdbResult[];
}

const GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News',
  10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap',
  10767: 'Talk', 10768: 'War & Politics',
};

function toTile(item: TmdbResult): TileData | null {
  if (!item.backdrop_path) return null;
  const year = parseInt(
    (item.release_date || item.first_air_date || '0000').slice(0, 4),
    10
  );
  const genre = GENRE_MAP[item.genre_ids[0]] ?? 'Drama';
  const rating = item.vote_average >= 8 ? 'TV-MA' :
                 item.vote_average >= 6 ? 'TV-14' : 'TV-PG';

  return {
    id: `tmdb-${item.id}`,
    title: item.title || item.name || 'Untitled',
    year: year || 2024,
    rating,
    genre,
    synopsis: item.overview || 'No description available.',
    imageIndex: item.id,
    backdropPath: item.backdrop_path,
    tmdbId: item.id,
    mediaType: (item.media_type === 'tv' || item.first_air_date) ? 'tv' as const : 'movie' as const,
  };
}

async function fetchTmdb(url: string): Promise<TmdbResult[]> {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  const data: TmdbResponse = await res.json();
  return data.results;
}

interface RowConfig {
  title: string;
  url: string;
}

const ROW_CONFIGS: RowConfig[] = [
  { title: 'Trending Now', url: 'https://api.themoviedb.org/3/trending/all/week' },
  { title: 'Popular Movies', url: 'https://api.themoviedb.org/3/movie/popular' },
  { title: 'Top Rated', url: 'https://api.themoviedb.org/3/movie/top_rated' },
  { title: 'Now Playing', url: 'https://api.themoviedb.org/3/movie/now_playing' },
  { title: 'Popular TV Shows', url: 'https://api.themoviedb.org/3/tv/popular' },
  { title: 'Top Rated TV', url: 'https://api.themoviedb.org/3/tv/top_rated' },
  { title: 'Upcoming', url: 'https://api.themoviedb.org/3/movie/upcoming' },
  { title: 'Action Movies', url: 'https://api.themoviedb.org/3/discover/movie?with_genres=28&sort_by=popularity.desc' },
  { title: 'Sci-Fi', url: 'https://api.themoviedb.org/3/discover/movie?with_genres=878&sort_by=popularity.desc' },
  { title: 'Comedies', url: 'https://api.themoviedb.org/3/discover/movie?with_genres=35&sort_by=popularity.desc' },
  { title: 'Thrillers', url: 'https://api.themoviedb.org/3/discover/movie?with_genres=53&sort_by=popularity.desc' },
  { title: 'Documentaries', url: 'https://api.themoviedb.org/3/discover/movie?with_genres=99&sort_by=popularity.desc' },
];

/**
 * Fetch rows with backdrops (fast — 12 parallel calls).
 * Returns content immediately so the UI can render.
 */
export async function fetchTmdbContent(): Promise<RowData[]> {
  const results = await Promise.all(
    ROW_CONFIGS.map(async (config, idx) => {
      try {
        const items = await fetchTmdb(config.url);
        const tiles = items
          .map(toTile)
          .filter((t): t is TileData => t !== null);
        return {
          id: `row-${idx}`,
          title: config.title,
          tiles,
        };
      } catch {
        return null;
      }
    })
  );
  return results.filter((r): r is RowData => r !== null && r.tiles.length > 0);
}

/**
 * Stream logos into rows progressively.
 * Calls onUpdate each time a batch of logos resolves so the UI can re-render.
 */
export async function fetchLogosProgressive(
  rows: RowData[],
  onUpdate: (updatedRows: RowData[]) => void
): Promise<void> {
  const BATCH_SIZE = 16; // concurrent fetches at a time

  // Collect all tiles that need logos
  const tasks: Array<{ rowIdx: number; tileIdx: number; tmdbId: number; mediaType: 'movie' | 'tv' }> = [];
  for (let r = 0; r < rows.length; r++) {
    for (let t = 0; t < rows[r].tiles.length; t++) {
      const tile = rows[r].tiles[t];
      if (tile.tmdbId && tile.mediaType) {
        tasks.push({ rowIdx: r, tileIdx: t, tmdbId: tile.tmdbId, mediaType: tile.mediaType });
      }
    }
  }

  // Process in batches
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    const batch = tasks.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (task) => {
        const logoPath = await fetchTitleLogo(task.tmdbId, task.mediaType);
        return { ...task, logoPath };
      })
    );

    // Apply logos to a deep-copied rows array
    let changed = false;
    const updated = rows.map((row, rIdx) => ({
      ...row,
      tiles: row.tiles.map((tile, tIdx) => {
        const match = results.find((r) => r.rowIdx === rIdx && r.tileIdx === tIdx && r.logoPath);
        if (match) {
          changed = true;
          return { ...tile, logoPath: match.logoPath! };
        }
        return tile;
      }),
    }));

    if (changed) {
      rows = updated;
      onUpdate(updated);
    }
  }
}

// Build image URL from a TMDB backdrop_path
// We store the tmdb id in imageIndex but need the actual path from the tile data
// So we'll use a separate lookup approach
export function getTmdbBackdropUrl(backdropPath: string, size = 'w780'): string {
  return `${IMG_BASE}/${size}${backdropPath}`;
}

export function getTmdbPosterUrl(posterPath: string, size = 'w342'): string {
  return `${IMG_BASE}/${size}${posterPath}`;
}

export function getTmdbLogoUrl(logoPath: string, size = 'w500'): string {
  return `${IMG_BASE}/${size}${logoPath}`;
}

interface TmdbImageResult {
  file_path: string;
  iso_639_1: string | null;
  width: number;
}

interface TmdbImagesResponse {
  logos: TmdbImageResult[];
}

/**
 * Fetch the English logo image for a given title.
 * Returns the logo path or null if none found.
 */
export async function fetchTitleLogo(
  tmdbId: number,
  mediaType: 'movie' | 'tv'
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${tmdbId}/images?include_image_language=en,null`,
      { headers }
    );
    if (!res.ok) return null;
    const data: TmdbImagesResponse = await res.json();
    // Prefer English logos, pick the widest one for quality
    const english = data.logos
      .filter((l) => l.iso_639_1 === 'en')
      .sort((a, b) => b.width - a.width);
    const logo = english[0] ?? data.logos[0];
    return logo?.file_path ?? null;
  } catch {
    return null;
  }
}
