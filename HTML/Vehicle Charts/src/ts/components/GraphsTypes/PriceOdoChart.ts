import * as ss from 'simple-statistics';
import Chart from "chart.js/auto";
import _BaseChart from "./_BaseChart";

/**
 * A chart that displays the relationship between vehicle price and odometer reading.
 */
export default class PriceOdoChart extends _BaseChart {

    private readonly _minPriceVsOdoChartsResults: number = 5;

    /**
     * Calculates the y-coordinate of a point on a linear trendline given its x-coordinate
     * @param x - The x-coordinate for which the corresponding y-coordinate should be calculated
     * @param trendline - An object containing the slope (m) and y-intercept (b) of the trendline
     * @returns The calculated y-coordinate based on the trendline
     */
    getTrendlineY(x: number, trendline: { m: number, b: number }): number {
        return trendline.m * x + trendline.b;
    }

    /**
     * Returns an array of objects containing x and y values of the trendline.
     * @param {number[]} odometerArray  - An array of odometer values.
     * @param {{ m: number, b: number }} trendline - An object containing the slope (m) and y-intercept (b) of the trendline.
     * @returns { { x: number, y: number }[] } - An array of objects containing the x and y values of the trendline.
     */
    getTrendlineData(odometerArray: number[], trendline: { m: number, b: number }): { x: number, y: number }[] {
        const sortedOdoArray = odometerArray.sort((a, b) => a - b);
        return [
            {x: sortedOdoArray[0], y: trendline.m * sortedOdoArray[0] + trendline.b},
            {
                x: sortedOdoArray[sortedOdoArray.length - 1],
                y: trendline.m * sortedOdoArray[sortedOdoArray.length - 1] + trendline.b
            }
        ];
    }

    /**
     * Returns an array of colors for each data point, based on its position relative to the trendline.
     * @param {number[]} odometerArray  - An array of odometer values.
     * @param {number[]} priceArray   - An array of price values.
     * @param {{ m: number, b: number }} trendline - An object containing the slope (m) and y-intercept (b) of the trendline.
     * @returns {string[]} - An array of colors for each data point.
     */
    getPointColors(odometerArray: number[], priceArray: number[], trendline: { m: number, b: number }): string[] {
        return odometerArray.map((odoValue, index) => {
            const priceValue = priceArray  [index];
            const trendY = this.getTrendlineY(odoValue, trendline);
            return priceValue > trendY ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 128, 0, 0.5)';
        });
    }

    /**
     Generates a configuration object for the Price vs Odometer Chart.
     @param {Object} processedData - The processed data for the chart.
     @param {number} minOdoValue - The minimum value on the odometer axis.
     @param {number} maxOdoValue - The maximum value on the odometer axis.
     @param {Array<string>} pointColors - An array of colors for each point on the chart.
     @param {Array<Object>} trendlineData - An array of data points for the trendline on the chart.
     @returns {Object} The configuration object for the chart.
     */
    prepareConfig({processedData, minOdoValue, maxOdoValue, pointColors, trendlineData}): any {
        return {
            type: 'line',
            data: {
                labels: processedData.priceArray,
                datasets: [
                    {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        borderColor: "rgba(0, 0, 0, 1)",
                        data: trendlineData,
                        fill: false,
                        yAxisID: "left-y-axis",
                        pointRadius: 3,
                        pointBackgroundColor: '#fff',
                        borderWidth: 1,
                    },
                    {
                        backgroundColor: "rgb(75, 192, 192)",
                        data: processedData.odometerArray.map((value, index) => ({
                            x: value,
                            y: processedData.priceArray  [index]
                        })),
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
                            title: () => null,
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
    }

    /**
     Processes the graph data and returns an object containing arrays of processed odometer and price data,
     as well as trendline data and coefficients.
     @returns An object with four properties:
     odometerArray (an array of processed odometer values),
     priceArray (an array of processed price values),
     trendData (an array of data points for the trendline),
     trendLine (an object containing coefficients for the trendline equation).
     */
    prepareChartData()  {
        const odometerArray: number[] = [];
        const priceArray: number[] = [];

        this._data.records.forEach((graphEntry) => {
            const yearAgo = new Date();
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);

            odometerArray.push(Math.floor((graphEntry["odometer"] / 1000)) * 1000);
            priceArray.push(Math.floor(graphEntry["price"]));
        });

        const trendData = odometerArray.map((odoValue, index) => [odoValue, priceArray  [index]]);
        const trendLine = ss.linearRegression(trendData);
        odometerArray.sort((a, b) => a - b);

        return {odometerArray, priceArray, trendData, trendLine};
    }

    /**
     * Draws the PriceOdoChart on a canvas element.
     * @param {string} [containerElementId=null] - The ID of the element that the chart should be appended to.
     * If null, the chart is appended to the document body.
     */
    draw(containerElementId = null) {
        try {
            const processedData = this.prepareChartData();

            // If there is not enough data to create a chart, throw an error
            if (
                processedData.odometerArray.length < this._minPriceVsOdoChartsResults ||
                processedData.priceArray.length < this._minPriceVsOdoChartsResults
            ) {
                throw new Error('Not enough data to create chart.');
            }

            const chartContainer = document.createElement('div');
            chartContainer.style.position = 'relative';

            const ctx = this._canvas.getContext('2d');
            const minOdoValue = Math.min(...processedData.odometerArray);
            const maxOdoValue = Math.max(...processedData.odometerArray);
            const pointColors = this.getPointColors(processedData.odometerArray, processedData.priceArray, processedData.trendLine);
            const trendlineData = this.getTrendlineData(processedData.odometerArray, processedData.trendLine);
            const config = this.prepareConfig({processedData, minOdoValue, maxOdoValue, pointColors, trendlineData});
            const chart = new Chart(ctx, config);

            // Add image overlay to chart container
            this.addImageOverlay(chartContainer);

            // Append chart canvas to container
            chartContainer.appendChild(chart.canvas);

            // Append chart container to provided container element or body
            const container = document.getElementById(containerElementId);
            if (container) {
                container.appendChild(chartContainer);
            } else {
                document.body.appendChild(chartContainer);
            }
        } catch (error) {
            console.error(`Error creating chart: ${error.message}`);
        }
    }

}