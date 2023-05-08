import iVindecoderResponse from "../../interfaces/iVindecoderResponse";
import * as ss from 'simple-statistics';
import Chart from "chart.js/auto";
import {ChartConfiguration, DefaultDataPoint} from "chart.js/dist/types";
import _BaseChart from "./_BaseChart";

/**
 * A chart that displays the relationship between vehicle price and odometer reading.
 */
export default class PriceOdoChart extends _BaseChart {

    private readonly _minPriceVsOdoChartsResults: number = 5;

    /**
     * Creates a new instance of PriceOdoChart.
     * @param data - An object containing VIN decoding information for the vehicle.
     * @param width - The width of the chart canvas.
     * @param height - The height of the chart canvas.
     * @returns A new instance of PriceOdoChart.
     */
    constructor(data: iVindecoderResponse, width: number, height: number) {
        super(data, width, height);
    }

    /**
     * Calculates the y-coordinate of a point on a linear trendline given its x-coordinate
     * @param x - The x-coordinate for which the corresponding y-coordinate should be calculated
     * @param trendline - An object containing the slope (m) and y-intercept (b) of the trendline
     * @returns The calculated y-coordinate based on the trendline
     */
    getY(x: number, trendline: { m: number, b: number }): number {
        return trendline.m * x + trendline.b;
    }

    /**
     * Determines the color for a data point based on its position relative to the trendline
     * @param x - The x-coordinate of the data point
     * @param y - The y-coordinate of the data point
     * @param trendline - An object containing the slope (m) and y-intercept (b) of the trendline
     * @returns The color for the data point (red for points above the trendline, green for points below or on the trendline)
     */
    getPointColorTrendLine(x: number, y: number, trendline: { m: number, b: number }): string {
        const trendY = this.getY(x, trendline);
        const color = y > trendY ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 128, 0, 0.5)';
        return color;
    }

    /**
     * Processes the graph data and returns two arrays: one containing the odometer values and one containing the price values
     * @returns An object with two properties: odoArray (an array of odometer values) and priceArray (an array of price values)
     */
    processGraphData(): { priceArray: number[]; trendData: number[][]; trendLine: { m: number; b: number }; odoArray: number[] } {
        const odoArray: number[] = [];
        const priceArray: number[] = [];

        this._data.records.forEach((graphEntry) => {
            const yearAgo = new Date();
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);

            // Todo 01: Opýtať sa -> povodne v datach bol aj datum vzniku zaznamu a odfiltrovali sa len rok stare to plati lebo v tych example datach toto nemam ?
            //const datePart = graphEntry["gathered_at"].split(/\D/);
            //const chartDate = new Date(datePart[0], datePart[1] - 1, datePart[2]);
            //if (chartDate > yearAgo) {
            odoArray.push(Math.floor((graphEntry["odometer"] / 1000)) * 1000);
            priceArray.push(Math.floor(graphEntry["price"]));
            //} Todo: end TODO
        });

        const trendData = odoArray.map((odoValue, index) => [odoValue, priceArray[index]]);
        const trendLine = ss.linearRegression(trendData);
        odoArray.sort((a, b) => a - b);

        return { odoArray, priceArray, trendData, trendLine };
    }

    /**
     * Returns an array of objects containing x and y values of the trendline.
     * @param {number[]} odoArray - An array of odometer values.
     * @param {{ m: number, b: number }} trendline - An object containing the slope (m) and y-intercept (b) of the trendline.
     * @returns { { x: number, y: number }[] } - An array of objects containing the x and y values of the trendline.
     */
    getTrendlineData(odoArray: number[], trendline: { m: number, b: number }): { x: number, y: number }[] {
        const sortedOdoArray = odoArray.sort((a, b) => a - b);
        return [
            { x: sortedOdoArray[0], y: trendline.m * sortedOdoArray[0] + trendline.b },
            { x: sortedOdoArray[sortedOdoArray.length - 1], y: trendline.m * sortedOdoArray[sortedOdoArray.length - 1] + trendline.b }
        ];
    }

    /**
     * Returns an array of colors for each data point, based on its position relative to the trendline.
     * @param {number[]} odoArray - An array of odometer values.
     * @param {number[]} priceArray - An array of price values.
     * @param {{ m: number, b: number }} trendline - An object containing the slope (m) and y-intercept (b) of the trendline.
     * @returns {string[]} - An array of colors for each data point.
     */
    getPointColors(odoArray: number[], priceArray: number[], trendline: { m: number, b: number }): string[] {
        return odoArray.map((odoValue, index) => {
            const priceValue = priceArray[index];
            const trendY = this.getY(odoValue, trendline);
            return priceValue > trendY ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 128, 0, 0.5)';
        });
    }

    draw(containerElementId: string = null) {

        const processedData = this.processGraphData();
        if (processedData.odoArray.length < this._minPriceVsOdoChartsResults || processedData.priceArray.length < this._minPriceVsOdoChartsResults) {
            return false;
        }

        const ctx : CanvasRenderingContext2D = this._canvas.getContext("2d");
        const minOdoValue = Math.min(...processedData.odoArray);
        const maxOdoValue = Math.max(...processedData.odoArray);
        const pointColors = this.getPointColors(processedData.odoArray, processedData.priceArray, processedData.trendLine);
        const treelineData = this.getTrendlineData(processedData.odoArray, processedData.trendLine);

        const config = {
            type: 'line',
            data: {
                labels: processedData.priceArray,
                datasets: [
                    {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        borderColor: "rgba(0, 0, 0, 1)",
                        data: treelineData,
                        fill: false,
                        yAxisID: "left-y-axis",
                        pointRadius: 3,
                        pointBackgroundColor: '#fff',
                        borderWidth: 1,
                    },
                    {
                        backgroundColor: "rgb(75, 192, 192)",
                        data: processedData.odoArray.map((value, index) => ({x: value, y: processedData.priceArray[index]})),
                        fill: false,
                        yAxisID: "left-y-axis",
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        showLine: false,
                        pointBackgroundColor: pointColors,
                    }
                ]
            },
            options: {
                aspectRatio: 2,
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: (item, data) => null,
                            label: (context) => {
                                const dataIndex = context.dataIndex;
                                const dataset = context.dataset;
                                const price = dataset.data[dataIndex].y;
                                const odo = dataset.data[dataIndex].x;
                                return `${Math.round(price).toLocaleString()} € / ${odo.toLocaleString()} KM`;
                            }
                        }
                    }
                },
                scales: {
                    'left-y-axis': {
                        type: 'linear',
                        position: 'left',
                        min: 0,
                        max: (Math.ceil(Math.max(...processedData.priceArray) * 1.1 / 1000)) * 1000,
                        ticks: {
                            stepSize: (Math.ceil(Math.max(...processedData.priceArray) * 1.1 / 1000)) * 100
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
                        max: (Math.ceil(Math.max(...processedData.priceArray) * 1.1 / 1000)) * 1000,
                        ticks: {
                            stepSize: (Math.ceil(Math.max(...processedData.priceArray) * 1.1 / 1000)) * 100,
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
                        max: maxOdoValue + (maxOdoValue - minOdoValue) * 0.1,
                        title: {
                            display: true,
                            text: "Odometer (:unit)",
                            padding: {top: 20, left: 0, right: 0, bottom: 0}
                        },
                    }
                },
            }
        };
        const chart1 = new Chart(ctx, config);
        document.getElementById(containerElementId).append(chart1.canvas);
    }
}