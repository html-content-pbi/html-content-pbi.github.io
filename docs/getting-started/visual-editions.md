---
sidebar_position: 1
description: Learning about which visual to use for your Power BI use case.
slug: /visual-editions
---

# Visual Editions

HTML Content comes in two editions. These are separate AppSource visuals, so you can download and use the one that best suits your needs.

For both editions, the minimum required versions are:

- Power BI Desktop: July 2024
- Power BI Report Server: September 2024

## Regular

[View or download on AppSource](https://appsource.microsoft.com/en-us/product/power-bi-visuals/WA200001930)

This edition of the visual tries to provide as much functionality as possible within the custom visual sandbox. Note that Microsoft does impose some limitations on all custom visuals, not just certified vs. uncertified ones so it is not possible to do everything you can do in a regular web application. You can learn more about these limitations on the [Limitations](limitations) page.

## Lite (Certified) 🛡️

[View or download on AppSource](https://appsource.microsoft.com/en-us/product/PowerBIVisuals/coacervolimited1596856650797.htmlcontent_certified)

This is a build of the visual, with a reduced subset of supported tags and no external comms that [complies with Microsoft's certification rules](https://docs.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-certified?WT.mc_id=DP-MVP-5003712#source-code-requirements) for those who can only work with certified visuals.

- See [Accepted Tags](accepted-tags) for the full set of HTML and SVG tags supported by this edition.
- See [Sanitization](sanitization) for how content and stylesheets are filtered.

## When to choose which edition {#when-to-choose}

Both editions render rich, dynamic HTML in your Power BI reports. The right choice depends on what you need from the visual.

**Choose Lite (Certified) if you need any of:**

- Microsoft AppSource certification for distribution within your organisation.
- [Export to PowerPoint or PDF](https://learn.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-certified#why-should-i-care-about-getting-my-visual-certified?WT.mc_id=DP-MVP-5003712) of reports that include the visual.
- To comply with a tenant policy that blocks uncertified custom visuals.

**Choose Regular if you need any of:**

- External content such as remote images, web fonts, or iframes.
- The broadest HTML, CSS, and SVG surface the Power BI custom-visual sandbox permits.
- Features rejected by the lite sanitizer (see [Sanitization](sanitization) and [Limitations](limitations) for details).

If you are unsure, start with **Lite (Certified)** - you can switch to **Regular** if you hit a sanitizer rejection you cannot work around. The two editions are separate AppSource visuals, so switching is a matter of installing the other one and re-pointing your report.
