---
sidebar_position: 120
description: Guidelines for using scripts in the Regular edition of the HTML Content custom visual.
slug: /scripting
---

# Scripting (Regular Edition)

:::warning Regular edition only
This page applies only to the **Regular** edition of the visual. **HTML Content Secure** deliberately [strips scripts as part of certification](sanitization) - nothing on this page applies to it.
:::

The Regular edition renders author-supplied content _as written_. That includes embedded `<script>` elements and inline event handlers (`onclick`, `onerror`, …), which **execute**. This is not a formally supported feature, but it works reliably, and this page documents how and why - so authors can build interactive content (in-DOM filtering, modals, progressive disclosure) on top of a measure-driven UI.

## Edition Behavior {#edition-behavior}

| Edition            | `<script>`               | Inline `on*` handlers | `<style>` / custom CSS    |
| ------------------ | ------------------------ | --------------------- | ------------------------- |
| Regular            | **runs**                 | **fires**             | rendered as-is            |
| Secure (Certified) | removed by the sanitizer | element dropped       | [sanitized](sanitization) |

In the Regular edition the sanitizer is never invoked - not for the DOM and not for the [stylesheet](properties-stylesheet). Content is the author's responsibility.

## Why Scripts Execute {#why-scripts-execute}

The visual turns an HTML string into DOM with `Range.createContextualFragment()`. Unlike `innerHTML` or `DOMParser`, fragments produced this way contain **executable** `<script>` nodes: the script runs the moment the fragment is connected to the live document. This is a well-known XSS sink - and precisely why the Secure edition sanitizes content to neutralize it. The Regular edition skips sanitization, so scripts survive and run.

## Execution Model {#execution-model}

- **A `<script>` runs once**, when its node is first inserted into the live DOM.
- **Order:** the [Body template](properties-templates#body-template) is inserted first, then each row. Define shared functions in the body template; per-row scripts can then call them.
- **Render mode** ([Content formatting > On data update](properties-content-formatting#on-data-update)):
  - **Rebuild content** - everything is re-parsed and re-inserted on each update, so every script re-runs.
  - **Preserve unchanged content** - only changed rows are re-inserted, so only their scripts re-run. The body/global script persists and does **not** re-run; unchanged rows keep their DOM and any in-page state.
- **Inline `on*` handlers** fire on the event, every time - no execution-timing caveat.
- Everything runs inside the visual's **sandboxed iframe**; scripts cannot reach the Power BI host page. See [Limitations](limitations) for what the sandbox permits.

## Recommended Pattern {#recommended-pattern}

Pair [Templates](properties-templates) with scripting like this:

1. **Body template** - emit one `<script>` that _defines_ your shared functions once (and assigns them to `window` if rows reference them by name).
2. **Content measure (per row)** - emit a tiny `<script>` that only _calls_ a shared function to initialise that row. Do **not** redefine shared functions per row.
3. **Row template** - `{{row}}`, so the content's own root element is the row.

A generic shape - a shared namespace defined once, called per row:

```text
Body template  -- toolbar/header with onclick="app.filterBy('groupA')" ...
               -- <div class="rows">{{content}}</div>
               -- <script>
                    window.app = {
                      filterBy(key) { /* in-DOM show/hide of rows */ },
                      initRow(el)   { /* collapse detail, wire local handlers */ }
                    };
                  </script>

Content (one   -- <div class="row" id="row_{key}" data-group="...">
row)                 ... row markup, detail, modal ...
                     <script>app.initRow(document.getElementById('row_{key}'))</script>
                  </div>
```

The toolbar's `onclick` calls a shared function to filter rows in the DOM; each row's init script wires up just that row. Because each row's root element is also the visual's selectable node, native [cross-filtering](interactivity#cross-filtering) works alongside the JavaScript.

## Reading Theme Colors in Script {#reading-theme-colors}

The visual publishes the report's theme palette as [`--pbi-theme-*` CSS variables](theme-colors). Consuming them in CSS works in every edition, but CSS alone can't turn a variable into a _value_ you can compute with. A script can - useful when you draw to a `<canvas>`, build inline SVG, or derive a color:

```js
const styles = getComputedStyle(document.documentElement);
const fg = styles.getPropertyValue("--pbi-theme-fg").trim(); // e.g. "#252423"
const c1 = styles.getPropertyValue("--pbi-theme-color-1").trim();
// ...use fg / c1 in canvas fillStyle, an SVG attribute, etc.
```

The values update on the next visual update after a theme or high-contrast change, so re-read them rather than caching across updates.

## Debugging {#debugging}

Use the visual's own [Diagnostics](diagnostics) surface:

- The [Console tab](diagnostics#console-tab) captures your scripts' `console.log`/`warn`/`error` output while diagnostics is active.
- The [Raw HTML tab](diagnostics#raw-html-tab) shows the exact processed markup the visual rendered, so you can confirm your measure produced the HTML you expected.
- The [Events tab](diagnostics#events-tab) logs visual updates and interactivity events, so you can see when and why the visual re-rendered.

## Gotchas {#gotchas}

- **Single-root rows** - with `{{row}}` passthrough, the content must have exactly **one** root element - that element becomes the row's keyed node (and its selectable node for cross-filter). Nest any modals/scripts **inside** that root, not as siblings.
- **Cross-filter vs. inner clicks** - the row's root is the selectable node. If an inner control (link, button) must _not_ trigger cross-filter, call `event.stopPropagation()` in its handler - or, more simply, mark the element `data-hc-suppress="filter"` (use `"all"` for an overlay like a modal). The declarative form needs no script, also covers the context menu and tooltip, and works in the Secure edition too. See [Suppressing Interactivity on Specific Elements](interactivity#suppressing-interactivity).
- **Preserve unchanged content + reorder** - a row that _moves_ during an update in this mode is detached and reattached, so its scripts/iframes re-run. Updates that don't reorder rows preserve them.
- **Trust** - the Regular edition runs whatever the content contains. Treat the measures that build your HTML/JS as code you own. Never point it at untrusted or user-supplied HTML.
