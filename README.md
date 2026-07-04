# Page Studio

A lightweight landing page studio built with Next.js (App Router), Redux Toolkit, Contentful, Tailwind, and shadcn/ui.

## Architecture

- **Contentful adapter** (`contentfulClient.ts`) isolates all CMS logic.
- **Zod schemas** validate pages and sections at runtime.
- **Section registry** maps section types to React components.
- **Redux** manages draft editing state across three slices: `draftPage`, `ui`, `publish`.
- **RBAC** enforced via server-side API route and UI-based role display.

## Redux Slices

- `draftPage` – current page structure, add/remove/reorder/edit sections.
- `ui` – selected section ID.
- `publish` – publish status and last version.

## Contentful Model

Content type `pageStudio` contains title, slug, and a references field for sections. Section content types: hero, featureGrid, testimonial, cta. The adapter maps them to internal types.

## Publish & SemVer

- Deterministic diff between previous published sections and current draft.
- Rules: patch for text changes, minor for additions, major for removals/type changes.
- Immutable snapshots saved as JSON in `public/releases/<slug>/<version>.json`.

## Accessibility

- Full keyboard operability, visible focus states, logical heading hierarchy.
- `prefers-reduced-motion` respected.
- Axe CI test ensures zero critical violations (WCAG 2.2 AAA-oriented).

## Incomplete / Known Limitations

- Real authentication replaced by cookie-based simulated roles.
- No undo/redo functionality.
- Section reordering uses up/down buttons, not drag-and-drop.
- Only Hero and CTA props are editable (per sprint scope).