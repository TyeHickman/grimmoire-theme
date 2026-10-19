# Grimmoire

Grimmoire is a dark, neon-arcane theme for Obsidian. It pairs an ink-black
workspace with restrained violet light, cyan details, manuscript-inspired
headings, and constellation-like graph colors.

## Install for local development

1. Copy this folder into `<your-vault>/.obsidian/themes/Grimmoire`.
2. In Obsidian, open **Settings → Appearance**.
3. Set the base color scheme to **Dark**.
4. Select **Grimmoire** under **Themes**.
5. After editing `theme.css`, reload Obsidian to see the latest changes.

The install folder only needs `manifest.json` and `theme.css`. Keep this README
alongside them if you plan to publish the theme later.

## Optional CSS classes

Add the class below under **Settings → Appearance → CSS classes**:

- `grimmoire-no-glow` removes decorative glow while retaining the palette.

## Custom callouts

Grimmoire includes three themed callouts:

```markdown
> [!lore] A recovered fragment
> Notes about the history of the world.

> [!ritual] Required steps
> A process, recipe, or repeatable practice.

> [!omen] Watch for this
> A clue, warning, or open question.
```

## Design tokens

| Role | Color |
| --- | --- |
| Void | `#0D0912` |
| Panel | `#171020` |
| Raised surface | `#20172B` |
| Violet | `#A970FF` |
| Magenta | `#D45CFF` |
| Cyan | `#55E6FF` |
| Main text | `#E5DEED` |
| Muted text | `#A398AF` |

## Compatibility

This initial version targets Obsidian 1.13 or newer and uses current semantic
CSS variables and `color-mix()` for translucent colors. It contains no remote
fonts or images.

## Before publishing

- Replace the placeholder author in `manifest.json`.
- Add a license.
- Add a current 512 × 288 screenshot.
- Tag releases with the exact semantic version from `manifest.json`.
- Attach `manifest.json` and `theme.css` to each GitHub release.
