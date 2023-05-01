import iVindecoderResponse from "../interfaces/iVindecoderResponse";
import Chart from 'chart.js/auto';
import {CategoryScale, LinearScale, Title} from 'chart.js';
export default class Graph1 {

    /**
     * Draw chart with price vs odometer data
     * @param data Data to draw chart from
     */
    drawPriceVsOdometerChart(data: iVindecoderResponse, containerElementId : string) {
        Chart.register(CategoryScale, LinearScale, Title);
        const canvas = document.createElement('canvas');
        canvas.id = 'myChart';
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        document.getElementById(containerElementId)?.appendChild(canvas);

        const priceData = data.records.map(r => r.price);
        const odometerData = data.records.map(r => r.odometer);

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: odometerData,
                datasets: [{
                    label: 'Price vs odometer',
                    data: priceData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Price (USD)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Odometer (km)'
                        }
                    }
                }
            }
        });


    }
}