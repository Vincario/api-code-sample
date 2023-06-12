import * as ss from 'simple-statistics';
import Chart from "chart.js/auto";
import _BaseChart from "./_BaseChart";
import {ITrendLine} from "../../interfaces/ITrendLine";
import {IPoint} from "../../interfaces/IPoint";
import {IPriceOdoChartData} from "../../interfaces/IPriceOdoChartData";
import {IChartConfig} from "../../interfaces/IChartConfig";
import i18next from "i18next";

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
            return priceValue > trendY ? 'rgba(165,42,42,.5)' : 'rgba(61,133,106,.5)';
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
                        borderColor: "rgba(0, 0, 0, 0.5)",
                        data: data.trendLineData,
                        fill: false,
                        yAxisID: "left-y-axis",
                        pointRadius: 0,
                        pointBackgroundColor: '#fff',
                        borderWidth: 3,

                        hoverBackgroundColor: "rgba(0, 0, 0, 0.5)",
                        hoverBorderColor: "rgba(0, 0, 0, 0.7)",
                        hoverBorderWidth: 5,
                    },
                    {
                        backgroundColor: "rgb(75, 192, 192)",
                        data: data.processedOdometerValues.map((value, index) => ({
                            x: value,
                            y: data.processedPriceValues  [index]
                        })),
                        fill: false,
                        yAxisID: "right-y-axis",
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
                                return (context.datasetIndex === 0 ? i18next.t('TRENDLINE')  : ''  ) + ` ${Math.round(price).toLocaleString()} ${this._options.currency} / ${odo.toLocaleString()} ${this._options.lengthUnit}`;
                            }
                        }
                    },
                    backgroundImage: {
                        image: 'src/assets/logo.svg',
                        x: 0,
                        y: 0,
                        width: '100%',
                        height: '100%'
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
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
                            text: i18next.t("PRICE") + ' ' + "(" + this._options.currency + ")",
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
                            text: i18next.t("ODOMETER") + ' ' + "(" + this._options.lengthUnit + ")",
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

        processedOdometerValues.sort((a, b) => a - b);
        processedPriceValues.sort((a, b) => a - b);

        const minOdoValue = Math.min(...processedOdometerValues);
        const maxOdoValue = Math.max(...processedOdometerValues);

        const uniqueXValues = new Set();
        const trendLineDataPoints = [];
        for (let i = 0; i < processedOdometerValues.length; i++) {
            const odometer = processedOdometerValues[i];
            const price = processedPriceValues[i];

            // Check if the x-value (odometer) is already in uniqueXValues
            if (!uniqueXValues.has(odometer)) {
                uniqueXValues.add(odometer);
                trendLineDataPoints.push({ x: odometer, y: price });
            }
        }
        const trendLineCoefficients = ss.linearRegression(trendLineDataPoints.map(point => [point.x, point.y]));
        const trendLineData: IPoint[] = trendLineDataPoints.map(point => {
            return {
                x: point.x,
                y: this.getTrendLineY(point.x, trendLineCoefficients)
            };
        });

        const pointColors = this.getPointColors(processedOdometerValues, processedPriceValues, trendLineCoefficients);

        // If there is not enough data to create a chart, throw an error
        if (
            processedOdometerValues.length < this._minPriceVsOdoChartsResults ||
            processedPriceValues.length < this._minPriceVsOdoChartsResults
        ) {
            throw new Error('Not enough data to create chart.');
        }

        return {
            pointColors,
            processedOdometerValues,
            processedPriceValues,
            minOdoValue,
            maxOdoValue,
            trendLineData,
        };
    }

    private createCartHeader(chartContainer:HTMLElement):void{
        // Create chart header element
        const chartHeader = document.createElement('p');
        chartHeader.textContent = `${i18next.t('VEHICLE_PRICE_MAP')}: ${this._data.vehicle.model} (${this._data.vehicle.model_year})`;
        chartHeader.classList.add('chartHeader');

        // Create chart explanatory element
        const chartExplanatory = document.createElement('div');
        chartExplanatory.classList.add('chart-explanatory');

        // Create and append trendline sign
        chartExplanatory.appendChild(this.createTrendlineSign());

        // Create and append explanatory boxes
        chartExplanatory.appendChild(this.createExplanatoryBox(i18next.t('BELLOW_AVERAGE'), 'chart-explanatory-box-green'));
        chartExplanatory.appendChild(this.createExplanatoryBox(i18next.t('ABOVE_AVERAGE'), 'chart-explanatory-box-red'));

        // Prepend chart explanatory and chart header to chart container
        chartContainer.prepend(chartExplanatory);
        chartContainer.prepend(chartHeader);
    }

    /**
     * Draws the PriceOdoChart on a canvas element.
     * @param {string} [containerElementId=null] - The ID of the element that the chart should be appended to.
     * If null, the chart is appended to the document body.
     */
    public draw(containerElement = null) {
        try {
            const processedData: IPriceOdoChartData = this.prepareChartData();

            const chartContainer = document.createElement('div');
            const ctx = this._canvas.getContext('2d');
            const config = this.prepareConfig(processedData);
            const chart = new Chart(ctx, config);

            // Wrap the chart and add the overlay
            this.wrapAndAddOverlay(chartContainer, chart.canvas, containerElement);
            this.createCartHeader(chartContainer);

        } catch (error) {
            console.error(`Error creating chart: ${error.message}`);
        }
    }
}