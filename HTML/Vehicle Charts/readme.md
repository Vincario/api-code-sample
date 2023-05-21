# Library Name

Library Name is a library for displaying graphs using our API on the background.

## Installation

You can install the library via package manager:

```bash 
npm install ***library-name***
```

## Usage

Import the library into your project:

```javascript 
import VincarioLib from "./ts/VincarioLib";
```

Create an instance of the library and set the graph parameters:

```javascript 
window.onload = async () => {
    const vincode :string = "WF0AXXGCDA2000000";
    const options :IVincarioLibConfig = {
        containerElementId: "vincario-charts",
        currency: '€',
        lengthUnit: 'km',
        language: 'cs',
        graphs: [
            'OdometerReadingChart',
            'AverageOdometerAndPriceChart',
            'PriceHistogramChart',
            "PriceOdoChart"
        ],
    };

    await new VincarioLib(vincode, options).init();
};
```

### Parameters explanation

- `containerElementId` (String): The ID of the DOM element where the charts will be rendered. For example, `"vincario-charts"`.
- `currency` (String): The currency unit for price display. For example, `"€"`.
- `lengthUnit` (String): The unit for distance display. For example, `"km"`.
- `language` (String): The language for localization. You can use_ `"en"` for English or `"cs"` for Czech.
- `graphs` (Array): An array of graph names to be rendered. You can use one or all of them and the charts will be generated according to the order you specify `['OdometerReadingChart', 'AverageOdometerAndPriceChart', 'PriceHistogramChart', 'PriceOdoChart']`.
