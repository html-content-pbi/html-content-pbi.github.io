---
sidebar_position: 10
description: HTML Content custom visual frequently asked questions (FAQ).
slug: /faq
---

# Frequently Asked Questions

## General

### How Much Does the Visual Cost?

It's free. [And open source](https://github.com/dm-p/powerbi-visuals-html-content).

All development, promotion, and [support](./support) I provide for the visual are done in my spare time. If you find the visual useful for your needs, or would like me to spend more time developing and supporting it, [it is possible to sponsor me](https://github.com/sponsors/dm-p) or [Buy Me A Coffee](https://www.buymeacoffee.com/dmp) ☕.

### Will the Visual be Certified?

There is a separate edition of the visual in AppSource, named **HTML Content (lite)**, which is certified. This version has a reduced feature set compared to the regular edition, but still complies with Microsoft's rules for certified visuals. You can read more about the differences between the two editions on the [Visual Editions](visual-editions) page.

For the regular edition of the visual, this cannot be certified under the current rules. This allows you to write as much HTML as the Microsoft custom visual sandbox permits. As such, this does not conform to [the current rules](https://docs.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-certified?WT.mc_id=DP-MVP-5003712#source-code-requirements), specifically:

> _Accessing external services or resources. For example, no HTTP/S or WebSocket requests can leave Power BI for any services._

Whilst the visual does not do this in its source code (as per the [Privacy Policy](/privacy-policy)), a user can write HTML that could access externally hosted content such as images, and this is not permitted under certification.

### Is the Visual Supported?

I develop and support the visuals in my free time, so they are subject to the [MIT License](https://en.wikipedia.org/wiki/MIT_License). Both editions are free of charge and [open source](https://github.com/dm-p/powerbi-visuals-html-content). If you need to use HTML-based visuals that are formally supported, then there are commercial alternatives detailed on [the support page](support).

If you have a feature request for the visual or are experiencing an issue, then [the support page](support) also contains information on this. Please remember that [there are limitations in Power BI](limitations) that prevent some types of content, and we can't do much about them. Please be sure to check that page first to see if what you're trying to do is possible.

I'll always try to keep the visual as up to date as possible, making sure it runs on the latest versions of Power BI.

## Content

### Hyperlinks Don't Work!

Custom visuals aren't allowed to open hyperlinks arbitrarily, but we have an [Allow opening URLs](properties-content-formatting#allow-opening-urls) property that can help in some cases. There are some considerations for this as well, but everything currently known is covered in the linked documentation.

### Why Can't I Embed this Particular Video/Web Page/Other Ambitious Thing?

Custom visuals have several restrictions imposed by Power BI, so unfortunately, some things just won't work. There's [a page dedicated to the limitations we know about](limitations), which may help you determine whether you're trying to do something the visual cannot.
