# PBIR Implementation Guide — Design

**Status:** Approved design, pre-plan. The implementation plan derived from this document comes next.

**Goal:** A single new Reference page for the 2.0 (`next`) docs that teaches a person, a tool, or an LLM how to author HTML Content visuals directly in PBIR — modelled on Deneb's [PBIR Implementation Guide](https://deneb-viz.github.io/pbir-guide) (`deneb-viz.github.io/docs/deeper-concepts/pbir-guide.md`): quick reference first, then the simplest possible implementation, then flesh out the details one object at a time.

## Page identity

- **File:** `docs/reference/pbir-guide.md` — `next` docs only; `versioned_docs/version-1.6/` untouched.
- **Frontmatter:** title "PBIR Implementation Guide", slug `/pbir-guide`, description for SEO/recall.
- **Sidebar:** end of the Reference section, after the property card pages.
- **Scope banner:** warning admonition — guide is valid for HTML Content 2.0 and above.
- **Audience framing (intro):** manual editing, programmatic generation, LLM/tooling consumption, and report theme authoring — mirroring Deneb's intro.

## Structure

Sections in order:

1. **The Short Version** — quick-ref table of the minimum needed for a working visual: `visual.visualType` plus one projection in the `content` data role (no property is mandatory — a deliberate contrast with Deneb's required `jsonSpec`). Plus a pre-flight validation checklist (escaping, `D` suffix, single-quoted text, boolean literals).
2. **Visual GUIDs** — per documented edition:
   - HTML Content **Secure** (certified): `htmlContent443BE3AD55E043BF878BED274D3A6865`
   - HTML Content (**Regular**): `htmlContent443BE3AD55E043BF878BED274D3A6855`
   - Standalone edition is **not** documented (consistent with the v2 docs plan).
   - Notes: AppSource GUID matching means no visual assets need committing to the PBIP; the same `visual.json` can render differently between editions because of sanitization (link to Sanitization page).
3. **Understanding Visual Capabilities** — short explainer adapted from Deneb's.
4. **Staged walkthrough** — one running example, six stages, each stage a small valid `visual.json` delta introducing one object:
   1. **Bare visual** — dissect the JSON Desktop persists when the visual is added with nothing configured. What HTML Content auto-persists is captured empirically, not assumed.
   2. **Add content** — one-line inline DAX measure returning HTML plus a small category column (used by later stages). Shows `query.queryState.dataset` projections, `nativeQueryRef` vs `displayName` rename behaviour. Visual renders with default formatting. Model coverage stays at this minimal-inline-DAX level throughout — no TMDL authoring.
   3. **Templates** — `objects.templates`: `bodyTemplate` / `rowTemplate` literals with `{{content}}` / `{{row}}` tokens.
   4. **Stylesheet** — `objects.stylesheet`: CSS as an escaped text literal.
   5. **Cross-filtering** — `objects.crossFilter`: `enabled` (+ transparency props), meaningful because of the stage-2 category column.
   6. **fx-bound properties** — `bodyTemplate` and `stylesheet` driven by a measure via conditional formatting; documents the measure-bound expression JSON (captured from a real report). Deliberate addition with no Deneb equivalent.
5. **Properties reference** — full self-contained tables (Property / Default if omitted / Type / Remarks), one subsection per objects group, remarks linking to the UI-focused card pages:
   - `objects.contentFormatting` — `showRawHtml`, `enableDiagnostics`, `format`, `renderMode`, `fontFamily`, `fontSize`, `fontColour`, `align`, `overrideInlineStyling`, `hyperlinks`, `userSelect`, `noDataMessage`. The property-name ↔ format-pane-label mapping (e.g. which of `format` / `renderMode` is "Renderer" vs "On data update") is verified against visual source during implementation.
   - `objects.stylesheet` — `stylesheet`; `test` documented as verified from source (expected internal/editor state — flagged "managed by the visual", Deneb-`stateManagement`-style, if so).
   - `objects.templates` — `bodyTemplate`, `rowTemplate` → Templates page.
   - `objects.crossFilter` — `enabled`, `useTransparency`, `transparencyPercent` → Interactivity page.
   - `objects.compatibility` — `legacyRendering`, including the auto-classification-on-first-render behaviour (migrated visual ⇒ ON, fresh visual ⇒ OFF) → Compatibility page.
6. **Property Implementation Guide** — adapted from Deneb's: `boolean`, `color` (incl. `ThemeDataColor` theme binding), `integer` (`D` suffix), `text` (single-quote wrapping, escaping), plus the **fx-bound expression shape** as an additional type entry, and a Common Pitfalls list.

## Grounding & verification

- **Every JSON sample captured from a real report, never hand-written.** The implementation plan builds a throwaway PBIP, performs each walkthrough stage in Power BI Desktop, and lifts the persisted `visual.json` per stage (pbir CLI / Desktop tooling). This is also how stage 1's auto-persisted state and stage 6's fx expression shape are discovered.
- **Media:** one labelled SVG placeholder (rendered final stage) at `docs/reference/images/pbir-guide/`, following the v2 plan's swap-for-PNG convention.
- **Cross-links:** Sanitization, Templates, Stylesheet, Interactivity, Data Roles, Theme Colors, Compatibility.
- **Build gate:** `npm run build` (broken links throw) + the AGENTS.md warning grep.

## Out of scope

- TMDL / semantic-model authoring beyond the inline DAX measure.
- Standalone edition.
- Changes to versioned 1.6 docs, site chrome, or the change log (any change-log/blog mention of the new page is a release-time decision, not part of this design).

## Success criteria

A single self-contained Reference page where a reader (human or LLM) can go from nothing to a fully configured, cross-filtering, fx-bound HTML Content visual in PBIR — with every JSON sample known to load in Desktop, and the page passing the standard docs build gate.
