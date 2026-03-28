# TV UI

A TV-style content browser built to behave like an actual TV app: keyboard-only navigation, custom focus management, smooth animations, and no mouse interactions. Built as a portfolio piece demonstrating the engineering challenges of TV UI development.

## What This Is

This is not a web app styled to look like a TV — it's architected like one. The entire interaction model is built from scratch: a custom 2D focus engine, abstract input handling (keyboard today, remote/gamepad tomorrow), and a rendering layer designed to be swapped out for a custom renderer.

## Stack

- **React 18 + TypeScript + Vite** — no Next.js, keep it simple like a TV app
- **Redux Toolkit** — predictable state for focus position, content data, UI state
- **TMDB API** — real movie/show backdrops and logo title treatments
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
| Arrow Keys | Navigate the 2D content grid |
| Enter / Space | Open detail overlay |
| Escape / Backspace | Close detail overlay |
| Left / Right (in overlay) | Navigate overlay buttons |
| WASD | Alternative directional navigation |

Mouse is intentionally disabled — TV apps don't have cursors.

## Architecture

```
src/
├── engine/          # Framework-agnostic core logic
│   ├── FocusEngine  # 2D grid navigation with row memory
│   └── InputManager # Keyboard → abstract actions, custom key repeat
├── components/      # React UI layer
│   ├── Shell        # App shell with vertical scrolling
│   ├── ContentRow   # Horizontal scrollable row
│   ├── ContentTile  # Individual content card with logo overlay
│   ├── HeroBanner   # Featured content with parallax + logo treatment
│   ├── DetailOverlay# Expanded view on Enter
│   └── FocusRing    # Scale + shadow focus indicator
├── hooks/           # React bridges to engines
├── state/           # Redux store, slices, selectors
├── data/            # TMDB API integration + mock fallback
└── styles/          # JS-object theme tokens
```

**Key design decisions:**

- **Custom focus engine over browser focus** — `tabIndex` and `:focus` are designed for mouse+keyboard web apps. TV UIs need 2D spatial navigation, focus memory across rows, and debounced input handling.
- **No CSS framework** — TV apps don't use CSS cascade. Styles are explicit JS objects per component, similar to React Native's StyleSheet. This is predictable and GPU-friendly on constrained devices.
- **Engine/UI separation** — FocusEngine and InputManager have zero React dependencies. The rendering layer could be swapped for a custom renderer without touching navigation logic.
- **Progressive data loading** — Content rows appear instantly with backdrops. Logo title treatments stream in asynchronously so the UI is never blocked.

## Project Status

Phase 1 (Focus Engine + Navigation) is complete. See [NEXTSTEPS.md](NEXTSTEPS.md) for remaining phases including virtualization, rAF-driven scroll animations, performance HUD, and accessibility.
