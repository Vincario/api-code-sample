import iVindecoderResponse from "../../interfaces/iVindecoderResponse";
import {ChartConfiguration, DefaultDataPoint, LinearScale} from "chart.js";
import Chart from "chart.js/auto";
import _BaseChart from "./_BaseChart";

// export default class PriceHistogramChart extends _BaseChart {
//     /**
//      * Calculate the histogram of an array of values
//      * @param vector - The array of values to calculate the histogram for
//      * @param options - Configuration options for the histogram calculation
//      * @returns An object with histogram properties and methods
//      */
//     histogram(
//         vector: number[],
//         options: { copy?: boolean; pretty?: boolean }
//     ): {
//         size: number;
//         fun: (d: number) => number;
//         tickRange: (n: number) => [number, number, number];
//     } {
//         options = options || {};
//         options.copy = options.copy === undefined ? true : options.copy;
//         options.pretty = options.pretty === undefined ? true : options.pretty;
//
//         let s = vector;
//         if (options.copy) s = s.slice();
//         s.sort(function (a, b) {
//             return a - b;
//         });
//
//         function quantile(p) {
//             let idx = 1 + (s.length - 1) * p,
//                 lo = Math.floor(idx),
//                 hi = Math.ceil(idx),
//                 h = idx - lo;
//             return (1 - h) * s[lo] + h * s[hi];
//         }
//
//         function freedmanDiaconis() {
//             const iqr = quantile(0.75) - quantile(0.25);
//             return 2 * iqr * Math.pow(s.length, -1 / 3);
//         }
//
//         function pretty(x) {
//             let scale = Math.pow(10, Math.floor(Math.log(x / 10) / Math.LN10)),
//                 err = 10 / x * scale;
//             if (err <= 0.15) scale *= 10;
//             else if (err <= 0.35) scale *= 5;
//             else if (err <= 0.75) scale *= 2;
//             return scale * 10;
//         }
//
//         let h = freedmanDiaconis();
//         if (options.pretty) h = pretty(h);
//
//         function bucket(d) {
//             return h * Math.floor(d / h);
//         }
//
//         function tickRange(n) {
//             const extent = [bucket(s[0]), h + bucket(s[s.length - 1])],
//                 buckets = Math.round((extent[1] - extent[0]) / h),
//                 step = buckets > n ? Math.round(buckets / n) : 1,
//                 pad = buckets % step; // to center whole step markings
//             return [extent[0] + h * Math.floor(pad / 2),
//                 extent[1] - h * Math.ceil(pad / 2) + h * 0.5, // pad upper extent for d3.range
//                 h * step
//             ];
//         }
//
//         return {
//             size: h,
//             fun: bucket,
//             tickRange: tickRange
//         };
//     }
//
//
//     /**
//      * Generate an array of numbers within a range
//      * @param start - The starting value of the range
//      * @param end - The ending value of the range
//      * @param step - The step between values in the range (default: 1)
//      * @returns An array of numbers within the specified range
//      */
//     range(start: number, end: number, step: number = 1): number[] {
//         const len = Math.floor((end - start) / step) + 1;
//         return Array(len).fill(undefined).map((_, idx) => start + (idx * step));
//     }
//
//     /**
//      * Calculate the specified percentile value of an array of numbers
//      * @param percentile - The percentile to calculate (0-1)
//      * @param values - The array of numbers to calculate the percentile from
//      * @returns The calculated percentile value
//      */
//     calculatePercentile(percentile: number, values: number[]): number {
//         // Step 1: Sort the array in ascending order
//         values.sort(function (a, b) {
//             return a - b;
//         });
//
//         // Step 2: Determine the index of the desired percentile value
//         var index = Math.ceil(percentile * values.length) - 1;
//
//         // Return the value at that index in the sorted array
//         return values[index];
//     }
//
//     /**
//      * Draw a price histogram chart using the provided data
//      * @param data - The data to use for drawing the chart (iVindecoderResponse object)
//      * @param containerElementId - The ID of the container element to append the chart canvas to
//      */
//     draw(data: iVindecoderResponse, containerElementId: string): void | boolean {
//
//         // Create Canvas
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext("2d");
//         canvas.width = 100;
//         canvas.height = 100;
//
//         const priceArray = [];
//
//         // Map data
//         data.records.forEach((graphEntry) => {
//             priceArray.push(Math.floor(graphEntry["price"]));
//         });
//
//         const hist = this.histogram(priceArray, {});
//         const binRange = hist.tickRange(5);
//         const labels = this.range(binRange[0], Math.round(binRange[1]), binRange[2]);
//         const bins = Array(labels.length).fill(0);
//
//         for (let i = 0; i < priceArray.length; i++) {
//             const value = priceArray[i];
//             const index = labels.indexOf(hist.fun(value));
//             bins[index]++;
//         }
//
//         if (priceArray.length === 0) {
//             return false;
//         }
//
//         const percentile15 = this.calculatePercentile(0.15, priceArray);
//         const percentile75 = this.calculatePercentile(0.75, priceArray);
//
//         const up = (ctx, value) => ctx.p0.parsed.x < percentile15 ? value : undefined;
//         const down = (ctx, value) => ctx.p0.parsed.x > percentile75 ? value : undefined;
//
//         Chart.register(LinearScale);
//         const chartData = {
//             labels: labels,
//             datasets: [
//                 {
//                     fill: true,
//                     borderWidth: 3,
//                     pointRadius: 4,
//                     borderRadius: 10,
//                     data: bins,
//                     tension: 0.4,
//                     pointBackgroundColor: '#fff',
//                     pointBorderColor: '#333',
//                     segment: {
//                         backgroundColor: ctx => up(ctx, 'rgb(39, 255, 166,0.5)') || down(ctx, 'rgb(165, 42, 42,0.5)') || 'rgb(243, 137, 1,0.5)',
//                         borderColor: '#57B1CD',
//                     },
//                 }
//             ]
//         }
//         const config = {
//             type: 'line',
//             data: chartData,
//             options: {
//                 aspectRatio: 2,
//                 interaction: {
//                     intersect: false,
//                     mode: 'index'
//                 },
//                 responsive: true,
//                 scales: {
//                     y: {
//                         display: true,
//                         title: {
//                             display: true,
//                             text: "Count of vehicles",
//                             padding: 10,
//                         },
//                     },
//                     x: {
//                         type: 'linear',
//                         ticks: {
//                             stepSize: binRange[2]
//                         },
//                         title: {
//                             display: true,
//                             text: "Price (€)",
//                             padding: 10,
//                         },
//                         max: Math.round(binRange[1]) + binRange[2]
//                     }
//                 },
//                 plugins: {
//                     legend: {
//                         display: false
//                     },
//                     tooltip: {
//                         callbacks: {
//                             title: (context) => {
//                                 return "Number of vehicle listings in the price range";
//                             },
//                         },
//                     },
//                 }
//             }
//         }
//         const chart1 = new Chart(ctx, config as ChartConfiguration<'line', DefaultDataPoint<'line'>, unknown>);
//
//         const chartCanvas = chart1.canvas;
//
//         document.getElementById(containerElementId).append(chartCanvas);
//     }
// }
