# Next Steps

Iteration plan for the three UI modes: Web, Mobile, and TV.

## Web Mode Iterations

- [ ] Hover card delay tuning (400ms show, instant hide) and portal rendering for z-index
- [ ] Tile hover trailer preview (play trailer on prolonged hover like Netflix web)
- [ ] Detail modal scroll-to-top on open, smooth close animation
- [ ] Nav bar: hover underline animation, active indicator transition
- [ ] Search page: standard text input with results grid (replace on-screen keyboard in web)
- [ ] My List page: grid layout with poster tiles instead of horizontal row
- [ ] Responsive tile sizing (fluid widths based on viewport, not fixed 230px)
- [ ] Row "see all" expansion on row title click
- [ ] Keyboard shortcuts overlay (? key)
- [ ] Toast notifications for add/remove from list
- [ ] Hero banner: cycle through featured content on a timer

## Mobile Mode Iterations

- [ ] Top 10 badges on trending tiles (numbered overlay)
- [ ] Large featured hero card at top of feed (single title with trailer)
- [ ] "Continue Watching" row with progress bars
- [ ] Category filter chips (horizontal scrollable)
- [ ] Pull-to-refresh gesture
- [ ] Detail view as full-screen slide-up sheet (not modal)
- [ ] Swipe gestures on tiles (swipe right to add to list)
- [ ] Bottom sheet for tile quick actions (long press)
- [ ] Optimized poster image sizes for mobile bandwidth
- [ ] Search page with standard mobile text input and grid results
- [ ] Safe area padding for notched devices

## TV Mode Iterations

- [ ] Full-screen detail: D-pad navigation between buttons, season tabs, and episode list
- [ ] Episode browser: LEFT/RIGHT changes season, UP/DOWN navigates episodes
- [ ] Detail view "More Like This" row of recommendations
- [ ] Gamepad support (Xbox/PlayStation controller mapping)
- [ ] Audio description and subtitle indicators on metadata
- [ ] "Top 10 in [Country]" badges
- [ ] Content maturity icons (instead of text ratings)
- [ ] Trailer end-screen: auto-advance to next title or replay
- [ ] Row peek: show partial next/previous tile at edges
- [ ] Voice search integration placeholder
- [ ] Remote-friendly on-screen keyboard redesign (T9-style)

## Cross-Mode Improvements

- [ ] React Router for URL-based navigation (shareable links, browser back/forward)
- [ ] Integration tests for useInputNavigation page-switch flows
- [ ] ScrollEngine animation interruption tests
- [ ] Accessibility: ARIA live regions, screen reader announcements
- [ ] Skeleton loading states (shimmer placeholders while content loads)
- [ ] Error boundaries with retry UI
- [ ] Content prefetching (load next page's data on hover/focus near nav items)
- [ ] Image lazy loading with intersection observer (web/mobile)
- [ ] Bundle size optimization (code-split TV-only code)
- [ ] PWA manifest + service worker for offline support
- [ ] Demo video recording

## Known Issues

- First row on mobile may show backdrop images instead of posters if TMDB trending data lacks poster_path
- Row title left padding on mobile could be tighter on very small screens
- TV mode detail view episode navigation not yet wired to D-pad input
- Welcome modal keyboard listener may conflict with FocusEngine in edge cases
