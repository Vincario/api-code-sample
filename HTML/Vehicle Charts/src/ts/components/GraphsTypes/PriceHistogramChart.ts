import IVindecoderApiResponse from "../../interfaces/IVindecoderApiResponse";
import {ChartConfiguration, DefaultDataPoint, LinearScale} from "chart.js";
import Chart from "chart.js/auto";
import _BaseChart from "./_BaseChart";
import {IPriceOdoChartConfig} from "../../interfaces/IPriceOdoChartConfig";

interface IProcessedData {
    prices: number[];
    binRange: number[];
    binLabels: number[];
    binCounts: number[];
    percentile15: number;
    percentile75: number;
}

export default class PriceHistogramChart extends _BaseChart {

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

    range(start: number, end: number, step: number = 1): number[] {
        const len = Math.floor((end - start) / step) + 1;
        return Array(len).fill(undefined).map((_, idx) => start + (idx * step));
    }

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

    prepareConfig(data: IProcessedData):IPriceOdoChartConfig {
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
                //responsive: true,
                scales: {
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: "Count of vehicles",
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
                            text: "Price (€)",
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
                                return "Number of vehicle listings in the price range";
                            },
                        },
                    },
                }
            }
        };
    }

    prepareChartData(): IProcessedData {
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

    draw(containerElementId: string) {

        try {
            const processedData = this.prepareChartData();

            if (processedData.prices.length === 0) {
                throw new Error('No data to display');
            }

            if (!Chart.registry.getScale('linear')) {
                Chart.register(LinearScale);
            }

            const chartData = {
                labels: processedData.binLabels,
                datasets: [
                    {
                        fill: true,
                        borderWidth: 3,
                        pointRadius: 4,
                        borderRadius: 10,
                        data: processedData.binCounts,
                        tension: 0.4,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#333',
                        segment: {
                            backgroundColor: ctx => this.getSegmentColor(ctx, processedData),
                            borderColor: '#57B1CD',
                        },
                    }
                ]
            }
            const config = this.prepareConfig(processedData);
            const chart1 = new Chart(this._canvas.getContext("2d"), config as ChartConfiguration<'line', DefaultDataPoint<'line'>, unknown>);

            const chartCanvas = chart1.canvas;

            document.getElementById(containerElementId).append(chartCanvas);
        } catch (error) {
            console.error(error);
            // ďalšie spracovanie chyby, napr. výpis chybovej hlášky do DOM
        }
    }
}