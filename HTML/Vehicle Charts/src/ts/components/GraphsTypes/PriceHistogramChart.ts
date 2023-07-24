import { Chart, LinearScale, LineController, PointElement, LineElement, Filler } from 'chart.js';
import _BaseChart from "./_BaseChart";
import {IChartConfig} from "../../interfaces/IChartConfig";
import {IPriceHistogramChartData} from "../../interfaces/IPriceHistogramChartData";
import i18next from "i18next";

Chart.register(LinearScale, LineController, PointElement, LineElement, Filler);

export default class PriceHistogramChart extends _BaseChart<IPriceHistogramChartData> {

    /**
     * Computes a histogram from the input data vector with optional parameters.
     * @param vector The input data vector as an array of numbers.
     * @param options An object with optional parameters: `copy` and `pretty`.
     * @returns An object with the following properties: `size`, `fun`, and `tickRange`.
     */
    histogram(vector: number[], options: { copy?: boolean; pretty?: boolean }): {
        size: number;
        fun: (d: number) => number;
        tickRange: (n: number) => [number, number, number];
    } {
        options = options || {};
        options.copy = options.copy === undefined ? true : options.copy;
        options.pretty = options.pretty === undefined ? true : options.pretty;

        let s = vector;
        if (options.copy) s = s.slice();
        s.sort(function (a, b) {
            return a - b;
        });

        function quantile(p) {
            let idx = 1 + (s.length - 1) * p,
                lo = Math.floor(idx),
                hi = Math.ceil(idx),
                h = idx - lo;
            return (1 - h) * s[lo] + h * s[hi];
        }

        function freedmanDiaconis() {
            const iqr = quantile(0.75) - quantile(0.25);
            return 2 * iqr * Math.pow(s.length, -1 / 3);
        }

        function pretty(x) {
            let scale = Math.pow(10, Math.floor(Math.log(x / 10) / Math.LN10)),
                err = 10 / x * scale;
            if (err <= 0.15) scale *= 10;
            else if (err <= 0.35) scale *= 5;
            else if (err <= 0.75) scale *= 2;
            return scale * 10;
        }

        let h = freedmanDiaconis();
        if (options.pretty) h = pretty(h);

        function bucket(d) {
            return h * Math.floor(d / h);
        }

        function tickRange(n) {
            const extent = [bucket(s[0]), h + bucket(s[s.length - 1])],
                buckets = Math.round((extent[1] - extent[0]) / h),
                step = buckets > n ? Math.round(buckets / n) : 1,
                pad = buckets % step; // to center whole step markings
            return [extent[0] + h * Math.floor(pad / 2),
                extent[1] - h * Math.ceil(pad / 2) + h * 0.5, // pad upper extent for d3.range
                h * step
            ];
        }

        return {
            size: h,
            fun: bucket,
            tickRange: tickRange
        };
    }

    /**
     * Generates an array of numbers in the specified range with a specified step.
     * @param start The starting value of the range.
     * @param end The ending value of the range.
     * @param step The step value between consecutive numbers in the range (default is 1).
     * @returns An array of numbers in the specified range.
     */
    range(start: number, end: number, step: number = 1): number[] {
        const len = Math.floor((end - start) / step) + 1;
        return Array(len).fill(undefined).map((_, idx) => start + (idx * step));
    }

    /**
     * Calculates the specified percentile value from an array of numbers.
     * @param percentile The desired percentile as a decimal (e.g., 0.15 for the 15th percentile).
     * @param values The input data as an array of numbers.
     * @returns The value at the specified percentile.
     */
    calculatePercentile(percentile: number, values: number[]): number {
        // Step 1: Sort the array in ascending order
        values.sort(function (a, b) {
            return a - b;
        });

        // Step 2: Determine the index of the desired percentile value
        var index = Math.ceil(percentile * values.length) - 1;

        // Return the value at that index in the sorted array
        return values[index];
    }

    /**
     * Determines the segment color based on the context and the processed data.
     * @param ctx The charting context.
     * @param processedData The processed data.
     * @returns A color string in the format 'rgb(r, g, b, a)'.
     */
    getSegmentColor(ctx, processedData) {
        const x = ctx.p0.parsed.x;
        if (x < processedData.percentile15) {
            return 'rgb(39, 255, 166,0.5)';
        } else if (x > processedData.percentile75) {
            return 'rgb(165, 42, 42,0.5)';
        } else {
            return 'rgb(243, 137, 1,0.5)';
        }
    }

    /**
     * Prepares the chart configuration based on the input data.
     * @param data The input data.
     * @returns An object of type `IChartConfig` containing the chart configuration.
     */
    prepareConfig(data):IChartConfig {
        return {
            type: 'line',
            data: {
                labels: data.binLabels,
                datasets: [
                    {
                        fill: true,
                        borderWidth: 3,
                        pointRadius: 4,
                        borderRadius: 10,
                        data: data.binCounts,
                        tension: 0.4,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#333',
                        segment: {
                            backgroundColor: ctx => this.getSegmentColor(ctx, data),
                            borderColor: '#57B1CD',
                        },
                    }
                ]
            },
            options: {
                aspectRatio: 2,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: i18next.t("COUNT_OF_VEHICLES"),
                            padding: 10,
                        },
                    },
                    x: {
                        type: 'linear',
                        ticks: {
                            stepSize: data.binRange[2]
                        },
                        title: {
                            display: true,
                            text: i18next.t("PRICE") + ' (' + this._options.currency + ')',
                            padding: 10,
                        },
                        max: Math.round(data.binRange[1]) + data.binRange[2]
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: (context) => {
                                return i18next.t("NUMBERS_OF_VEHICLE_LISTING");
                            },
                        },
                    },
                }
            }
        };
    }

    /**
     * Processes the input data and returns an object of type `IPriceHistogramChartData` containing processed data.
     * @returns An object of type `IPriceHistogramChartData` with the following properties: `prices`, `binLabels`, `binCounts`, `percentile15`, `percentile75`, and `binRange`.
     */
    prepareChartData():IPriceHistogramChartData {
        const prices = this._data.records.map((graphEntry) => Math.floor(graphEntry["price"]));

        const priceHistogram = this.histogram(prices, {});
        const binRange = priceHistogram.tickRange(5);
        const binLabels = this.range(binRange[0], Math.round(binRange[1]), binRange[2]);
        const binCounts = Array(binLabels.length).fill(0);

        for (let i = 0; i < prices.length; i++) {
            const price = prices[i];
            const index = binLabels.indexOf(priceHistogram.fun(price));
            binCounts[index]++;
        }

        const percentile15 = this.calculatePercentile(0.15, prices);
        const percentile75 = this.calculatePercentile(0.75, prices);

        return {prices, binLabels, binCounts, percentile15, percentile75, binRange};
    }

    private createCartHeader(chartContainer:HTMLElement):void{
        // Create chart header element
        const chartHeader = document.createElement('p');
        chartHeader.textContent = `${i18next.t('VEHICLE_PRICE_DISTRIBUTION')}: ${this._data.vehicle.make} ${this._data.vehicle.model} ${this._data.vehicle.model_year}`;
        chartHeader.classList.add('chartHeader');

        // Create chart explanatory element
        const chartExplanatory = document.createElement('div');
        chartExplanatory.classList.add('chart-explanatory');

        // Create and append explanatory boxes
        chartExplanatory.appendChild(this.createExplanatoryBox(i18next.t('BELLOW_AVERAGE'), 'chart-explanatory-box-green'));
        chartExplanatory.appendChild(this.createExplanatoryBox(i18next.t('AVERAGE'), 'chart-explanatory-box-orange'));
        chartExplanatory.appendChild(this.createExplanatoryBox(i18next.t('ABOVE_AVERAGE'), 'chart-explanatory-box-red'));

        // Prepend chart explanatory and chart header to chart container
        chartContainer.prepend(chartExplanatory);
        chartContainer.prepend(chartHeader);
    };

    /**
     * Draws the chart inside a specified container element using the prepared chart data.
     * @param containerElement The ID of the container element to draw the chart in.
     * @param data
     */
    draw(containerElement = null) {

        try {
            const processedData = this.prepareChartData();

            if (processedData.prices.length === 0) {
                throw new Error('No data to display');
            }

            const chartContainer = document.createElement('div');
            const ctx = this._canvas.getContext('2d');
            const config = this.prepareConfig(processedData);
            const chart = new Chart(ctx, config);

            // Wrap the chart and add the overlay
            this.wrapAndAddOverlay(chartContainer, chart.canvas, containerElement);
            this.createCartHeader(chartContainer);

        } catch (error) {
            console.error(error);
        }
    }
}