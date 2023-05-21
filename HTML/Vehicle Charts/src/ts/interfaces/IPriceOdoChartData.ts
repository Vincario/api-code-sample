import {IPoint} from "./IPoint";

export interface IPriceOdoChartData {
    trendLineData: IPoint[],
    processedOdometerValues: number[],
    processedPriceValues: number[],
    maxOdoValue: number,
    minOdoValue: number,
    pointColors: string[]
}
