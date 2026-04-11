# JFlix

A Netflix-inspired streaming UI that runs in three modes: a standard **web** experience with mouse interaction and native scrolling, a responsive **mobile** layout with bottom tabs and poster grids, and an immersive **TV mode** with keyboard/gamepad-only navigation, custom focus management, and full-screen detail views. Built as a portfolio piece demonstrating multi-platform UI engineering.

## What This Is

A single React codebase that adapts to three interaction paradigms — web (mouse/click), mobile (touch), and TV (D-pad/keyboard) — sharing the same content pipeline, state management, and component tree. A labeled Web/TV toggle in the nav bar switches between modes on desktop.

## Stack

- **React 18 + TypeScript + Vite**
- **Redux Toolkit** — focus position, content data, UI state, trailer coordination, mode management
- **TMDB API** — real movie/show backdrops, posters, logos, trailers, season/episode data
- **YouTube IFrame Player API** — trailer previews on tiles, hero, and detail views
- **Zero UI/CSS libraries** — all styling is JS-object based (inspired by Netflix's Gibbon renderer)

## Running Locally

```bash
git clone https://github.com/<your-username>/tv-ui.git
cd tv-ui
npm install

# Add your TMDB API token
echo "VITE_TMDB_TOKEN=your_token_here" > .env

npm run dev
```

Open `http://localhost:5173` in your browser.

## Three Modes

### Web Mode (default)
- Mouse-driven navigation with native browser scrolling
- Netflix-style hover cards on tiles (expand with match %, rating, year, genres)
- Clickable nav bar, hero buttons, and tile cards
- Detail modal with trailer, metadata, synopsis, and episode browser for TV shows
- Horizontal scroll with chevron buttons on content rows

### Mobile Mode (< 768px)
- Netflix mobile-style layout with portrait poster tiles
- Bottom tab navigation (Home, Search, New & Hot, My List)
- Horizontal carousels with touch-friendly swipe scrolling
- No TV mode toggle (web-only on mobile)

### TV Mode (toggle from desktop nav)
- Keyboard/gamepad-only navigation with custom 2D focus engine
- Full-screen detail view with trailer playing, metadata, and episode/season browser
- Cursor auto-hides on keyboard input, reappears on mouse movement
- Welcome modal on first load explaining controls
- All the original TV-specific features: trailer dwell-to-play, directional shrink, parallax hero

## Controls (TV Mode)

| Key | Action |
|-----|--------|
| Arrow Keys | Navigate content grid, hero buttons, nav bar, search keyboard |
| Enter / Space | Select |
| Escape / Backspace | Back / Close |
| WASD | Alternative directional nav |
| M | Toggle mute on active trailer |
| P | Toggle pause on active trailer |
| ` (backtick) | Toggle Performance HUD |

## Features

### Multi-Mode Architecture
- **Mode detection** — `useMode()` / `useResponsive()` hooks drive conditional rendering throughout the component tree
- **Shared state** — Redux store, TMDB data layer, and content pipeline are mode-agnostic
- **Persisted preference** — Mode choice saved to localStorage, restored on reload
- **Conditional input** — TV mode activates FocusEngine + InputManager; web mode uses native DOM events

### Content & Data
- **TMDB-powered** — 12+ content rows per page with real backdrops, logos, and metadata
- **Multi-page** — Home, TV Shows, Movies, New & Popular, My List, Search with page caching
- **Episode browser** — Real season/episode data from TMDB with thumbnails, titles, runtimes, descriptions
- **Search** — TMDB search with 500ms debounce (on-screen keyboard in TV mode, standard input in web)
- **Watchlist** — Persistent My List with localStorage, add/remove from detail view

### Trailer Previews
- **Tile trailers** — 2s dwell in TV mode, tile expands to 16:9 with crossfade
- **Hero trailer** — Auto-plays in both web and TV mode
- **Detail trailer** — Plays at the top of the detail modal/fullscreen view
- **One at a time** — Tile playing pauses hero; detail overlay pauses tile
- **Global mute/pause** — M/P keys control whichever trailer is active

### Performance
- **Vertical virtualization** — Only ~7 rows render around focus (TV mode)
- **Horizontal virtualization** — Only visible tiles + buffer per row (TV mode)
- **rAF scroll engine** — Custom animation engine with easing, mid-animation interruption
- **Performance HUD** — Live FPS + mounted tile count (backtick toggle)
- **Image cache awareness** — Logos appear instantly on revisited pages

## Architecture

```
src/
├── engine/              # Framework-agnostic core (TV mode)
│   ├── FocusEngine      # 2D grid nav with row memory
│   ├── InputManager     # Keyboard → abstract actions
│   ├── ScrollEngine     # rAF animation engine
│   └── easing           # Easing functions
├── components/          # React UI layer
│   ├── Shell            # Mode-aware app shell (web/mobile/TV layouts)
│   ├── NavBar           # Top nav with Web/TV toggle (desktop)
│   ├── MobileNavBar     # Bottom tab bar (mobile)
│   ├── GlobalStyles     # Dynamic <style> tag per mode
│   ├── ContentRow       # Horizontal row (native scroll or engine-driven)
│   ├── ContentTile      # Tile with hover card (web) or focus ring (TV)
│   ├── HeroBanner       # Featured content with trailer
│   ├── DetailOverlay    # Modal (web) or fullscreen (TV) with episode browser
│   ├── EpisodeBrowser   # Season tabs + episode list from TMDB
│   ├── WelcomeModal     # TV mode first-load instructions
│   └── ...
├── hooks/               # React bridges
│   ├── useMode          # Read interaction mode from Redux
│   ├── useResponsive    # Window size / mobile detection
│   ├── useCursorHide    # Auto-hide cursor in TV mode
│   ├── usePageLoader    # Shared page content loading
│   ├── useInputNavigation  # TV mode: FocusEngine + InputManager → Redux
│   ├── useTrailerPreview   # Dwell timer → trailer key → playback
│   └── useScrollAnimation  # React bridge to ScrollEngine
├── state/               # Redux (focus, content, UI, trailer, watchlist)
├── data/                # TMDB (content, logos, trailers, episodes), page configs
└── styles/              # Theme, styleEngine, per-component styles
```

## Tests

```bash
npm test          # one-shot
npm run test:watch
```

16 unit tests cover FocusEngine: horizontal/vertical nav, row memory, page transitions, nav-bar interactions.
