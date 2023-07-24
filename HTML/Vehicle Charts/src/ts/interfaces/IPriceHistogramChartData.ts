export interface IPriceHistogramChartData {
    prices: number[];
    binLabels: number[];
    binCounts: number[];
    percentile15: number;
    percentile75: number;
    binRange: [number, number, number];
}
