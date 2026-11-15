# Liberty Fitness — site + member app concept (v2)

A mobile-first rebuild of the v1 concept in `../Liberty Fitness — site + member app concept/`, shaped by the critique in [CRITIQUE.md](CRITIQUE.md).

The site and the app are both static files with no build step.

| File | What it holds |
|---|---|
| `brand.js` | All copy, themes, plans, FAQ, program and demo data. Edit this to change anything brand-level. |
| `index.html` | Site + member app markup, icon sprite, confirm sheet, toast, Brand panel. |
| `styles.css` | Base styles target phones. Breakpoints at 600 / 900 / 1200px build up to tablet and desktop. |
| `main.js` | Brand application, routing, site rendering, form validation, simulated member app. |
| `manifest.webmanifest`, `icon.svg` | Installable app shell (opens straight into the member app). |

## Run it

Opening `index.html` directly works. To test on a phone on the same network, serve the folder:

```bash
python3 -m http.server 8411
```

## Routes

- `#home`, `#gym`, `#training`, `#memberships`, `#faq`, `#visit`, `#join` are site sections.
- `#app` opens the member app. `#app/book`, `#app/program`, `#app/plan` and `#app/me` open a tab directly. The old `#member-app` link still works.

## Notes

- Copy marked "placeholder" in `brand.js` needs client confirmation. That covers the coach bio, equipment list, founding perks and program content.
- Demo state lives in `localStorage` (`lf2-demo`, `lf2-brand`). Use **Reset demo** in the app's Demo panel to clear it.
- `theme: "auto"` uses Modern in light mode and Midnight in dark mode.
