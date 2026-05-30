# Hatch Pet Desktop

A tiny desktop pet application built with Electron and organized around a `hatch-pet` style pet package. The current pet, **Anime Mochi**, uses cute anime-style placeholder SVG assets that can later be replaced with a generated hatch-pet spritesheet.

## Features

- Transparent, frameless desktop window so only the pet is visible.
- Always-on-top behavior so the pet stays on your desktop while you work.
- Mouse dragging: click and drag the pet to reposition it.
- Random expression changes across five moods:
  - happy
  - idle
  - sleepy
  - angry
  - surprised
- Simple idle animation with floating, swaying, and shadow pulsing.
- Clean project layout that separates Electron main, preload, renderer, and pet assets.
- `assets/hatch-pet/anime-mochi/pet.json` keeps the placeholder pet metadata close to hatch-pet conventions.

## Requirements

- Node.js 20 or newer.
- npm 10 or newer.

## Run locally

Install dependencies:

```bash
npm install
```

Validate the pet manifest and JavaScript syntax:

```bash
npm run check
```

Start the desktop pet:

```bash
npm start
```

Quit with <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>Q</kbd>, or stop the process from the terminal.

## Project structure

```text
assets/hatch-pet/anime-mochi/   Placeholder hatch-pet style pet package
scripts/                        Local validation helpers
src/main/                       Electron BrowserWindow setup
src/pet/                        Runtime pet manifest used by the renderer
src/preload/                    Safe IPC bridge for dragging and quitting
src/renderer/                   Transparent UI, animations, and expression switching
```

## Replacing the placeholder art

The app currently uses one SVG per expression for fast local iteration. To swap in generated art later:

1. Replace the files in `assets/hatch-pet/anime-mochi/expressions/` with generated transparent assets, or adapt `src/pet/manifest.js` to read frames from a hatch-pet spritesheet.
2. Update `assets/hatch-pet/anime-mochi/pet.json` so its expression list and `spritesheetPath` point to the final hatch-pet output.
3. Run `npm run validate:pet` to confirm all declared assets exist.
