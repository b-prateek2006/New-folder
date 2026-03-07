# Project Guidelines

## Overview
Client-side Tic Tac Toe game — pure HTML, CSS, and JavaScript with zero dependencies. No frameworks, no build tools, no backend. Open `index.html` in a browser to run.

## Architecture
- `index.html` — Page structure (board, scoreboard, controls, result overlay)
- `style.css` — Responsive layout, dark theme, animations (CSS Grid, custom properties)
- `script.js` — Game logic, DOM updates, localStorage score persistence (IIFE pattern)

Unrelated files: `function.js` (JS practice), `LambdaExpressionDemo4.java` (Java practice) — leave untouched.

## Code Style
- **HTML**: Semantic markup, `data-*` attributes for cell indices, `tabindex` for keyboard access
- **CSS**: Mobile-first with CSS custom properties in `:root`, BEM-lite class names, `@keyframes` for animations
- **JS**: Strict mode via IIFE wrapper, `const`/`let` only, DOM references cached at top, no global variables

## Conventions
- Scores persist in `localStorage` under key `ttt-scores` as JSON `{ x, o, draws }`
- Win detection checks 8 combos stored in `WIN_COMBOS` array
- Animations use CSS classes toggled from JS (`pop`, `winner`, `bump`, `show`)
- All game state resets go through `resetGame()` — never manipulate DOM cells individually outside that function

## Testing
No automated tests. Verify manually:
1. Open `index.html` — board renders, cells clickable
2. X/O alternate on clicks, winning line glows, overlay appears
3. Scores persist after page refresh
4. "Reset Game" clears board; "Reset Scores" zeroes everything
5. Responsive at 320px–1920px, keyboard navigable (Tab + Enter)
