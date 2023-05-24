// index.ts
import VincarioLib from "./ts/VincarioLib";
import IVincarioLibConfig from "./ts/interfaces/IVincarioLibConfig";
import VindecoderApi from "./ts/VindecoderApi";

window.onload = async () => {
    const vincode :string = "WF0AXXGCDA2000000";
    const apiKey :string = "0461edc86204";

    const options :IVincarioLibConfig = {
        apiKey: apiKey,
        containerElementId: "vincario-charts",
        language: 'cs',
        graphs: [
            'PriceHistogramChart',
            "PriceOdoChart"
        ],
    };
    // Option 1
    // await new VincarioLib(vincode, options).init();

    // Option 2
    const results = await new VindecoderApi("0461edc86204",vincode).fetchData();
    await new VincarioLib.createWithData(results, options);
};
