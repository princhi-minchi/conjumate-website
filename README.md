# ConjuMate website

React, Vite, and Tailwind CSS marketing site for [conjumate.com](https://conjumate.com/). Install buttons open the existing Chrome Web Store listing. Privacy links point to the existing policy in the separate `conjumate-legal` repository.

## Development

Use Node.js 24 LTS and npm (also compatible with Node.js 22.13+).

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm test
npm run build
npm run preview
```

Build output is `dist/`. No environment variables, API keys, website backend, or signup service are required. The previous `VITE_WAITLIST_URL` variable and root `google-apps-script.js` are unused legacy waitlist configuration; the redesign does not submit or collect email addresses.

## Preview without a server

Opening the source `index.html` directly will not run the React app. Also, a development server's `localhost` URL in a cloud workspace is not the localhost of your desktop.

For a downloadable preview that works on its own:

```sh
npm run preview:file
```

Open `preview/conjumate-preview.html` in a browser. This file embeds the production JavaScript, CSS, and images. It also contains rendered page markup, so restricted file viewers can still show the design if they disable JavaScript. Open the downloaded file in Chrome for the full interactive preview. The export uses the same React components as the website; it does not change the Cloudflare deployment build. Generated preview files are ignored by Git.

## Content and assets

- `src/content.js`: exact Chrome Store/privacy URLs, language availability, and FAQ copy. Italian is live; Spanish, French, and Portuguese are coming soon.
- `src/App.jsx`: page sections, mobile navigation, and three step illustrations built from HTML and vector graphics.
- `src/ThemeToggle.jsx`: header light/dark toggle. Initially follows the device theme, then saves a manual choice in local storage (`conjumate-theme`). The head script applies the theme before the page renders. Toggling still works when storage is blocked.
- `src/LookupPreview.jsx`: native desktop text selection, touch/click word lookup, single-entry keyboard navigation, and popup dismissal.
- `src/ConjugationPopup.jsx`: floating extension-style lookup, two-column conjugations, mood/tense arrow controls, and session-only word bookmarks.
- `src/demo-data.js`: every word occurrence in the fixed sample, context translations, and the complete active, non-reflexive paradigms of leggere, scoprire, viaggiare, and lasciare. Covers 7 moods and 21 mood/tense combinations, including compound and non-finite forms.
- `src/index.css`: responsive light/dark palettes and reduced-motion support. The interactive reading sample uses 20px text on desktop and 18px on mobile/tablet; popup text sizes remain unchanged.
- `src/logo2.png`: supplied dolphin logo, used by `Brand` in the header and footer at its original aspect ratio. `src/logo.png` is the retained previous artwork and is no longer bundled.
- `src/assets/fonts/`: locally hosted Dancing Script font for the cursive wordmark, with its SIL Open Font License. The standalone preview embeds the font so the logo lettering also works offline.
- `src/assets/demo.mp4` and `src/assets/demo-poster.webp`: retained demo assets, currently unused and excluded from the production bundle.
- Original `src/demo.mp4` and root `Conjumate Demo Portrait.mp4` remain unchanged and are not included in the production bundle.
- `public/`: favicon, social preview, robots file, and sitemap. Update the social preview when branding changes.

The interactive lookup uses local examples and is labeled as an illustration. It does not connect to the extension's translation or conjugation services.

The popup starts hidden. On desktop, drag-select or double-click a word in the sample. On touch devices, tap a word. Keyboard users can Tab into the paragraph, move with Left/Right (or Home/End), and press Enter or Space to look up the focused word. Selecting more than one word displays a single-word instruction. Clicking outside the popup, pressing Escape, scrolling the page, or resizing the window dismisses it. Sample verbs have a subtle glow and pulse; reduced-motion preferences disable the pulse. Each verb lookup opens at its contextual mood and tense, with the matching person/form highlighted and visible in the table: legge, scopre, and viaggia use present indicative; lasciare uses present infinitive. The mood and tense arrows still allow browsing all conjugations. Non-verbs show their grammar instead of a conjugation table. The bookmark button remembers words for the current page session only. This illustrative demo does not save anything to an extension account.

Conjugation reference checks: [leggere](https://www.wordreference.com/conj/itverbs.aspx?v=leggere), [scoprire](https://www.wordreference.com/conj/itverbs.aspx?v=scoprire), [viaggiare](https://www.wordreference.com/conj/itverbs.aspx?v=viaggiare), and [lasciare](https://conjugator.reverso.net/conjugation-italian-verb-lasciare.html). These are development references, not runtime dependencies. `npm test` checks word coverage, all supported mood/tense combinations, irregular forms, and compound/non-finite forms.

## Cloudflare hosting

Keep the existing Cloudflare project, domain, and Git repository connection. For Cloudflare Pages, use:

| Setting          | Value                               |
| ---------------- | ----------------------------------- |
| Build command    | `npm run build`                     |
| Output directory | `dist`                              |
| Root directory   | Repository root                     |
| Node.js          | `24` (set `NODE_VERSION` if needed) |

There are no website API routes, server functions, or new client-side page routes. Navigation uses section anchors. No Cloudflare hosting or DNS settings were changed. Review with a preview deployment before publishing to the production branch.
