# Next Steps

Tracking remaining work for the TV UI project. Updated as we go.

## Completed

### Phase 1: Focus Engine + Keyboard Navigation
- [x] FocusEngine — 2D grid navigation with row memory
- [x] InputManager — keyboard → abstract actions, custom key repeat (300ms delay, 100ms interval)
- [x] Redux state (focus, content, UI slices)
- [x] useFocus + useInputNavigation hooks
- [x] Shell, ContentRow, ContentTile, FocusRing, RowTitle, HeroBanner, DetailOverlay
- [x] TMDB integration — real backdrops + progressive logo loading
- [x] Detail overlay with navigable buttons (Play, Add to List, Like)
- [x] Hero banner with logo title treatment + parallax
- [x] Row scroll holds position on vertical nav, only scrolls on Left/Right

### Top Navigation + Multi-Page + Search
- [x] Netflix-style top nav bar (Home, TV Shows, Movies, New & Popular, My List, Search)
- [x] Nav bar focus: UP from row 0 → nav, DOWN from nav → content
- [x] Nav focus lands on active page item (not always Home)
- [x] Per-page TMDB content (TV Shows, Movies, New & Popular each have unique row configs)
- [x] Page content caching — switching back to a visited page is instant
- [x] Progressive logo loading per page
- [x] Search page with on-screen keyboard grid (7×6, arrow-navigable)
- [x] Physical keyboard typing in search (WASD disabled in search mode, Backspace deletes)
- [x] TMDB search integration with 500ms debounce
- [x] Search results displayed as navigable content rows
- [x] My List empty state with focusable "Browse Content" CTA
- [x] FocusEngine extended: nav row (rowIndex -1), navRestoreIndex, nav item count

### Trailer Previews
- [x] YouTube IFrame Player API integration (singleton loader, reusable YouTubePlayer component)
- [x] TMDB videos endpoint — fetches YouTube trailer keys with priority (official trailer > trailer > teaser)
- [x] Trailer key caching with 60s TTL on null entries for retry
- [x] Tile trailer: 2-second dwell timer, tile expands to 16:9 aspect ratio, smooth crossfade
- [x] Backdrop image + logo fade out together as video fades in (no loading spinner visible)
- [x] Directional shrink-back animation (transform-origin based on nav direction)
- [x] Hero trailer: plays when hero buttons are focused, stops on scroll to rows or nav
- [x] Hero section: taller (56vh), focusable Play + Add to List buttons
- [x] Navigation flow: Nav ↔ Hero buttons ↔ Content rows (hero is a focus stop)
- [x] Hero stays full height when navigating to nav bar (no animation on hero ↔ nav)
- [x] Only one trailer at a time — tile playing pauses hero, returning to hero stops tile
- [x] Global mute (M key) — toggles mute on whichever trailer is active
- [x] Global pause (P key) — pauses current trailer, auto-clears on navigation
- [x] Detail overlay pauses active trailer, unpauses on close
- [x] Logo fade-in animation on load (no flash, checks cached state)
- [x] Row scroll fix — only scrolls on explicit Left/Right, never on vertical nav entry

## Up Next

### Phase 2: Virtualized Rendering
- [ ] VirtualList engine (vertical — only mount visible rows + 1 buffer each direction)
- [ ] Horizontal virtualization within each row (only mount visible tiles + 1 buffer)
- [ ] useVirtualization hook
- [ ] Apply to Shell (vertical) and ContentRow (horizontal)
- [ ] Component counter in Performance HUD showing mounted vs total
- [ ] Verify: ~80 mounted components instead of 240+, memory stays flat

### Phase 3: Smooth Scroll Animations
- [ ] ScrollEngine with requestAnimationFrame (replace CSS transitions)
- [ ] Cubic-bezier easing, optional spring physics
- [ ] Row scroll: focused tile stays ~2nd from left edge (Netflix pattern)
- [ ] Vertical scroll: focused row near top, not centered
- [ ] Hero banner parallax via rAF (not CSS transition)
- [ ] Coordinate scroll position with virtualization mount/unmount cycle

### Phase 4: Styling System + Visual Polish
- [ ] styleEngine.ts — JS-object styles, no CSS cascade (Gibbon-inspired)
- [ ] Apply to all components, remove inline style objects
- [ ] Font system (system-ui stack, weight 400/500/600/700)
- [ ] Detail overlay slide-up animation refinement

### Phase 5: Performance HUD + Metrics
- [ ] FPS counter (rAF-based frame timing)
- [ ] Mounted component counter
- [ ] Render time per frame (Performance API)
- [ ] Memory usage tracking (performance.memory)
- [ ] Input latency measurement (keydown → visual change)
- [ ] Scroll smoothness (dropped frame detection)
- [ ] PerformanceHUD component (toggle with dedicated key, updates every 500ms)
- [ ] Performance API markers (focus-change, scroll-animation, row-mount)

### Phase 6: Final Polish + Documentation
- [ ] Edge cases: boundary nav, variable row lengths, rapid key press, window resize
- [ ] Accessibility: role="grid"/row/gridcell, aria-selected, live region announcements
- [ ] README with architecture decisions (ADRs)
- [ ] Deploy to Vercel/Netlify/GitHub Pages
- [ ] Record 60-second demo video

## Known Issues
- None currently tracked

## Notes
- Project plan PDF in repo root has full phase details with code snippets
- TMDB API key required in `.env` as `VITE_TMDB_TOKEN`
- No external UI/CSS libraries by design — demonstrates Netflix Gibbon concepts
