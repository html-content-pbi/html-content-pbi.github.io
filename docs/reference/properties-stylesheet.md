---
sidebar_position: 30
description: How to add a visual-level stylesheet, rather than at row-level.
slug: /properties-stylesheet
---

# Stylesheet

The **Stylesheet** property menu lets you add CSS at the top level, rather than managing styling in-line or contextually. You can do this either by using a measure (via conditional formatting) or by providing a CSS definition manually.

If you're using [Granularity](data-roles#granularity) (which uses div elements to separate rows), you can change the display behavior to create alternate layouts.

If we refer back to [our example from earlier](simple-example#option-1-create-context-using-granularity), this has one entry per value of **[Country]**, e.g.:

![sales-02-country-grain-html.png](../getting-started/images/simple-example/sales-02-country-grain-html.png "Creating a measure to display flag and total sales, based on Granularity.")

The body is contained in a `div` element with an `id` value of `htmlContent`. Each row in the visual dataset is contained within a `div` element with the class name `htmlViewerEntry`.

The CSS selectors for these elements are `#htmlContent` and `.htmlViewerEntry` respectively, and (as of 1.2) this can be confirmed by inspecting the raw HTML (using [Show Raw HTML](properties-content-formatting#show-raw-html) property).

For example, to change the flag layout to horizontal and display a background, we could create a measure like the following:

```dax
<CSS> Horizontal Flag = "
    #htmlContent {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .htmlViewerEntry {
        width: 100px;
        margin: 5px;
        padding: 5px;
        background-color: #eaeaea;
    }"
```

...and add this to the stylesheet property in the properties pane using conditional formatting and achieve the following result:

![stylesheet-flex-based-layout-example.png](./images/properties/stylesheet-flex-based-layout-example.png "Example of stylesheet applied to our flags sample. In this screenshot, the div elements have been set to display using flexbox layout.")

If we use the **Show Raw HTML** property, the stylesheet and output are combined for debugging, or to copy/paste elsewhere, e.g.:

```html
<style id="visualUserStylesheet" name="visualUserStylesheet" type="text/css">
  #htmlContent {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .htmlViewerEntry {
    width: 100px;
    margin: 5px;
    padding: 5px;
    background-color: #eaeaea;
  }
</style>
<div id="htmlContent">
  <div class="htmlViewerEntry">
    <div>
      <img src="https://www.countryflags.io/CA/flat/24.png" />
      <b>$24,887,655</b>
    </div>
  </div>
  <div class="htmlViewerEntry">
    <div>
      <img src="https://www.countryflags.io/FR/flat/24.png" />
      <b>$24,354,172</b>
    </div>
  </div>
  <div class="htmlViewerEntry">
    <div>
      <img src="https://www.countryflags.io/DE/flat/24.png" />
      <b>$23,505,341</b>
    </div>
  </div>
  <div class="htmlViewerEntry">
    <div>
      <img src="https://www.countryflags.io/MX/flat/24.png" />
      <b>$20,949,352</b>
    </div>
  </div>
  <div class="htmlViewerEntry">
    <div>
      <img src="https://www.countryflags.io/US/flat/24.png" />
      <b>$25,029,830</b>
    </div>
  </div>
</div>
```

:::info Stylesheet settings override simple content settings
If using the stylesheet property, the [styling options](properties-content-formatting#font-family) in the **Content formatting** menu are disabled and not applied to your output, so as to give you more explicit control and avoid potential conflicts that might be applied.
:::
