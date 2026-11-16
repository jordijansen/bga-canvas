# CLAUDE.md

This file gives Claude Code guidance for working in this repository.

## Project

A Board Game Arena (BGA) Studio version of the board game **Canvas** (status: in development).
The server is in PHP (BGA framework) and the client is in TypeScript compiled to a single dojo module.

## Build

```bash
npm install          # pulls bga-cards, bga-zoom, bga-jump-to (GitHub: thoun/*)
npm run build        # tsc -> canvas.js, sass src/Canvas.scss -> canvas.css
npm run watch        # watch mode for both
```

- `canvas.js`, `canvas.css` and `canvas.css.map` are **generated**. Never edit them by hand. Edit `src/` and rebuild.
- TypeScript targets ES5 with `module: none` and `outFile`. Every file is joined into one output in the order given by the `files` list in `tsconfig.json`. **When you add a new `.ts` file, add it to `tsconfig.json` in the right order.** Dependencies go first and `src/Canvas.ts` stays last.
- Library sources (bga-cards, bga-animations, bga-zoom, bga-jump-to) are compiled straight from `node_modules/.../src`.
- There are no tests or linters. Check changes by building, then deploying to BGA Studio.

## Architecture

### Server (PHP)
- `canvas.game.php`: the main `Canvas extends Table` class. It is put together from traits in `modules/php/`:
  - `ActionTrait`: player actions (each one calls `checkAction`, then the logic, then `gamestate->nextState`)
  - `StateTrait` (`st*`), `ArgsTrait` (`arg*`), `UtilsTrait`, `DebugTrait`
- Domain managers in `modules/php/`: `ArtCardManager`, `BackgroundCardManager`, `ScoringCardManager`, `InspirationTokenManager`, `PaintingManager`, `RibbonManager`. Most of them wrap `module.common.deck`.
- `modules/php/Constants.inc.php`: state IDs and names (`ST_*`), action names (`ACT_*`), and option/global IDs. Use these constants and don't hardcode strings.
- `states.inc.php`: the state machine (playerTurn → takeArtCard / completePainting → nextPlayer).
- `canvas.action.php`: the AJAX entry points (`/canvas/canvas/<action>.html`). Each one reads its args and forwards them to the game class.
- `material.inc.php`: static card data (`$this->ART_CARDS`, `$this->SCORING_CARDS`).
- `dbmodel.sql`, `gameoptions.inc.php`, `gameinfos.inc.php`, `stats.inc.php`: standard BGA config.

### Client (TypeScript, `src/`)
- `Canvas.ts`: the main game class (setup, `onEnteringState`, action buttons, `takeAction`, notifications). `src/bga/Define.ts` wraps it as the dojo module `bgagame.canvas`.
- `Canvas.d.ts`: shared types (gamedatas, state args, notification args).
- One client manager per server manager (`ArtCardManager`, `PaintingManager`, etc.), plus `PlayerManager`, `AutoZoomManager` and `CounterVoidStock`.
- Notifications are handled by `notif_<name>` methods, which `setupNotifications` wires up and which can return promises.
- Styles: `src/Canvas.scss` (imports `LoadingIndicator.scss`). The template is `canvas_canvas.tpl`.

## Adding a player action (checklist)
1. Add the `ACT_*` / `ST_*` constants in `Constants.inc.php`.
2. Add the state and transitions in `states.inc.php`.
3. Add the method in `canvas.action.php` and the logic in `ActionTrait.php` (plus `arg*` / `st*` methods if needed).
4. Client: call `this.takeAction('<action>', {...})`, add UI in `Canvas.ts` or the managers, add types in `Canvas.d.ts`, and add the `notif_*` handlers.
5. Run `npm run build`.

## Conventions
- Translatable strings: use `clienttranslate()` / `self::_()` in PHP and `_()` in TS.
- Use `log(...)` for client debug output. It only prints on studio or with `#debug`.
- Some PHP files have CRLF line endings. Keep the line endings a file already uses.
