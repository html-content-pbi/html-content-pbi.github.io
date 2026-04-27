---
sidebar_position: 30
description: HTML Content custom visual change log.
slug: /change-log
---

# Change Log

## 1.6.0 (2025-04-03)

### Markdown Rendering

You can now specify whether to render your content using HTML (default) or Markdown. Refer to the [Content Formatting](properties-content-formatting#renderer) page to read more about this.

### HTML Content (lite)-Specific Changes (2026-04-25)

<!-- :::info Pending Approval
**HTML Content (lite)** is still under Microsoft's certification review. The changes below will apply once it has been approved; the regular edition is already live.
::: -->

#### Stricter Content Sanitization

Ongoing refinement of Microsoft's custom-visual certification rules has driven a round of sanitization tightening. A [Sanitization](sanitization) page has also been added to fully document this and keep track of things as these rules are updated.

#### New Tags

Several tags were found to be missing from the safe list and have been added: `<del/>`, `<details/>`, `<ins/>`, `<meter/>`, `<output/>`, `<progress/>`, `<search/>`, `<summary/>`. An SVG filter primitive (`<feMergeNode/>`) that was misspelled in the safe list has also been restored.

#### Bugs Fixed

- Fixed an issue in HTML sanitization where the `<feDisplacementMap/>` SVG tag was not being correctly processed.

## 1.5.0 (2024-04-29)

### Minor Enhancements

- [Multi-selection support](https://learn.microsoft.com/en-us/power-bi/developer/visuals/supportsmultivisualselection-feature) has been added.
- [Keyboard navigation support](https://learn.microsoft.com/en-us/power-bi/developer/visuals/supportskeyboardfocus-feature) has been added.
- The properties pane has been updated to use formatting cards.

### Bugs Fixed

- The default font name (Segoe UI) has been fixed to show as the default in the **Content formatting** > **Font family** property.

## 1.4.1 (2023-09-20)

### Minor Enhancements

- DIN has been added as a valid font (you can use either `din` or `wf_standard-font` in your styling to use).

### Bugs Fixed

- Iframe display functionality was failing due to breaking changes to the custom visuals APIs in 1.4.0. This has been restored, but note that the [previous restrictions on iframes will still apply](limitations).

## 1.4.0 (2023-08-04)

### Interactivity

Interactivity features for Power BI have been introduced, which provide some additional capabilities for your designs:

- Tooltips
- Cross-filtering
- Context menu and drillthrough

Note that these have their own considerations, depending on how you are configuring your visual, so please refer to the [Interactivity](interactivity) page for more information.

### Bugs Fixed

- If your page has right-to-left direction (or you are styling the visual's `<body>` element manually to achieve this), the scrollbars will now be rendered on the correct side.

### HTML Content (lite)-Specific Changes

These are only relevant to **HTML Content (lite)**, which is the [certified edition](visual-editions#lite-certified) of HTML Content.

- Most available HTML attributes have been enabled, with the exception of anything that can be used for scripting (due to certification limitations).
- SVG elements are now available. The following tags are unavailable due to potential XSS vulnerabilities:
  - `<foreignObject>`
  - `<script>`
  - `<use>`

## 1.3.0 (2023-06-05)

### HTML Content (lite): Certified Edition 🚀

A new edition of the visual named **HTML Content (lite)** is available in AppSource, which is a certified version of the visual. This is almost identical to the standard edition, but with a reduced set of available tags and attributes, to comply with Microsoft's certification requirements. You can read more about the differences between the two editions on the [Editions](visual-editions) page.

Due to the required visual APIs needed to support this edition, the minimum required versions are:

- Power BI Desktop: November 2022
- Power BI Report Server: May 2023

Note that as all changes in this version pertain to the certified edition, the standard edition will remain at version 1.2.1.

## 1.2.1 (2021-07-16)

### Bugs Fixed

- 1.2.0 was using the latest Power BI Visuals API (3.8.0) but some versions of Power BI (e.g. Report Server) haven't caught up yet, so this has been reverted to 3.5.1.

## 1.2.0 (2021-05-24)

### Allow Text Select

The **Content formatting** menu now includes an [**Allow text select** property](properties-content-formatting#allow-text-select), which if enabled, will allow users to highlight text using their mouse. Highlighted text can be copied to the clipboard with **Ctrl + C** (or system equivalent).

### Stylesheet

You can now apply a stylesheet independently to your content, via the properties pane. This can be either manually typed, or supplied via conditional formatting.

Refer to the [Stylesheet](properties-stylesheet) page for more information on how this works, and how to set up.

### Show Raw HTML

[A new **Show raw HTML** property](properties-content-formatting#show-raw-html) is available under the **Content formatting** property menu. If enabled, the generated HTML is now displayed in a read only `textarea` element.

## 1.1.0 (2021-01-05)

### "No Data" Message

Previously, the message displayed if there was no data available was hard-coded. The visual has now been modified to expose a **"No Data" Message** property. You can read more about how to use this feature on the [**Content Formatting**](properties-content-formatting#no-data-message) page.

### Default Title No Longer Used

When creating a new instance of the visual, the title will no longer be shown be default (like for the table visual). This can be enabled or modified in the usual way in the properties pane.

## 1.0.2 (2020-08-28)

### Sorting

Sorting has been added to the visual, which is accessible from the visual header in the usual way, and will now permit you to sort by any measures or columns added to the visual's fields.

### Bugs Fixed

- The visual would not render ordered (`<ol/>`) or unordered (`<ul/>`) line item (`<li/>`) elements due to styling applied higher up in the custom visual host container. This has been resolved to work as expected.

## 1.0.1 (2020-07-28)

Initial version released to the Power BI Marketplace.
