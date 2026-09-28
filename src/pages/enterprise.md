---
title: Enterprise and Security FAQ
description: Answers to the questions IT and security teams commonly ask when evaluating the HTML Content custom visual for Power BI
---

# Enterprise and Security FAQ

This page is the official statement for organizations evaluating HTML Content. It answers the questions we are most often asked by IT, security, and procurement teams, and it is intended to be shared directly with them.

HTML Content is a free, [open source](https://github.com/dm-p/powerbi-visuals-html-content) project released under the [MIT License](https://github.com/dm-p/powerbi-visuals-html-content/blob/main/LICENSE). It is provided as-is, without warranty or a service level agreement. We do not complete bespoke vendor questionnaires; if this page does not answer a question, or you believe something here is inaccurate, please [open an issue](https://github.com/dm-p/powerbi-visuals-html-content/issues) so that the answer can benefit everyone.

## A note on editions {#editions}

HTML Content is published as two separate AppSource visuals, and several answers below differ between them:

- **HTML Content** (the _Regular_ edition) renders the content supplied by the report author as written. It is not certified by Microsoft.
- **HTML Content Secure** (the _certified_ edition, named **HTML Content (lite)** prior to version 2.0) sanitizes all content before rendering it, and is certified by Microsoft.

A **standalone** build of the Regular edition is also published on GitHub for side-loading; it behaves identically to the Regular edition but is not connected to AppSource and does not update automatically.

The [Visual Editions](/docs/visual-editions) page compares them in author-facing terms. This page describes them in the terms a security review needs.

## Does HTML Content transmit, store, or process report data outside Power BI? {#data-handling}

No. **HTML Content** processes the data that Power BI passes to it entirely within the visual, in the user's browser or Power BI Desktop session, solely to render content. It does not collect, store, or transmit report data anywhere. There is no telemetry, no analytics, and no external service behind the visual, in any edition.

This applies without qualification to **HTML Content Secure**. For the Regular and standalone editions, content written by your own report authors can reference external resources, which is covered in the next answer.

See also our [Privacy Policy](/privacy-policy).

## Can HTML Content make external network requests? {#network-requests}

This is the most significant difference between the editions, and it is enforced by Power BI rather than by the visual's own code.

Every Power BI custom visual declares the privileges it requires in a capabilities manifest inside its package. **HTML Content** declares the following:

| Edition                         | Declared privileges                                     |
| ------------------------------- | ------------------------------------------------------- |
| HTML Content Secure (certified) | **None.** The manifest declares an empty privilege set. |
| HTML Content (Regular)          | `WebAccess`, scoped to all URLs (`*`).                  |
| Standalone build                | `WebAccess`, scoped to all URLs (`*`).                  |

**HTML Content Secure cannot reach external resources.** Because it declares no privileges, Power BI blocks outbound access from the visual regardless of what the content asks for. Content referencing a remote image or a remote stylesheet will simply not load it. This is a platform control, not a promise made by the visual, and it is verified by Microsoft as part of certification.

**The Regular and standalone editions declare web access for all URLs.** The visual itself never initiates a network request. Requests occur only where a report author's content causes one - an image `src`, an embedded frame, a web font, or a script that the author has written. Because a URL can carry information in its path, query string, or headers, content authored in these editions is capable of sending data to an external destination. Whether that happens is a function of the content your report authors write, not of the visual.

Organizations that need to prevent this outright have two options, described under [Guidance for IT and security teams](#guidance-for-it-and-security-teams): restrict the tenant to certified visuals, or manage approved packages as organizational visuals.

The manifest is not something you have to take on trust. A `.pbiviz` package is a zip archive; the capabilities manifest inside it can be inspected directly, for any edition and any version you are asked to approve.

## Can report content execute JavaScript? {#script-execution}

**HTML Content (Regular): yes.** The Regular edition renders author-supplied content as written, which includes `<script>` elements and inline event handlers such as `onclick` and `onerror`. These execute. This is long-standing behavior rather than an oversight, and it is documented for report authors in the [Scripting guidelines](/docs/scripting).

**HTML Content Secure: no.** The sanitizer removes `<script>` elements, and any element carrying an event-handler attribute is dropped entirely. See [Sanitization](/docs/sanitization).

Two points matter when assessing the risk this represents:

- **Content is authored, not user-supplied.** The HTML rendered by the visual comes from columns and measures in your own semantic model, written by your own report authors. It sits at the same trust boundary as a DAX measure or a Power Query step: someone with permission to author the report can already execute logic that shapes what viewers see. Treat **HTML Content** payloads as report code, authored by people you trust.
- **Everything runs inside Power BI's sandbox.** All custom visuals, certified or not, are hosted in a sandboxed `iframe` whose only enabled permission is `allow-scripts`. The visual has no access to the host report's DOM, cookies, or storage, and cannot act on the user's Power BI session. This constraint applies equally to both editions and is described in [Limitations](/docs/limitations).

## What does the certified edition sanitize? {#sanitization}

**HTML Content Secure** treats every value that arrives from your data as untrusted, parses it, and passes the whole tree through an allowlist-based sanitizer before any of it reaches the page. Sanitization covers four surfaces:

1. **HTML elements** - every tag is checked against an allowed-tag list; anything else is dropped along with its content.
2. **HTML attributes** - checked against global and per-element allowlists; disallowed attributes are removed, and some (event handlers among them) cause the whole element to be removed.
3. **URLs** - `href`, `src`, and `xlink:href` values are normalized and scheme-checked.
4. **CSS** - inline `style` attributes, `<style>` blocks within content, and the visual's custom stylesheet property are all sanitized against a shared rule set.

[Sanitization](/docs/sanitization) documents the rules in full, and [Accepted Tags](/docs/accepted-tags) lists the permitted elements. From version 2.0, the [Diagnostic information dialog](/docs/diagnostics) shows report authors exactly what the sanitizer removed from a given payload, which is also useful evidence during an internal review.

The Regular edition does not sanitize. It passes content through to the sandbox and relies on the sandbox as its only line of defense.

## Can HTML Content embed iframes or other third-party content? {#embedded-content}

Partly, and less than people expect. Power BI's own sandbox blocks a great deal regardless of edition: externally hosted `<script>` sources, `<object>` elements, modal windows and popups, and any embedded site that refuses to be framed or blocks cross-origin requests - YouTube among them. None of this is something the visual can change; it applies to every custom visual on the platform. [Limitations](/docs/limitations) covers it in detail, including which embeddable sources are known to work.

Within those platform limits, the Regular and standalone editions will render embedded content that a report author includes. **HTML Content Secure** does not: framing elements are not on the allowed-tag list, and the edition has no web access privilege in any case.

## What security reviews or certifications does HTML Content have? {#certification}

**HTML Content Secure is a [Microsoft-certified Power BI custom visual](https://learn.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-certified?WT.mc_id=DP-MVP-5003712).** Certification means every release is submitted to Microsoft, who review the source code and test the packaged visual for compliance before it is published to AppSource. Among other requirements, certified visuals must:

- Not access external services or resources, and not use `fetch` or `XMLHttpRequest`.
- Not use minified or obfuscated code, or dynamic code execution such as `eval`.
- Make the source code available to Microsoft for review, with the reviewed code matching the submitted package exactly.
- Run within Power BI's custom visual sandbox.

Certification is renewed with every release, and the tightening of Microsoft's certification rules over time is what drives changes to the sanitizer.

**HTML Content (Regular) is published on AppSource but is not certified**, and does not carry the benefits that certification brings, such as export to PowerPoint or PDF.

Neither edition holds SOC 2, ISO 27001, or comparable organizational certifications. **HTML Content** is a community open source project maintained by an individual, not a company, and those frameworks do not apply to it. The complete source is [public on GitHub](https://github.com/dm-p/powerbi-visuals-html-content), so your own security team is free to audit it independently.

## Are there any known security vulnerabilities? {#vulnerabilities}

Issues are tracked publicly in the [project's issue tracker](https://github.com/dm-p/powerbi-visuals-html-content/issues), which is the current list of what is known and what is being worked on.

The project does not currently publish a formal security policy, operate a private disclosure channel, or commit to response times. If you have a concern you would prefer not to raise in public, the maintainer's contact details are on the [Support](/docs/support) page.

The design points under [script execution](#script-execution) are the ones most relevant to assessing risk: in the Regular edition the report author controls what is rendered and executed, within the platform sandbox, and that is by design.

## Is HTML Content actively maintained? {#maintenance}

Yes. **HTML Content** has been published to AppSource since 2020 and developed continuously since, through to the current major version. Development is tracked openly on GitHub: the [Change Log](/docs/change-log) records what has shipped, and the [issue tracker](https://github.com/dm-p/powerbi-visuals-html-content/issues) shows what is open and planned. There is no formal long-term roadmap or support commitment beyond this.

**HTML Content** is developed and supported by its maintainer in their own time. The available help channels are listed on the [Support](/docs/support) page.

## If development were discontinued, would existing reports keep working? {#continuity}

The visual package is embedded in each Power BI report file that uses it, so existing reports continue to render with a working version of the visual regardless of whether development continues. Nothing in **HTML Content** depends on an external service that could be switched off.

For organizations that want full control over continuity, the `.pbiviz` package from a [GitHub release](https://github.com/dm-p/powerbi-visuals-html-content/releases) can be deployed as an [organizational visual](https://learn.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-organization?WT.mc_id=DP-MVP-5003712). This pins the version you have approved, is managed entirely within your tenant, and does not depend on AppSource availability. Because the source is MIT licensed, your organization is also free to fork, build, and maintain it yourselves.

We cannot make commitments on Microsoft's behalf regarding how AppSource handles delisted visuals, so organizational visuals are the recommended path where continuity guarantees are required.

## Could future Power BI updates break existing visuals? {#platform-changes}

Power BI custom visuals are built on a versioned API that Microsoft maintains with backward compatibility, and Microsoft communicates deprecations to visual developers in advance. **HTML Content** has tracked these changes since 2020 without loss of existing report functionality.

This risk is not zero, and it is not unique to **HTML Content**: any custom visual, and indeed any Power BI feature, is subject to platform evolution. The mitigations are the same as for the previous question - keep the visual updated via AppSource, or pin an approved version as an organizational visual and upgrade on your own schedule.

## How do we control which version runs? {#version-control}

There are three deployment routes, and they can be combined:

- **AppSource.** Users add the visual from the marketplace and Microsoft updates it on its own schedule. Lowest administrative effort, least version control.
- **Standalone package.** The standalone `.pbiviz` is published with each [GitHub release](https://github.com/dm-p/powerbi-visuals-html-content/releases) and side-loaded into a report. It does not update automatically, so the version is whatever was imported.
- **Organizational visuals.** An approved `.pbiviz` is uploaded to your tenant and made available to your users, with version changes under your control. This is the route to use where a specific version must be approved before it can be used.

Each edition, and the standalone build, is a distinct visual with its own identifier. They can be installed side by side without interfering with each other, and a report can use more than one.

## Guidance for IT and security teams {#guidance-for-it-and-security-teams}

Share this page. In addition, the following Power BI tenant controls are relevant:

- **Restrict to certified visuals only.** The [tenant setting](https://learn.microsoft.com/en-us/power-bi/admin/organizational-visuals?WT.mc_id=DP-MVP-5003712) _Add and use certified visuals only_ ensures users can add only visuals that have passed Microsoft's certification. HTML Content Secure qualifies; the Regular edition does not.
- **Use organizational visuals for approved versions.** If you need to control exactly which version runs, or want to permit the Regular edition under governance, deploy an approved package as an [organizational visual](https://learn.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-organization?WT.mc_id=DP-MVP-5003712).
- **Inspect the package.** A `.pbiviz` is a zip archive. The capabilities manifest inside it declares the privileges the visual requests, which is the control described under [external network requests](#network-requests).
- **Audit the source.** Everything **HTML Content** ships is in the [public repository](https://github.com/dm-p/powerbi-visuals-html-content), including the code submitted for each certified release.
- **Govern the content, not just the visual.** In the Regular edition, what the visual renders and executes is determined by the measures your report authors write. The relevant control is who is permitted to author content in the semantic models that feed it.
