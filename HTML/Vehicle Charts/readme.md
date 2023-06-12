# User Guide for `vincario-charts-lib`

The following guide will help you integrate our `vincario-charts-lib` library into your website. This library allows you to easily embed various types of vehicle market value charts.

## Step 0: Download the library

Start by downloading the `vincario-charts-lib` library. You can find it [here](url-to-download). Once downloaded, ensure to include the `vincario-charts-lib.js` file into your project's directory.

## Step 1: Insert the script into your webpage

Next, insert the following script tag just before the closing `</body>` tag in your HTML file.

```html
<script src="*path*/vincario-charts-lib.js"></script>
```

Replace `*path*` with the path leading to the `vincario-charts-lib.js` script within your project.

## Step 2: Create the div structure for your charts

Then, create a `div` structure according to the types of charts you wish to display. You have the freedom to choose either one or both types of charts - vehicle price distribution and vehicle price map. Remove the unnecessary divs according to your requirements. For instance, to display both charts, you may use the following code:

```html
<div class="vincario-vehicle-market-value-charts" data-records="this-is-the-important-attribute">
  <div class="vehicle-price-distribution"></div> 
  <div class="vehicle-price-map"></div>
</div>
```

The important attribute to be filled according to your requirements is `data-records`.

## Step 3: Populate the data-records

The `data-records` attribute should be populated according to your needs. You need to fetch this data through our API. Look for more info at [https://vindecoder.eu/api/](https://vindecoder.eu/api/). It is a crucial attribute that dictates the data to be displayed on the charts. Please don´t forget to put there JSON representation of response of our API.

## Step 4: Enjoy your charts!

That's it! You should now be able to see the charts on your webpage.

Please remember that if you have any questions or issues integrating our library, don't hesitate to contact us. We look forward to your feedback!

_Enjoy using our library!_ 🍷