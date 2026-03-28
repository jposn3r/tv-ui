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
- [ ] Tile metadata visibility polish
- [ ] Detail overlay slide-up animation refinement

### Phase 5: Performance HUD + Metrics
- [ ] FPS counter (rAF-based frame timing)
- [ ] Mounted component counter
- [ ] Render time per frame (Performance API)
- [ ] Memory usage tracking (performance.memory)
- [ ] Input latency measurement (keydown → visual change)
- [ ] Scroll smoothness (dropped frame detection)
- [ ] PerformanceHUD component (toggle with 'P' key, updates every 500ms)
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
