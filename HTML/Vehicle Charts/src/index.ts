// index.ts
import VincarioLib from "./ts/VincarioLib";
import IVincarioLibConfig from "./ts/interfaces/IVincarioLibConfig";
import VindecoderApi from "./ts/VindecoderApi"; // For Option 2 only

window.onload = async () => {
    const vincode :string = "WF0AXXGCDA2000000";
    const apiKey :string = "54c2c8564609";
    const apiSecret :string = "b375d5eeae";

    const options :IVincarioLibConfig = {
        apiKey: apiKey, //Required if using Option 1
        apiSecret: apiSecret, //Required if using Option 1
        containerElementId: "vincario-charts", // This one is REQUIRED
        language: 'cs',
        graphs: [
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
