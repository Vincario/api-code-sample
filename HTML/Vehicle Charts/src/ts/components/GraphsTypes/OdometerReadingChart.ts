import _BaseChart from "./_BaseChart";
import {IAverageOdometerAndPriceChart} from "../../interfaces/IAverageOdometerAndPriceChart";
import {IChartConfig} from "../../interfaces/IChartConfig";
import {IOdometerReadingChart} from "../../interfaces/IOdometerReadingChart";

export default class OdometerReadingChart extends _BaseChart<IOdometerReadingChart> {
    createCartHeader(chartContainer: HTMLElement): void {
    }

    draw(containerElementId: string | undefined): void {
        console.log('OdometerReadingChart');
    }

    prepareChartData(): IAverageOdometerAndPriceChart {
        return undefined;
    }

    prepareConfig(data: IAverageOdometerAndPriceChart): IChartConfig {
        return undefined;
    }

}