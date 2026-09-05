# EuroVenture redesign

## Goal

Rebuild the supplied EuroVenture page as a compact, polished Turkish city guide. Preserve the useful shape of the original product: ten European cities, search, practical filters, concise highlights, and detailed travel notes. Replace its template-like presentation, decorative emoji, generic copy, repeated oversized cards, and weak mobile hierarchy.

The result must feel carefully authored and work as a static site that can be published on a free host.

## Research basis

The visual system borrows principles rather than branded assets. Linear contributes disciplined spacing, restrained tonal contrast, thin dividers, compact controls, and purposeful motion. Mobbin references add a searchable destination grid, editorial city imagery, concise metadata, and a focused city-detail view. Travel editorial references support curation over exhaustive lists and a strong relationship between image, useful detail, and place-specific voice.

No Linear logos, proprietary graphics, screenshots, exact colors, or copy will be used.

## Approaches considered

### Static HTML, CSS, and JavaScript

This is the selected approach. The experience is a single page with a data-driven city grid and an accessible native dialog. It avoids framework weight, deploys to almost any free static host, and keeps the project understandable for a small personal site.

### Vite and React

React would make component boundaries explicit, but the page has little state and no server data. The extra build and dependency surface would not improve the user experience enough to justify it.

### Multi-page editorial guide

Dedicated city pages would provide more room for content and SEO, but would expand the project beyond the supplied reference. The single-page directory and detail dialog cover the intended experience more directly.

## Visual direction

EuroVenture should resemble a contemporary field guide assembled by a careful traveler, then refined with product-design discipline.

### Palette

- `Ink` `#11130F`: primary canvas and text on light surfaces.
- `Paper` `#F2F0E9`: warm neutral surface, used sparingly where paper is meaningful.
- `Mist` `#D9DED7`: secondary surfaces and quiet dividers.
- `Lime` `#C8F16A`: primary interaction accent and route marker.
- `Signal` `#FF6B4A`: rare highlight for editorial annotations.
- `Cloud` `#F8F9F5`: primary reading surface.

The site opens on the ink canvas. City imagery and the lime route marker provide contrast. Cards do not receive arbitrary gradients or large soft shadows.

### Typography

Use `Manrope` for UI, navigation, and body copy because it has clear Turkish characters and compact product-like proportions. Use `Newsreader` only for large destination names and one hero statement. The contrast should feel editorial without turning every heading into a magazine treatment.

Labels use sentence case. Body lines remain short and relaxed. Copy avoids slogans that could belong to any travel site.

### Layout

The desktop page uses a twelve-column grid with shared left edges. The hero is asymmetrical: direct copy and search on the left, a layered destination contact sheet on the right. The directory is a two-column grid with varied image crops but consistent information order. A detail dialog uses image, facts, and practical notes in a clear split layout.

On mobile, all content becomes one column. Filter controls scroll horizontally, cards become compact vertical articles, and the dialog fills the viewport without losing a visible close action.

### Signature element

A thin hand-drawn route line runs through the hero contact sheet and ends at a lime location marker. Its slightly imperfect path gives the page a handmade note-book quality. It appears once. The rest of the interface remains quiet.

### Motion

- One coordinated hero entrance after load.
- Image scale and border-color feedback on hover or focus.
- Dialog open and close transitions under 220 milliseconds.
- No continuous ambient animation.
- All motion is removed when `prefers-reduced-motion` is enabled.

## Information architecture

1. Sticky header with wordmark, city count, and a direct “Şehirleri gör” action.
2. Hero with an explicit statement, short description, search field, and destination contact sheet.
3. Directory toolbar with result count and four filters: all cities, budget-friendly, classics, and warm routes.
4. Ten city cards. Each card shows image, city and country, one concrete sentence, ideal duration, budget, season, and three selected highlights.
5. City detail dialog with “see”, “eat”, and “do” lists plus where to stay, airport and transport notes, and two practical cautions.
6. Empty search state with a clear reset action.
7. Compact footer with product description and source note for photography.

## Interactions and data flow

City content lives in one JavaScript array. Rendering, search, filters, random-city navigation, and the detail dialog read from that array.

Search is case-insensitive and uses the Turkish locale. It checks the city, country, description, mood, and highlight lists. Filter and query state combine. The result count and empty state update immediately. A reset action clears both states.

Opening a card populates one native `dialog`, updates its accessible title, and moves focus into it. Closing restores focus to the originating card. Escape closes the dialog. The browser back button is not repurposed.

## Content rules

- No emoji.
- Functional icons come only from Lucide and always have accessible text where required.
- No decorative uppercase labels.
- No em dash punctuation.
- Use direct Turkish sentences with concrete travel information.
- Avoid “benzersiz deneyim”, “ritmini keşfet”, “kendi hikayeni yaz”, and similar generic marketing language.
- Keep existing practical details, but edit claims that may age into cautious wording and avoid presenting prices as permanently current.

## Accessibility

- Semantic landmarks, ordered headings, buttons for actions, and labels for controls.
- Visible focus rings with sufficient contrast.
- Minimum 44 pixel touch targets on mobile.
- Native dialog semantics and focus restoration.
- Images include useful city-specific alternative text.
- Color is never the only indication of selected or filtered state.
- The page remains usable with JavaScript disabled at the level of its static introduction and source notice; directory interaction requires JavaScript.

## Responsive behavior

- Below 720 pixels: one-column directory, compact header, full-screen dialog, horizontal filter row.
- From 720 to 1099 pixels: two-column cards, simplified hero contact sheet.
- At 1100 pixels and above: full twelve-column hero, two-column editorial grid, split dialog.
- Content width is capped at 1240 pixels and padding scales with `clamp()`.

## Verification

- Validate HTML and check that all ten cities render.
- Exercise search, every filter, reset, random city, dialog open, Escape close, close button, and focus restoration.
- Inspect at desktop, tablet, and narrow mobile widths.
- Check console errors, broken images, keyboard focus, reduced motion, and contrast.
- Run a local static server before deployment.
- Verify the deployed URL on desktop and mobile after publishing.

## Deployment

Publish the static files through an already authenticated zero-cost provider on the machine. Prefer a provider that gives an HTTPS URL without adding a large advertising bar. Verify the final URL after deployment and keep the repository independent of provider-specific runtime code.
