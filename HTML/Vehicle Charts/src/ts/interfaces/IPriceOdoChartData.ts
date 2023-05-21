import {ITrendLine} from "./ITrendLine";
import {IPoint} from "./IPoint";

export interface IPriceOdoChartData {
    trendLineData: IPoint[],
    trendLineDataPoints: IPoint[],
    processedOdometerValues: number[],
    processedPriceValues: number[],
    maxOdoValue: number,
    trendLineCoefficients: ITrendLine,
    minOdoValue: number,
    pointColors: string[]
}
