// index.ts
import VincarioLib from "./VincarioLib";
import IVincarioLibConfig from "./interfaces/IVincarioLibConfig";

window.onload = async () => {
    const vincode :string = "WF0AXXGCDA2000000";
    const options :IVincarioLibConfig = {
        containerElementId: "vincario-charts",
        graphs: [
            'PriceHistogramChart',
            "PriceOdoChart"
        ],
    };

    await new VincarioLib(vincode, options).init();
};
