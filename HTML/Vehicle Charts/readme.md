# User Guide for `vincario-charts-lib`

The following guide will help you integrate our `vincario-charts-lib` library into your website. This library allows you to easily embed various types of vehicle market value charts.

## Step 0: Download the library

Start by downloading the `vincario-charts-lib.js` file from dist/ folder. Once downloaded, ensure to include the `vincario-charts-lib.js` file into your project's directory.

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

The `data-records` attribute should be populated according to your needs. You need to fetch this data through our API. Look for more info at [https://vincario.com/api-docs/](https://vincario.com/api-docs/). It is a crucial attribute that dictates the data to be displayed on the charts. Please don´t forget to put there JSON representation of response of our API.

## Step 4: Enjoy your charts!

That's it! You should now be able to see the charts on your webpage.

Please remember that if you have any questions or issues integrating our library, don't hesitate to contact us. We look forward to your feedback!

_Enjoy using our library!_ 🍷

**Example of full usage:**
```html
<body>
    <div class="vincario-vehicle-market-value-charts" data-records='{"vin":"YV1XZEFV5P2108305","vehicle":{"vehicle_id":4809,"make":"Volvo","make_id":113,"model":"XC40","model_id":18717,"model_year":2023},"period":{"from":"2022-06-12","to":"2023-06-12"},"market_price":{"price_count":34,"price_currency":"EUR","price_below":39500,"price_mean":46900,"price_avg":47113,"price_above":54900,"price_stdev":6670},"market_odometer":{"odometer_count":34,"odometer_unit":"km","odometer_below":100,"odometer_mean":2009,"odometer_avg":4075,"odometer_above":3000,"odometer_stdev":6765},"records":[{"market":"DE","price":37900,"price_currency":"EUR","odometer":2023,"odometer_unit":"km"},{"market":"DE","price":38800,"price_currency":"EUR","odometer":2500,"odometer_unit":"km"},{"market":"DE","price":38900,"price_currency":"EUR","odometer":2005,"odometer_unit":"km"},{"market":"DE","price":39390,"price_currency":"EUR","odometer":2500,"odometer_unit":"km"},{"market":"DE","price":39500,"price_currency":"EUR","odometer":2500,"odometer_unit":"km"},{"market":"DE","price":39900,"price_currency":"EUR","odometer":2001,"odometer_unit":"km"},{"market":"DE","price":40000,"price_currency":"EUR","odometer":2500,"odometer_unit":"km"},{"market":"DE","price":40900,"price_currency":"EUR","odometer":50,"odometer_unit":"km"},{"market":"DE","price":41900,"price_currency":"EUR","odometer":50,"odometer_unit":"km"},{"market":"DE","price":42490,"price_currency":"EUR","odometer":2012,"odometer_unit":"km"},{"market":"DE","price":42990,"price_currency":"EUR","odometer":10,"odometer_unit":"km"},{"market":"DE","price":42990,"price_currency":"EUR","odometer":10,"odometer_unit":"km"},{"market":"DE","price":42990,"price_currency":"EUR","odometer":2001,"odometer_unit":"km"},{"market":"DE","price":42990,"price_currency":"EUR","odometer":2037,"odometer_unit":"km"},{"market":"DE","price":43990,"price_currency":"EUR","odometer":2990,"odometer_unit":"km"},{"market":"DE","price":44950,"price_currency":"EUR","odometer":2000,"odometer_unit":"km"},{"market":"DE","price":46900,"price_currency":"EUR","odometer":50,"odometer_unit":"km"},{"market":"DE","price":46900,"price_currency":"EUR","odometer":50,"odometer_unit":"km"},{"market":"DE","price":46900,"price_currency":"EUR","odometer":50,"odometer_unit":"km"},{"market":"DE","price":46900,"price_currency":"EUR","odometer":50,"odometer_unit":"km"},{"market":"DE","price":46900,"price_currency":"EUR","odometer":1000,"odometer_unit":"km"},{"market":"DE","price":46900,"price_currency":"EUR","odometer":1000,"odometer_unit":"km"},{"market":"DE","price":48215,"price_currency":"EUR","odometer":3000,"odometer_unit":"km"},{"market":"DE","price":48880,"price_currency":"EUR","odometer":1650,"odometer_unit":"km"},{"market":"DE","price":52954,"price_currency":"EUR","odometer":24500,"odometer_unit":"km"},{"market":"DE","price":53495,"price_currency":"EUR","odometer":8000,"odometer_unit":"km"},{"market":"DE","price":53906,"price_currency":"EUR","odometer":19500,"odometer_unit":"km"},{"market":"DE","price":54900,"price_currency":"EUR","odometer":1001,"odometer_unit":"km"},{"market":"DE","price":55890,"price_currency":"EUR","odometer":2500,"odometer_unit":"km"},{"market":"DE","price":56900,"price_currency":"EUR","odometer":2500,"odometer_unit":"km"},{"market":"DE","price":56900,"price_currency":"EUR","odometer":2500,"odometer_unit":"km"},{"market":"DE","price":57952,"price_currency":"EUR","odometer":19500,"odometer_unit":"km"},{"market":"DE","price":59900,"price_currency":"EUR","odometer":5,"odometer_unit":"km"},{"market":"DE","price":59975,"price_currency":"EUR","odometer":24500,"odometer_unit":"km"}]}'>
        <div class="vehicle-price-distribution"></div> 
        <div class="vehicle-price-map"></div>
    </div>

    <script src="./js/vincario-charts-lib.js"></script>
</body>
```
