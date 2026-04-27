---
sidebar_position: 45
description: What the HTML Content (lite) visual strips from HTML and CSS payloads, and why.
slug: /sanitization
---

# Sanitization

This page applies to [HTML Content (lite)](visual-editions#lite-certified), the certified edition of the visual. The regular [HTML Content](visual-editions#regular) edition does **not** sanitize content - it passes values through to the Power BI custom-visual sandbox and relies on the sandbox as its only line of defense. This is the key behavioral difference between the two editions.

HTML Content (lite) treats every value passed in from your data as untrusted input and runs it through a sanitizer before adding it to the DOM. This protects report viewers from cross-site scripting, data exfiltration, and content-spoofing attacks, and is required by Microsoft's AppSource certification rules.

## Where sanitization runs

There are three places where your content enters the visual and is sanitized:

1. Inline `style` attributes on any HTML element - for example, `<p style="color: red">`.
2. `<style>` tag bodies embedded in your HTML payload.
3. The custom stylesheet set via the [Stylesheet](properties-stylesheet) property.

All three go through the same CSS rule set. Inline attributes additionally pass through the HTML attribute allowlist.

## What's allowed

### HTML elements

The visual permits a specific set of block, inline, table, image/style, and SVG elements. The full list is on the [Visual Editions](visual-editions#lite-certified) page.

`<script/>`, `<iframe/>`, `<object/>`, `<embed/>`, `<link/>`, `<meta/>`, `<form/>`, and any element not on the allowed-tag list are dropped entirely, along with all their content.

### HTML attributes

Global attributes allowed on every permitted element: `class`, `id`, `title`, `lang`, `dir`, `style`, `role`, `tabindex`, anything matching `aria-*`, anything matching `data-*`.

Element-specific attributes are allowed on a per-element basis. A few of the common ones:

| Element            | Attributes                                              |
| ------------------ | ------------------------------------------------------- |
| `<a/>`             | `href`, `target`, `rel`, `download`, `hreflang`, `type` |
| `<img/>`           | `src`, `alt`, `width`, `height`, `loading`, `decoding`  |
| `<del/>`, `<ins/>` | `cite`, `datetime`                                      |
| `<time/>`          | `datetime`                                              |
| `<output/>`        | `for`, `form`, `name`                                   |
| `<meter/>`         | `value`, `min`, `max`, `low`, `high`, `optimum`         |
| `<progress/>`      | `value`, `max`                                          |
| `<details/>`       | `open`                                                  |
| `<table/>` cells   | `colspan`, `rowspan`, `headers`, `scope`                |
| SVG elements       | The standard SVG attribute set for each element         |

Anything not on the global or element-specific list is dropped.

A handful of attributes are **stripped from every element regardless of context**, because they always carry risk:

- `srcdoc` - embeds an HTML document inside an attribute that then executes as a real document.
- `formaction`, `action` - form submission targets, used to redirect submitted data to attacker-controlled URLs.
- `ping` - fires network requests to arbitrary URLs when an `<a/>` is clicked.
- `background` - legacy HTML URL-loading attribute.
- `poster` - loads an external image before playback.
- `srcset` - use plain `src` instead.

Any attribute matching `on*` (`onclick`, `onload`, `onerror`, `onmouseover`, etc.) causes the entire element to be dropped - not just the attribute. A tag with a stripped event handler can still produce errors if it loads a now-orphaned `src`/`href`, so removing the element outright is safer.

### URL schemes

For attributes that carry URLs (`href`, `src`, `xlink:href`):

- `https:` and `http:` are allowed for `<a href>`. Power BI's `launchUrl()` API handles the navigation - see [Allow opening URLs](properties-content-formatting#allow-opening-urls).
- `data:` URIs are allowed for `<img src>` and equivalent image attributes, but only if:
  - The MIME type is `image/png`, `image/jpeg`, `image/gif`, `image/webp`, or `image/bmp`. `image/svg+xml` is rejected because SVG can carry scripts.
  - The URI is **base64-encoded** (`data:image/png;base64,...`). A plain-text `data:image/png,<html>...</html>` is rejected because real binary image data cannot be plain-text - such a URI is always smuggling HTML or text behind an image declaration.
- URL attributes are **NFKC-normalized** before scheme matching. This catches obfuscation attempts such as `<a href="ｊavascript:...">` (using a fullwidth `ｊ`), which would otherwise slip past a naive scheme check.
- All other schemes (`javascript:`, `vbscript:`, `livescript:`, `mocha:`, `blob:`, `file:`, `ftp:`, `mailto:`, `tel:`, etc.) are rejected.

## CSS-specific rules

### External URLs

`url(https://...)` and `url(http://...)` in any CSS property (`background`, `cursor`, `list-style-image`, and so on) are blocked. The certified-visual sandbox does not allow visuals to fetch resources from arbitrary external origins - an external URL triggers a Content Security Policy violation.

**Workaround:** embed images as base64 `data:image/...;base64,...` URIs.

### Non-image data URIs

A `data:` URI inside CSS `url()` is only accepted if its MIME type is on the image allowlist. This catches three categories of attack:

- `data:text/html,<script>...</script>` smuggling executable HTML.
- `data:image/png,<html>...</html>` declaring an image MIME but carrying plain text.
- `data:image/svg+xml,...` declaring an image MIME but carrying SVG (which can contain `<script/>`).

### `@import` and `@font-face`

Both load external resources by design - `@import` pulls in remote CSS, `@font-face` pulls in remote font files - and are commonly used in CSS exfiltration attacks. Both are blocked.

**Workaround:** copy the CSS rules you need into your stylesheet directly, and use the system font stack (`'Segoe UI', sans-serif`) instead of custom web fonts.

### Other at-rules

The only at-rules permitted are `@media`, `@supports`, `@keyframes`, `@-webkit-keyframes`, `@font-feature-values`, and `@page`. Everything else (`@namespace`, `@charset`, `@document`, and any unknown at-rule) is dropped.

### Legacy IE / Mozilla extensions

`expression()`, `-moz-binding`, `behavior`, and `filter: progid:DXImageTransform.*` all enable script execution in legacy browsers and are blocked regardless of the rendering target.

### The `attr()` function

Although `attr()` is a standard CSS function, it is rejected. It has historically been used to read element attribute values during CSS rendering - for example, to exfiltrate `data-*` attributes via a generated-content side-channel.

### Defense in depth

After the CSS sanitizer has parsed, walked, and re-serialized a stylesheet, a final regex scan runs over the output looking for known-dangerous tokens (`@import`, `expression(`, `javascript:`, `-moz-binding`, `behavior:`, `progid:`, etc.). If any match, the entire block is dropped and a `console.warn` is emitted. This is a safety net - the parser-based rules are the source of truth.

## Workarounds

- **I want a background image.** Convert your image to a base64 `data:image/...;base64,...` URI and embed it directly in the CSS.

- **I want a custom font.** Use the system font stack instead: `font-family: 'Segoe UI', Tahoma, Arial, sans-serif`. Custom web fonts via `@font-face` are blocked.

- **I want to import a shared stylesheet.** Copy the rules you need into your custom stylesheet directly.

- **I want to attach click handlers.** Use Power BI's built-in [cross-filtering and tooltip features](interactivity) instead. Inline event handlers cause the entire element to be dropped.

- **I need a feature that the sanitizer rejects.** If the restriction is incompatible with your use case, the regular [HTML Content](visual-editions#regular) edition does not sanitize. Note that it is not certified and relies solely on the Power BI sandbox.

## Troubleshooting

### My inline `style="..."` is gone

Most likely one of:

- The value contained a `url(...)` referencing an external host or non-image data URI.
- The value contained `expression()`, `attr()`, `-moz-binding`, `behavior:`, or `filter: progid:`.
- The value contained a bare scheme like `javascript:` somewhere.

The visual emits `console.warn` messages explaining what was dropped - check the browser console.

### My `<style/>` tag is empty

The defense-in-depth pass matched a dangerous token in the final output (often something smuggled through a CSS comment). The whole `<style/>` body is replaced with empty.

### My image isn't loading

Check the `src` value:

- External URLs (`http://`, `https://`) are blocked. Convert to a base64 data URI.
- `data:image/svg+xml,...` is blocked. Use PNG or JPEG instead.
- `data:image/png,...` without `;base64,` is rejected. Re-encode as base64.

### An entire element is missing

Most common causes:

- The element had an event handler (`onclick`, `onload`, etc.) - the entire element is dropped, not just the attribute.
- The element is not on the [allowed-tag list](visual-editions#lite-certified) (`<script/>`, `<iframe/>`, `<object/>`, etc.).

## Full reference

The [visual's repository](https://github.com/dm-p/powerbi-visuals-html-content/blob/main/docs/sanitization-rules.md) contains the exhaustive reference, including 88 worked input/output examples auto-generated from the regression test corpus.
