---
sidebar_position: 2
description: A worked example for using columns or measures from the data model.
slug: /simple-example
---

# Simple Worked Example

## Finished Product

This example is designed to show you how to start creating simple content and then apply more advanced DAX. With a working knowledge of HTML and CSS, you will be able to get very creative. On this page, we'll get into the basics of creating HTML-based columns and measures.

The sample workbook is shown below, and you can navigate through the pages to see our example built step by step. You can [download the sample workbook here](/pbix/HTML-Content-Data-Model-Walkthrough-2.0.pbix) if you want to do your own thing.

---

<div align="center">
<iframe title="HTML-Content-Data-Model-Walkthrough-2.0" width="800" height="636" src="https://app.powerbi.com/view?r=eyJrIjoiNjFiNzQyMmUtYTE0OS00MTk0LWI4NWYtYTc1MzUzOWRlZGI1IiwidCI6IjUzYmJlMGQ3LTU0NzItNGQ0NS04NGY0LWJiNzJiYjFjMjI4OSJ9" frameborder="0" allowFullScreen="true"></iframe>
</div>

---

:::warning Regarding Image URLs in Our Example
For our example (and for simplicity), **we are using the [regular (uncertified) edition](visual-editions#regular) of HTML Content**. This can access image URLs by their web address, provided that they are publicly available and not subject to any cross-domain restrictions on the third-party site.

Your mileage may vary if using the [certified edition](visual-editions#lite-certified) due to these restrictions. As such, you may need to consider using a [data URL](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data) in place of a direct resource URL.
:::

## Sample Data

We'll start off with some simple data from our model:

![html-sample-data.png](./images/simple-example/html-sample-data.png "Sample data, showing country, two-digit code and a total sales measure.")

The `[Country]` and `[Country Code]` columns are fields from our data model, and `[$ Sales]` is a simple `SUM()` measure that calculates total sales for the current row context.

## Making the Country Flag

Let's say we want to represent the country with its flag using some images we have stored on the HTML Content website. We can create a calculated column as follows:

```dax
<HTML> Country Flag 16px =
   "<img height='16' src='https://html-content.com/img/flags/"
        & Demographic[Country Code]
        & ".png'>"
```

:::note Use A Sensible Semantic Modeling Approach
Note that the column doesn't have to have the `<HTML>` prefix. It's good practice to prefix names with units to denote the type of value they return, like a `$`, `#`, etc. This is my preferred prefix to indicate that the object returns HTML when inspected in model view.
:::

We can now add this to the HTML Content visual's **Values** data role, and we'll see a flag for each value of `Demographic[Country Code]`, e.g.:

![flag-01-add-column.png](./images/simple-example/flag-01-add-column.png "An HTML column that generates a flag from a remote API, rendered in our visual.")

:::note DAX and Double Quotes
Note that while conventional HTML might use double quotes (`"`) for attribute values, these need to be escaped in DAX by using `""` for every occurrence of a double quote character. This can be tricky to keep track of in more advanced use cases.

Because single quotes are valid in the W3C HTML specification, I'll use this format going forward to make my example DAX code easier to manage. If you do want to use double quotes, the above could also be written as:

```dax
<HTML> Country Flag 16px =
   "<img height=""16"" src=""https://html-content.com/img/flags/"
        & Demographic[Country Code]
        & ".png"">"
```

:::

## Sales Summary

Now, we perhaps want to enrich this with the total sales for each country. To do this, we need the values of `[$ Sales]` from our model.

To combine a raw measure value with a column and produce combined HTML, we will need to use a measure instead. The visual allows us to add a measure, but if we do, then there is no longer any row context for each individual value, e.g.:

![sales-01-measure-context.png](./images/simple-example/sales-01-measure-context.png "Adding a measure changes context from rows to a single value.")

There are two options available for introducing this into your design:

1. Use the **Context** data role to create row context.
2. Encapsulate the data within a single measure and add this to **Values**.

The first offers a faster way in for simple use cases, and (as of 2.0) can provide flexibility for additional content and [interactivity](interactivity) via [templates](properties-templates). The second was the way of building richer content prior to 2.0 and is still very widely used, but we'll stick with the first approach (Context) for our example and you can decide what works best for you after you've been introduced to the concept.

## Context {#option-1-create-context-using-granularity}

### Adding Context

As we wish to display results for each country, we can add a column to the **Context** data role that matches the grain of the country flag HTML. Here, we'll use `[Country]` for this:

![sales-02-add-country-grain.png](./images/simple-example/sales-02-add-country-grain.png "Adding the [Country] field to the Context data role creates row context.")

Here we can see that this has introduced row context at the `[Country]` level and now displays the total sales for each country. You can add multiple columns into this data role to increase the level of granularity, but that sales measure isn't looking very exciting, so we will write a new one to combine our flag with `[$ Sales]`:

```dax
<HTML> Sales by Country (Simple, Context) =
    VAR FormattedSales =
        FORMAT ( [$ Sales], "$#,##0" )
    VAR CountryFlag =
        SELECTEDVALUE ( Demographic[<HTML> Country Flag 16px] )
    RETURN
        CountryFlag
        & "&nbsp;"
        & FormattedSales
```

![sales-02-country-grain-html.png](./images/simple-example/sales-02-country-grain-html.png "Creating a measure to display flag and total sales, based on Context.")

### Exploring Context

As mentioned above, the **Context** data role is useful for breaking out our data, but it can also influence how Power BI interactivity works. By default, anything added to the role is included in tooltip functionality. Other measures can be added to the **Tooltips** role to flesh this out, e.g.:

![sales-02-interactivity-tooltips.png](./images/simple-example/sales-02-interactivity-tooltips.png "Context columns and measures are added to tooltips, as well as any measures added to the Tooltips data role")

Report page tooltips are also supported for the created context on a data point.

Columns in the **Context** role can also give us the ability to cross-filter other visuals if we enable the option in the _Cross-filtering_ property menu and click on a row, e.g.:

![sales-02-interactivity-cross-filter.png](./images/simple-example/sales-02-interactivity-cross-filter.png "Context columns can allow you to cross filter other visuals by clicking on a data row with the Cross-filtering properties enabled.")

There's a lot more to interactivity than this. While HTML Content tries to make this as simple as possible, you can control many more facets of how interactivity works, including styling the appearance and suppressing specific functions on certain elements. Refer to the [interactivity](interactivity) page for more information on this and how to better understand how Power BI interactivity works (and where your limits may lie).

## Rendered Output

So far, we've added a simple measure containing HTML, which is then projected out for each row in the data set. But let's have a look at what HTML Content actually does in terms of what it puts into the output domain.

### Finding Template Properties

In the properties pane, expand the _Templates_ tab, and you'll see two properties:

![templates-properties-default.png](./images/simple-example/templates-properties-default.png "The Properties pane contains a Templates section which allows you to customize how content is rendered at both an overall content and row level.")

- **Body template**, which shows a `{{content}}` placeholder.
- **Row template**, which shows a `{{row}}` placeholder surrounded by a `<div>` element.

These are set up to provide bare minimum pass-through from your semantic model, but they can be customized quite extensively to create flexible layouts. You can read more about this in detail on the [Templates](properties-templates) page, or continue reading where we'll change them slightly for this example to see how they work.

### Checking Generated HTML

Because Power BI doesn't provide the same development environment as a web browser, it can often be difficult to check the generated output. As such, HTML Content provides two options you can use to verify how this is generated from your data and configuration. Both are available in the _Content formatting_ property pane (under _Behavior_):

![html-inspection-properties.png](./images/simple-example/html-inspection-properties.png "The Content Formatting Property pane contains options to allow you to inspect the rendered, raw HTML.")

1. [**Show raw HTML**](properties-content-formatting#show-raw-html), which will display the HTML instead of the rendered visual, e.g.:

   ![html-inspection-show-raw-html.png](./images/simple-example/html-inspection-show-raw-html.png "The `Show raw HTML` property will replace the rendered output with the generated HTML.")

2. [**Enable diagnostics**](diagnostics), which provides you with the means to be able to see your rendered output but click and see your HTML in a separate dialog, via the 🐞 icon available in the top-right of the visual.

   ![html-inspection-diagnostics.png](./images/simple-example/html-inspection-diagnostics.png "The `Enable diagnostics property` will keep the rendered output but provide you with an option to click and open the Diagnostics pane in a modal dialog.")

:::info Row Classes
The `htmlViewerEntry` class is added by HTML Content when your data is processed to help identify where a new data point is rendered. It is added to the outermost element in each row's specific DOM subtree.
:::

## Enriching Our Design

We'll think of a couple of extra advantages of HTML Content to make our visual a little richer, while keeping its functionality. Rather than displaying as a raw set of div elements for each row, we'll turn it into a basic table with a little additional styling.

### Body Template

Firstly, we'll need to update our _Body template_ to have the surrounding elements, and we can modify this as follows:

![enrichment-body-template-property.png](./images/simple-example/enrichment-body-template-property.png "Updating our `Body template` property to include the desired content for an HTML table. In the body `tbody` tag is our `{{content}}` token, which is where our data will be rendered.")

Note that the `{{content}}` token is in the `<tbody>` tag, and this is where our data will be rendered.

:::tip Prefer dynamic content here, too?
This property supports conditional formatting, which means we could do this as a measure if we wanted to, but in this example we're just typing straight in.
:::

For your reference, the HTML is below, so you can copy and paste this into the property or a suitable measure (remember to escape double quotes if you do this!).

```html
<table>
  <thead>
    <tr>
      <th></th>
      <th class="numeric-value">$ Sales</th>
    </tr>
  </thead>
  <tbody>
    {{content}}
  </tbody>
</table>
```

### Our New Contextual Measure

For each data point delivered via row context, we're going to change the template from the default because `<div>`s don't always work so well inside semantic HTML tables. Here, we will do most of the work in our measure. We'll set up a new measure as follows:

```dax
<HTML> Sales by Country (Table Row) =
    VAR FormattedSales =
        FORMAT ( [$ Sales], "$#,##0" )
    VAR CountryFlag =
        SELECTEDVALUE ( Demographic[<HTML> Country Flag 16px] )
    RETURN
          "<tr>"
        &   "<td>" & CountryFlag & "</td>"
        &   "<td class=""numeric-value"">" & FormattedSales & "</td>"
        & "</tr>"
```

Replace our current measure in the **Values** data role with this one, e.g.:

![enrichment-contextual-measure.png](./images/simple-example/enrichment-contextual-measure.png "Our previous measure has been replaced with a new contextual measure that creates a table row tag and the necessary table columns to support the data we wish to display.")

### Row Template

As we opted to handle everything that gets rendered for a contextual data point, for this specific property we will just replace the default entry with the `{{row}}` token:

![enrichment-row-template-property.png](./images/simple-example/enrichment-row-template-property.png "Updating our `Row template` property to only include the {{row}} token, which will defer all content to our measure.")

:::info Why no conditional formatting?
This property doesn't support conditional formatting because supplying a measure via context is essentially the same thing.
:::

### Review of Template Work

Let's take a quick look at where we've got to. Provided we've set the templates up and we've added our new measure into the visual, we should see something that looks like this:

![enrichment-check-in-after-templates.png](./images/simple-example/enrichment-check-in-after-templates.png "The output generated by the HTML Content visual now uses a semantic HTML table. We have a blank column header for our flag icon for each country, and then we have a sales heading for our sales measure.")

We might know there's a table underneath, but we should really do some work with the styling.

### Stylesheet

Our properties menu contains a [**Stylesheet** pane](properties-stylesheet), and in here we can paste a CSS style sheet or add one from our semantic model via conditional formatting, e.g.:

![enrichment-stylesheet-property.png](./images/simple-example/enrichment-stylesheet-property.png "The style sheet property menu with some CSS entered into the property.")

Our CSS is as follows:

```css
/* Table shell */
#htmlContent table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  border-radius: 8px;
  overflow: hidden;
}

/* Header cells */
#htmlContent thead th {
  background: #888;
  color: #fff;
  font-weight: 600;
  text-align: left;
  padding: 4px;
}

/* Columns displaying numbers */
#htmlContent .numeric-value {
  text-align: right;
}

/* Body cells */
#htmlContent tbody td {
  padding: 2px;
  border-bottom: 1px solid #eaeaea;
}

/* Body row hover effect */
#htmlContent tbody tr.htmlViewerEntry:hover {
  background: #eaeaea;
}
```

### Final Inspection

Now with our style sheet applied, we can take a look at how this appears on the report canvas, e.g.:

![enrichment-stylesheet-applied.png](./images/simple-example/enrichment-stylesheet-applied.png "With our CSS applied via the style sheet, our visual now looks more like a table.")

## Wrapping Up

We now have a compact table that is styled and also has a slight hover effect as we go over a row and still honors our interactivity. Tooltips can be displayed and cross-filtering still works:

![table-finished-in-situ.png](./images/simple-example/table-finished-in-situ.png "Shows our finished table visual in situ with other core visuals on a report page with cross filtering applied.")

This should give you a small taste of what is possible with HTML Content, but please read on further to understand more about the features and how you might be able to use them to build your own bespoke interactive designs in Power BI.
