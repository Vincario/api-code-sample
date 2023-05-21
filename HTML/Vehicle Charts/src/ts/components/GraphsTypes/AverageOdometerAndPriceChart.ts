import _BaseChart from "./_BaseChart";
import {IAverageOdometerAndPriceChart} from "../../interfaces/IAverageOdometerAndPriceChart";
import {IChartConfig} from "../../interfaces/IChartConfig";

export default class AverageOdometerAndPriceChart extends _BaseChart<IAverageOdometerAndPriceChart> {
    createCartHeader(chartContainer: HTMLElement): void {
    }

    draw(containerElementId: string | undefined): void {
        console.log('AverageOdometerAndPriceChart');
    }

    prepareChartData(): IAverageOdometerAndPriceChart {
        return undefined;
    }

    prepareConfig(data: IAverageOdometerAndPriceChart): IChartConfig {
        return undefined;
    }

}