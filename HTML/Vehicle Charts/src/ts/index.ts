// index.ts
import VincarioLib from "./components/VincarioLib";

window.onload = async () => {
    const vincode = "WF0AXXGCDA2000000";
    const options = {
        containerElementId: "vincario-charts",
        graphs: [
            'PriceHistogramChart',
            "PriceOdoChart"],
    };

    await new VincarioLib(vincode, options).init();
};
