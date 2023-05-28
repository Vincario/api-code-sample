# Library Name

Library Name is a vincario-charts-api-lib for displaying graphs using our API on the background.

## Installation

You can install the library via package manager:

```bash 
npm install vincario-charts-api-lib
```

## Usage

Import the library into your project:

```javascript 
import VincarioLib from "./ts/VincarioLib";
```

Create an instance of the library and set the graph parameters:
```
import VincarioLib from "./ts/VincarioLib";
import IVincarioLibConfig from "./ts/interfaces/IVincarioLibConfig";
import VindecoderApi from "./ts/VindecoderApi"; // For Option 2 only

window.onload = async () => {
    const vincode :string = "WF0AXXGCDA2000000";
    const apiKey :string = "54c2c8564609";
    const apiSecret :string = "b375d5eeae";

    const options :IVincarioLibConfig = {
        apiKey: apiKey,                         //Required if using Option 1
        apiSecret: apiSecret,                   //Required if using Option 1
        containerElementId: "vincario-charts",  // This one is REQUIRED
        language: 'cs',                         // other option is en
        graphs: [                               // You can choose which graph should be displayed and the order matters too
            'PriceHistogramChart',
            "PriceOdoChart"
        ],
    };
    // Option 1
     await new VincarioLib(vincode, options).init();

    // Option 2
    // const results = await new VindecoderApi(apiKey,apiSecret,vincode).fetchData();
    // await new VincarioLib.createWithData(results, options);
};
```

As you can see above you can go by two ways to make the lib works. 
If Everything works yu should see at least one graph. It depends´s on your configuration.

### Parameters explanation
- `apiKey`: Your generated apiKey from (https://vindecoder.eu/my/api/3.2/docs#examples-vehicle-market-value)
- `apiSecret`: Your generated apiSecret from,(https://vindecoder.eu/my/api/3.2/docs#examples-vehicle-market-value)
- `containerElementId` (String): The ID of the DOM element where the charts will be rendered. For example, `"vincario-charts"`.
- `language` (String): The language for localization. You can use_ `"en"` for English or `"cs"` for Czech.
- `graphs` (Array): An array of graph names to be rendered. You can use one or all of them and the charts will be generated according to the order you specify `['PriceHistogramChart', 'PriceOdoChart']`.
