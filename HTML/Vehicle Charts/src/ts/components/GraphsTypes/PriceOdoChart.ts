import * as ss from 'simple-statistics';
import Chart from "chart.js/auto";
import _BaseChart from "./_BaseChart";
import {ITrendLine} from "../../interfaces/ITrendLine";
import {IPoint} from "../../interfaces/IPoint";
import {IPriceOdoChartData} from "../../interfaces/IPriceOdoChartData";
import {IChartConfig} from "../../interfaces/IChartConfig";

/**
 * A chart that displays the relationship between vehicle price and odometer reading.
 */
export default class PriceOdoChart extends _BaseChart<IPriceOdoChartData> {

    private readonly _minPriceVsOdoChartsResults: number = 5;

    /**
     * Calculates the y-coordinate of a point on a linear trendLine given its x-coordinate
     * @param x - The x-coordinate for which the corresponding y-coordinate should be calculated
     * @param trendLine - An object containing the slope (m) and y-intercept (b) of the trendLine
     * @returns The calculated y-coordinate based on the trendLine
     */
    private getTrendLineY(x: number, trendLine: ITrendLine): number {
        return trendLine.m * x + trendLine.b;
    }

    /**
     * Returns an array of objects containing x and y values of the trendLine.
     * @param {number[]} odometerArray  - An array of odometer values.
     * @param {ITrendLine} trendLine - An object containing the slope (m) and y-intercept (b) of the trendLine.
     * @returns {IPoint[]} - An array of objects containing the x and y values of the trendLine.
     */
    private getTrendLineData(odometerArray: number[], trendLine: ITrendLine): IPoint[] {
        const sortedOdoArray = odometerArray.sort((a, b) => a - b);
        return [
            {x: sortedOdoArray[0], y: trendLine.m * sortedOdoArray[0] + trendLine.b},
            {
                x: sortedOdoArray[sortedOdoArray.length - 1],
                y: trendLine.m * sortedOdoArray[sortedOdoArray.length - 1] + trendLine.b
            }
        ];
    }

    /**
     * Returns an array of colors for each data point, based on its position relative to the trendLine.
     * @param {number[]} odometerArray  - An array of odometer values.
     * @param {number[]} priceArray   - An array of price values.
     * @param {ITrendLine} trendLine - An object containing the slope (m) and y-intercept (b) of the trendLine.
     * @returns {string[]} - An array of colors for each data point.
     */
    private getPointColors(odometerArray: number[], priceArray: number[], trendLine: { m: number, b: number }): string[] {
        return odometerArray.map((odoValue, index) => {
            const priceValue = priceArray  [index];
            const trendY = this.getTrendLineY(odoValue, trendLine);
            return priceValue > trendY ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 128, 0, 0.5)';
        });
    }

    /**
     Generates a configuration object for the Price vs Odometer Chart.
     @returns {Object} The configuration object for the chart.
     * @param data
     */
    private prepareConfig(data:IPriceOdoChartData): IChartConfig {

        return {
            type: 'line',
            data: {
                labels: data.processedPriceValues,
                datasets: [
                    {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        borderColor: "rgba(0, 0, 0, 1)",
                        data: data.trendLineData,
                        fill: false,
                        yAxisID: "left-y-axis",
                        pointRadius: 3,
                        pointBackgroundColor: '#fff',
                        borderWidth: 1,
                    },
                    {
                        backgroundColor: "rgb(75, 192, 192)",
                        data: data.processedOdometerValues.map((value, index) => ({
                            x: value,
                            y: data.processedPriceValues  [index]
                        })),
                        fill: false,
                        yAxisID: "left-y-axis",
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        showLine: false,
                        pointBackgroundColor: data.pointColors,
                    }
                ]
            },
            options: {
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: () => null,
                            label: (context) => {
                                const dataIndex = context.dataIndex;
                                const dataset = context.dataset;
                                const price = dataset.data[dataIndex].y;
                                const odo = dataset.data[dataIndex].x;
                                return `${Math.round(price).toLocaleString()} € / ${odo.toLocaleString()} KM`;
                            }
                        }
                    },
                    backgroundImage: {
                        image: 'src/res/logo.png',
                        x: 0,
                        y: 0,
                        width: '100%',
                        height: '100%'
                    }
                },
                scales: {
                    'left-y-axis': {
                        type: 'linear',
                        position: 'left',
                        min: 0,
                        max: (Math.ceil(Math.max(...data.processedPriceValues) * 1.1 / 1000)) * 1000,
                        ticks: {
                            stepSize: (Math.ceil(Math.max(...data.processedPriceValues) * 1.1 / 1000)) * 100
                        },
                        title: {
                            display: true,
                            text: "Price (:currency)",
                            padding: {top: 0, left: 0, right: 0, bottom: 10}
                        },
                    },
                    'right-y-axis': {
                        type: 'linear',
                        position: 'right',
                        display: false,
                        min: 0,
                        max: (Math.ceil(Math.max(...data.processedPriceValues) * 1.1 / 1000)) * 1000,
                        ticks: {
                            stepSize: (Math.ceil(Math.max(...data.processedPriceValues) * 1.1 / 1000)) * 100,
                            autoSkip: false,
                        },
                    },
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10,
                        },
                        type: "linear",
                        display: true,
                        max: data.maxOdoValue + (data.maxOdoValue - data.minOdoValue) * 0.1,
                        title: {
                            display: true,
                            text: "Odometer (:unit)",
                            padding: {top: 20, left: 0, right: 0, bottom: 0}
                        },
                    }
                },
            }
        };
    }

    /**
     * Processes the graph data and returns an object containing arrays of processed odometer and price data,
     * as well as trendLine data and coefficients.
     *
     * @returns {IPriceOdoChartData} An object with the following properties:
     * - processedOdometerValues (number[]): an array of processed odometer values
     * - processedPriceValues (number[]): an array of processed price values
     * - trendLineDataPoints (Array<[number, number]>): an array of data points for the trendLine
     * - trendLineCoefficients (object): an object containing coefficients for the trendLine equation
     * - minOdoValue (number): the minimum odometer value
     * - maxOdoValue (number): the maximum odometer value
     * - pointColors (string[]): an array of colors for the data points
     * - trendLineData (IPoint[]): an array of data points for the trend line
     */
    private prepareChartData(): IPriceOdoChartData {
        const processedOdometerValues: number[] = [];
        const processedPriceValues: number[] = [];

        this._data.records.forEach((graphEntry) => {
            const yearAgo = new Date();
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);

            processedOdometerValues.push(Math.floor((graphEntry["odometer"] / 1000)) * 1000);
            processedPriceValues.push(Math.floor(graphEntry["price"]));
        });

        const trendLineDataPoints = processedOdometerValues.map((odoValue, index) => [odoValue, processedPriceValues[index]]);
        const trendLineCoefficients = ss.linearRegression(trendLineDataPoints);
        processedOdometerValues.sort((a, b) => a - b);

        const minOdoValue = Math.min(...processedOdometerValues);
        const maxOdoValue = Math.max(...processedOdometerValues);
        const pointColors = this.getPointColors(processedOdometerValues, processedPriceValues, trendLineCoefficients);
        const trendLineData = this.getTrendLineData(processedOdometerValues, trendLineCoefficients);


        // If there is not enough data to create a chart, throw an error
        if (
            processedOdometerValues.length < this._minPriceVsOdoChartsResults ||
            processedPriceValues.length < this._minPriceVsOdoChartsResults
        ) {
            throw new Error('Not enough data to create chart.');
        }

        return {
            processedOdometerValues,
            processedPriceValues,
            trendLineDataPoints,
            trendLineCoefficients,
            minOdoValue,
            maxOdoValue,
            pointColors,
            trendLineData,
        };
    }

    /**
     * Draws the PriceOdoChart on a canvas element.
     * @param {string} [containerElementId=null] - The ID of the element that the chart should be appended to.
     * If null, the chart is appended to the document body.
     */
    public draw(containerElementId = null) {
        try {
            const processedData: IPriceOdoChartData = this.prepareChartData();

            const chartContainer = document.createElement('div');
            const ctx = this._canvas.getContext('2d');
            const config = this.prepareConfig(processedData);
            const chart = new Chart(ctx, config);

            // Wrap the chart and add the overlay
            this.wrapAndAddOverlay(chartContainer, chart.canvas, containerElementId);
        } catch (error) {
            console.error(`Error creating chart: ${error.message}`);
        }
    }
}