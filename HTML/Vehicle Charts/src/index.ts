// index.ts
import VincarioLib from "./ts/VincarioLib";
import IVincarioLibConfig from "./ts/interfaces/IVincarioLibConfig";

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
