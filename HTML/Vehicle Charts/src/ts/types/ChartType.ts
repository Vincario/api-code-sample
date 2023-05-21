import PriceHistogramChart from "../components/GraphsTypes/PriceHistogramChart";
import PriceOdoChart from "../components/GraphsTypes/PriceOdoChart";
import AverageOdometerAndPriceChart from "../components/GraphsTypes/AverageOdometerAndPriceChart";

export type GraphTypeMap = {
    [key: string]: typeof PriceHistogramChart | typeof PriceOdoChart | typeof AverageOdometerAndPriceChart;
};