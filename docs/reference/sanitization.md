---
sidebar_position: 210
description: What the HTML Content (lite) visual strips from HTML and CSS payloads, and why.
slug: /sanitization
---

# Sanitization 🛡️

:::note Certified Visual Only
This page applies to [HTML Content (lite)](visual-editions#lite-certified), the certified edition of the visual.

The regular [HTML Content](visual-editions#regular) edition does **not** sanitize content - it passes values through to the Power BI custom-visual sandbox and relies on the sandbox as its only line of defense. This is the key behavioral difference between the two editions.
:::

HTML Content (lite) treats every value passed in from your data as untrusted input and runs it through a sanitizer before adding it to the DOM. This protects report viewers from cross-site scripting, data exfiltration, and content-spoofing attacks, and is required by Microsoft's AppSource certification rules.

## Where sanitization runs

There are three places where your content enters the visual and is sanitized:

1. Inline `style` attributes on any HTML element - for example, `<p style="color: red">`.
2. `<style>` tag bodies embedded in your HTML payload.
3. The custom stylesheet set via the [Stylesheet](properties-stylesheet) property.

All three go through the same CSS rule set. Inline attributes additionally pass through the HTML attribute allowlist.

## What's allowed

### HTML elements

The visual permits a specific set of block, inline, table, image/style, and SVG elements. The full list is on the [Accepted Tags](accepted-tags) page.

`<script/>`, `<iframe/>`, `<object/>`, `<embed/>`, `<link/>`, `<meta/>`, `<form/>`, and any element not on the allowed-tag list are dropped entirely, along with all their content.

From version 1.6.1 onwards, SMIL animation tags (`<animate/>`, `<animateMotion/>`, `<animateTransform/>`, `<set/>`) are permitted, with restrictions on which attributes they may target. The `attributeName` value is checked against a denylist that rejects animation against:

- URL-bearing attributes (`href`, `xlink:href`, `src`, `srcdoc`, `srcset`, `formaction`, `action`, `ping`, `background`, `poster`).
- The bulk `style` attribute.
- `url(#)`-resolving attributes (`cursor`, `clip-path`, `mask`, `filter`, `marker-*`).
- The meta `attributeName` itself.

This closes the `<animate attributeName="href" to="javascript:..."/>` bypass primitive. Safe animation targets include `opacity`, `transform`, `fill`, `stroke`, and most other CSS-property-style attributes.

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
- `data:` URIs are allowed for `<img src>` and equivalent image attributes, but with MIME-conditional encoding rules:
  - Raster MIME types (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/bmp`) must be **base64-encoded** (`data:image/png;base64,...`). A plain-text `data:image/png,<html>...</html>` is rejected because real binary image data cannot be plain-text - such a URI is always smuggling HTML or text behind an image declaration.
  - `image/svg+xml` is permitted from version 1.6.1 onwards and accepts `;base64,`, `;utf8,`, and bare-comma forms (SVG is text by spec). The inner SVG payload is recursively scanned and any `<script/>`, `<foreignObject/>`, or `<use/>` element is stripped. Malformed percent-encoding is rejected fail-closed.
- URL attributes are [NFKC-normalized](https://symbolfyi.com/guides/unicode-normalization-guide/) before scheme matching. This catches obfuscation attempts such as `<a href="ｊavascript:...">` (using a fullwidth `ｊ`), which would otherwise slip past a naive scheme check.
- All other schemes (`javascript:`, `vbscript:`, `livescript:`, `mocha:`, `blob:`, `file:`, `ftp:`, `mailto:`, `tel:`, etc.) are rejected.

## CSS-specific rules

### External URLs

`url(https://...)` and `url(http://...)` in any CSS property (`background`, `cursor`, `list-style-image`, and so on) are blocked. The certified-visual sandbox does not allow visuals to fetch resources from arbitrary external origins - an external URL triggers a Content Security Policy violation.

From version 1.6.1 onwards, the same restriction applies to SVG presentation attributes that accept functional-IRI values (`mask`, `clip-path`, `filter`, `marker-*`, and similar). An external `url(https://...)` inside an SVG presentation attribute is rejected by the funciri value-side scheme check, exactly as it would be in CSS.

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

### Multi-line and comma-separated selectors {#multi-line-selectors}

Multi-line CSS rules - selector lists broken across newlines, indented with tabs, or split across `\r\n` line endings - survive sanitization from version 1.6.1 onwards. For example:

```css
.a,
.b,
.c {
  color: red;
}
```

renders all three selectors. Prior to 1.6.1, the dangerous-selector check rejected CSS-spec whitespace control characters (TAB / LF / FF / CR) inside the `0x00-0x1F` range, which silently dropped any rule whose selector list spanned multiple lines. If you authored CSS that worked locally but lost rules in the visual on an older build, this is the fix.

### Default body styling {#default-body-styling}

The visual's body-styling properties (**Font family**, **Font size**, **Font color**, **Text alignment**) are applied to the body container by default. Inline `style` attributes on individual elements take precedence over these properties, which works for content with deliberate inline styling but can fall short for content generated by **Word**, **Outlook**, or **Teams** (these tools embed inline declarations on almost every element they emit).

From version 1.6.1 onwards, the [Override inline styles](properties-content-formatting#override-inline-styles) property forces the body-styling values through the DOM, overriding inline `style` declarations for `color`, `font-family`, `font-size`, `text-align`, and `background-color` via a `#htmlContent [style]` rule that applies `inherit !important` to those five properties. The toggle is disabled by default.

A [custom stylesheet](properties-stylesheet) always wins over both inline styles and this toggle - that is the recommended path when you need fine-grained control over which styles to override.

### Defense in depth

After the CSS sanitizer has parsed, walked, and re-serialized a stylesheet, a final regex scan runs over the output looking for known-dangerous tokens (`@import`, `expression(`, `javascript:`, `-moz-binding`, `behavior:`, `progid:`, etc.). If any match, the entire block is dropped and a `console.warn` is emitted. This is a safety net - the parser-based rules are the source of truth.

## Workarounds

- **I want a background image.** Convert your image to a base64 `data:image/...;base64,...` URI and embed it directly in the CSS.

- **I want a custom font.** Use the system font stack instead: `font-family: 'Segoe UI', Tahoma, Arial, sans-serif`. Custom web fonts via `@font-face` are blocked.

- **I want to import a shared stylesheet.** Copy the rules you need into your custom stylesheet directly.

- **I want to attach click handlers.** Use Power BI's built-in [cross-filtering and tooltip features](interactivity) instead. Inline event handlers cause the entire element to be dropped.

- **I want to use an SVG image inline.** From version 1.6.1, `data:image/svg+xml` is accepted on `<img src>`. Inline (`;utf8,`) and base64 encodings both work. The inner SVG is recursively scanned; `<script/>`, `<foreignObject/>`, and `<use/>` are stripped before rendering. Malformed percent-encoding rejects fail-closed.

- **I need a feature that the sanitizer rejects.** If the restriction is incompatible with your use case, the regular [HTML Content](visual-editions#regular) edition does not sanitize. Note that it is not certified and relies solely on the Power BI sandbox.

## Troubleshooting

### My inline `style="..."` is gone

Most likely one of:

- The value contained a `url(...)` referencing an external host or non-image data URI.
- The value contained `expression()`, `attr()`, `-moz-binding`, `behavior:`, or `filter: progid:`.
- The value contained a bare scheme like `javascript:` somewhere.

The visual emits `console.warn` messages explaining what was dropped - check the browser console.

### My `<style/>` tag is empty

The defense-in-depth pass matched a dangerous token in the final output. The whole `<style/>` body is replaced with empty.

A common cause is using `//` as a comment marker in your CSS. `//` is not a valid CSS comment - see the [FAQ entry](faq#style-block-disappeared) for the full explanation and the spec link. Use `/* ... */` block comments instead.

### My image isn't loading

Check the `src` value:

- External URLs (`http://`, `https://`) are blocked. Convert to a base64 data URI.
- `data:image/png,...` (or any other raster MIME type) without `;base64,` is rejected. Re-encode as base64.
- `data:image/svg+xml,...` is permitted from version 1.6.1 onwards. If your SVG isn't rendering, check whether it relied on `<script/>`, `<foreignObject/>`, or `<use/>` - those are stripped during the inner-payload scan. Malformed percent-encoding is also rejected.

### My SVG animation isn't running {#svg-animation-not-running}

SMIL animation tags (`<animate/>`, `<animateMotion/>`, `<animateTransform/>`, `<set/>`) are permitted from version 1.6.1, but their `attributeName` is checked against a denylist. The most common cause of a non-running animation is that the target attribute is on that denylist - see [HTML attributes](#html-attributes) above for the full list and the safe-target guidance.

### An entire element is missing

Most common causes:

- The element had an event handler (`onclick`, `onload`, etc.) - the entire element is dropped, not just the attribute.
- The element is not on the [allowed-tag list](visual-editions#lite-certified) (`<script/>`, `<iframe/>`, `<object/>`, etc.).

## Full reference

The [visual's repository](https://github.com/dm-p/powerbi-visuals-html-content/blob/main/docs/sanitization-rules.md) contains the exhaustive reference, including worked input/output examples auto-generated from the regression test corpus.

That document is generated from the sanitizer's rule sources and is gated by CI on every commit, so it cannot drift from the actual behavior. If you need the machine-checked rule set, always trust the upstream reference over a curated summary.
