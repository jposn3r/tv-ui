# JFlix

A TV-style content browser built to behave like an actual TV app: keyboard-only navigation, custom focus management, trailer previews, and no mouse interactions. Built as a portfolio piece demonstrating the engineering challenges of TV UI development.

## What This Is

This is not a web app styled to look like a TV — it's architected like one. The entire interaction model is built from scratch: a custom 2D focus engine, abstract input handling (keyboard today, remote/gamepad tomorrow), YouTube trailer previews with dwell-to-play, and a rendering layer designed to be swapped out for a custom renderer.

## Stack

- **React 18 + TypeScript + Vite** — no Next.js, keep it simple like a TV app
- **Redux Toolkit** — predictable state for focus position, content data, UI state, trailer coordination
- **TMDB API** — real movie/show backdrops, logo title treatments, and YouTube trailer keys
- **YouTube IFrame Player API** — trailer previews on tiles and hero banner
- **Zero UI/CSS libraries** — no Tailwind, no styled-components, no Material UI. All styling is JS-object based (inspired by Netflix's Gibbon renderer concept)

## Running Locally

```bash
# Clone and install
git clone https://github.com/<your-username>/tv-ui.git
cd tv-ui
npm install

# Add your TMDB API token
# Get a free Read Access Token from https://www.themoviedb.org/settings/api
echo "VITE_TMDB_TOKEN=your_token_here" > .env

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## Controls

| Key | Action |
|-----|--------|
| Arrow Keys | Navigate the 2D content grid / hero buttons / nav bar / search keyboard |
| Enter / Space | Select (open detail, switch page, press search key) |
| Escape / Backspace | Close detail overlay (Backspace deletes in search) |
| Left / Right (in overlay) | Navigate overlay buttons |
| WASD | Alternative directional nav (passes through as letters in search) |
| M | Toggle mute on active trailer |
| P | Toggle pause on active trailer |
| Any letter/number | Direct typing in search mode |

Mouse is intentionally disabled — TV apps don't have cursors.

## Features

### Trailer Previews
- **Tile trailers** — Focus on any tile for 2 seconds and a YouTube trailer auto-plays. The tile expands to 16:9, the backdrop and logo crossfade out as the video fades in. Navigate away and the tile shrinks back with directional animation.
- **Hero trailer** — The hero banner has focusable Play and Add to List buttons. While focused, the hero auto-plays a trailer after 2 seconds. Scroll down to content rows and it fades back to the static backdrop.
- **One trailer at a time** — Tile trailers pause the hero; returning to hero stops the tile trailer.
- **Global mute/pause** — M mutes whichever trailer is active. P pauses it. Detail overlay auto-pauses.

### Navigation
- **Hero focus stop** — Navigation flows Nav bar ↔ Hero buttons ↔ Content rows. The hero section stays full-height when moving between hero and nav.
- **Multi-page** — Home, TV Shows, Movies, New & Popular, My List, Search — each with unique TMDB-powered content and page caching.
- **Search** — On-screen keyboard grid with physical keyboard passthrough and TMDB search with 500ms debounce.
- **Row scroll memory** — Rows hold their horizontal scroll position on vertical navigation. Only Left/Right scrolls.

## Architecture

```
src/
├── engine/          # Framework-agnostic core logic
│   ├── FocusEngine  # 2D grid nav with row memory, nav bar support
│   └── InputManager # Keyboard → abstract actions, raw key passthrough for search
├── components/      # React UI layer
│   ├── Shell        # App shell with per-page vertical scrolling
│   ├── NavBar       # Top navigation (Home, TV Shows, Movies, New & Popular, My List, Search)
│   ├── ContentRow   # Horizontal scrollable row with vertical overflow for trailer expansion
│   ├── ContentTile  # Content card with trailer preview, logo fade-in, directional shrink
│   ├── HeroBanner   # Featured content with trailer playback, parallax, focusable buttons
│   ├── YouTubePlayer# Reusable YT.Player wrapper with lifecycle management
│   ├── SearchPage   # On-screen keyboard grid + TMDB search results
│   ├── MyListPage   # Empty state with focusable CTA
│   ├── DetailOverlay# Expanded view on Enter
│   └── FocusRing    # Scale + shadow focus indicator with trailer scale override
├── hooks/           # React bridges to engines
│   ├── useInputNavigation  # Wires FocusEngine + InputManager to Redux
│   ├── useTrailerPreview   # Dwell timer → fetch trailer key → signal readiness
│   └── useYouTubeApi       # Singleton YouTube IFrame API loader
├── state/           # Redux store, slices (focus, content, UI, trailer), selectors
├── data/            # TMDB integration (content, logos, trailers), per-page configs, mock fallback
└── styles/          # JS-object theme tokens
```

**Key design decisions:**

- **Custom focus engine over browser focus** — `tabIndex` and `:focus` are designed for mouse+keyboard web apps. TV UIs need 2D spatial navigation, focus memory across rows, and debounced input handling.
- **No CSS framework** — TV apps don't use CSS cascade. Styles are explicit JS objects per component, similar to React Native's StyleSheet. This is predictable and GPU-friendly on constrained devices.
- **Engine/UI separation** — FocusEngine and InputManager have zero React dependencies. The rendering layer could be swapped for a custom renderer without touching navigation logic.
- **Progressive data loading** — Content rows appear instantly with backdrops. Logo title treatments and trailer keys stream in asynchronously so the UI is never blocked.
- **Trailer coordination via Redux** — A dedicated trailer slice tracks active trailer source, mute/pause state, and tile-vs-hero priority. Only one trailer plays at a time, and the detail overlay auto-pauses playback.

## Project Status

Phase 1 (Focus Engine + Navigation), multi-page with search, and trailer previews (tile + hero) are complete. See [NEXTSTEPS.md](NEXTSTEPS.md) for remaining work including virtualization, scroll engine, styling system, performance HUD, and accessibility.
