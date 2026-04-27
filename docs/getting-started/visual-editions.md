---
sidebar_position: 1
description: Learning about which visual to use for your Power BI use case.
slug: /visual-editions
---

# Visual Editions

HTML Content comes in two editions. These are separate AppSource visuals, so you can download and use the one that best suits your needs.

For both editions, the minimum required versions are:

- Power BI Desktop: November 2022
- Power BI Report Server: May 2023

### Regular

[View or download on AppSource](https://appsource.microsoft.com/en-us/product/power-bi-visuals/WA200001930)

This edition of the visual tries to provide as much functionality as possible within the custom visual sandbox. Note that Microsoft does impose some limitations on all custom visuals, not just certified vs. uncertified ones so it is not possible to do everything. You can learn more about these limitations on the [Limitations](limitations) page.

### Lite (Certified)

[View or download on AppSource](https://appsource.microsoft.com/en-us/product/PowerBIVisuals/coacervolimited1596856650797.htmlcontent_certified)

This edition is a reduced subset of available tags and no external comms. This is to [comply with Microsoft's certification rules](https://docs.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-certified?WT.mc_id=DP-MVP-5003712#source-code-requirements).

The available tags are:

<table>
  <tr>
    <td>
      <code>&lt;a/&gt;</code>
    </td>
    <td>
      <code>&lt;address/&gt;</code>
    </td>
    <td>
      <code>&lt;article/&gt;</code>
    </td>
    <td>
      <code>&lt;aside/&gt;</code>
    </td>
    <td>
      <code>&lt;b/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;base/&gt;</code>
    </td>
    <td>
      <code>&lt;bdi/&gt;</code>
    </td>
    <td>
      <code>&lt;bdo/&gt;</code>
    </td>
    <td>
      <code>&lt;blockquote/&gt;</code>
    </td>
    <td>
      <code>&lt;br/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;caption/&gt;</code>
    </td>
    <td>
      <code>&lt;cite/&gt;</code>
    </td>
    <td>
      <code>&lt;code/&gt;</code>
    </td>
    <td>
      <code>&lt;col/&gt;</code>
    </td>
    <td>
      <code>&lt;colgroup/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;data/&gt;</code>
    </td>
    <td>
      <code>&lt;dd/&gt;</code>
    </td>
    <td>
      <code>&lt;del/&gt;</code>
    </td>
    <td>
      <code>&lt;details/&gt;</code>
    </td>
    <td>
      <code>&lt;dfn/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;div/&gt;</code>
    </td>
    <td>
      <code>&lt;dl/&gt;</code>
    </td>
    <td>
      <code>&lt;dt/&gt;</code>
    </td>
    <td>
      <code>&lt;em/&gt;</code>
    </td>
    <td>
      <code>&lt;figcaption/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;figure/&gt;</code>
    </td>
    <td>
      <code>&lt;footer/&gt;</code>
    </td>
    <td>
      <code>&lt;header/&gt;</code>
    </td>
    <td>
      <code>&lt;hgroup/&gt;</code>
    </td>
    <td>
      <code>&lt;hr/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;h1/&gt;</code>
    </td>
    <td>
      <code>&lt;h2/&gt;</code>
    </td>
    <td>
      <code>&lt;h3/&gt;</code>
    </td>
    <td>
      <code>&lt;h4/&gt;</code>
    </td>
    <td>
      <code>&lt;h5/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;h6/&gt;</code>
    </td>
    <td>
      <code>&lt;i/&gt;</code>
    </td>
    <td>
      <code>&lt;img/&gt; *</code>
    </td>
    <td>
      <code>&lt;ins/&gt;</code>
    </td>
    <td>
      <code>&lt;kbd/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;li/&gt;</code>
    </td>
    <td>
      <code>&lt;main/&gt;</code>
    </td>
    <td>
      <code>&lt;mark/&gt;</code>
    </td>
    <td>
      <code>&lt;meter/&gt;</code>
    </td>
    <td>
      <code>&lt;nav/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;ol/&gt;</code>
    </td>
    <td>
      <code>&lt;output/&gt;</code>
    </td>
    <td>
      <code>&lt;p/&gt;</code>
    </td>
    <td>
      <code>&lt;pre/&gt;</code>
    </td>
    <td>
      <code>&lt;progress/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;q/&gt;</code>
    </td>
    <td>
      <code>&lt;rb/&gt;</code>
    </td>
    <td>
      <code>&lt;rp/&gt;</code>
    </td>
    <td>
      <code>&lt;rt/&gt;</code>
    </td>
    <td>
      <code>&lt;rtc/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;ruby/&gt;</code>
    </td>
    <td>
      <code>&lt;s/&gt;</code>
    </td>
    <td>
      <code>&lt;samp/&gt;</code>
    </td>
    <td>
      <code>&lt;search/&gt;</code>
    </td>
    <td>
      <code>&lt;section/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;small/&gt;</code>
    </td>
    <td>
      <code>&lt;span/&gt;</code>
    </td>
    <td>
      <code>&lt;strong/&gt;</code>
    </td>
    <td>
      <code>&lt;sub/&gt;</code>
    </td>
    <td>
      <code>&lt;summary/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;sup/&gt;</code>
    </td>
    <td>
      <code>&lt;table/&gt;</code>
    </td>
    <td>
      <code>&lt;tbody/&gt;</code>
    </td>
    <td>
      <code>&lt;td/&gt;</code>
    </td>
    <td>
      <code>&lt;tfoot/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;th/&gt;</code>
    </td>
    <td>
      <code>&lt;thead/&gt;</code>
    </td>
    <td>
      <code>&lt;time/&gt;</code>
    </td>
    <td>
      <code>&lt;tr/&gt;</code>
    </td>
    <td>
      <code>&lt;u/&gt;</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>&lt;ul/&gt;</code>
    </td>
    <td>
      <code>&lt;var/&gt;</code>
    </td>
    <td>
      <code>&lt;wbr/&gt;</code>
    </td>
    <td></td>
    <td></td>
  </tr>
</table>

\* can be used with [data URLs](https://developer.mozilla.org/en-US/docs/web/http/basics_of_http/data_urls). Content cannot be loaded from remote endpoints, in order to comply with visual certification rules. From version 1.6.0 onwards, the data URL must be base64-encoded (`data:image/png;base64,…`); plain-text variants are rejected.

All [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) tags should also be supported, with the exception of `<use/>`, `<script/>` and `<foreignObject/>`.

See the [Sanitization](sanitization) page for the full set of sanitization rules that apply to content and stylesheets.
