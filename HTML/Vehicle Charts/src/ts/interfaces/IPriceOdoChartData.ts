import {ITrendLine} from "./ITrendLine";
import {IPoint} from "./IPoint";

export interface IPriceOdoChartData {
    processedOdometerValues: number[];
    processedPriceValues: number[];
    trendLineDataPoints: Array<[number, number]>;
    trendLineCoefficients: ITrendLine,
    minOdoValue: number;
    maxOdoValue: number;
    pointColors: string[];
    trendLineData: IPoint[];
}
