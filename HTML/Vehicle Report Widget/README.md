# Vincario Vindecoder Vehicle Report Widget
You can insert this widget into an `iframe` on your website to provide your visitors with an easy way
to decode vehicle details using the [Vincario Vindecoder](https://vindecoder.eu/). The widget is fully
responsive, so it fits anywhere you place it.

<p align="center">
<img src="https://user-images.githubusercontent.com/3509811/217822335-a7b79a7a-4193-44f0-8c44-168dbf76928a.png" width=400 alt="Widget Screenshot">
</p>

## Installation
You simply need to upload the content of this directory to your webserver and then include `index.html`
as a source of an `iframe`.

[Download a ZIP archive](https://github.com/Vincario/api-code-sample/files/10697799/vehicle_report_widget.zip)
with all required files.

Basic usage would be:
```
<iframe src="https://YOUR-SERVER/PATH/TO/WIDGET/index.html"
        title="Vincario Vehicle Report"
        width="400" height="120"
        style="border:none; background-color: #FFF;"
></iframe>
```
You can experiment with different dimensions to fit the widget perfectly on your page. The widget 
displays error messages if you enter invalid character or too short/long VIN, which adds one or 
more lines below the widget. Keep that in mind when setting the `height` of the widget, so you avoid
displaying scrollbars in the `iframe`.

By setting different `background-color` attribute you can customize the background color of the `iframe`,
so it matches color of your page.

You are of course free to modify the Widget's CSS in [styles/style.css](styles/style.css) to customize
its appearance even more. We only ask you to not remove the `Powered By Vincario` line. Thank you.
