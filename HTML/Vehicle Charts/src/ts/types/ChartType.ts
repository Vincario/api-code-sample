import PriceHistogramChart from "../components/GraphsTypes/PriceHistogramChart";
import PriceOdoChart from "../components/GraphsTypes/PriceOdoChart";

export type GraphTypeMap = {
    [key: string]: typeof PriceHistogramChart | typeof PriceOdoChart;
};