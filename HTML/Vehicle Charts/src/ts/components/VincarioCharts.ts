import iVindecoderResponse from "../interfaces/iVindecoderResponse";
import iVincarioChartsoptions from "../interfaces/iVincarioChartsOptions";
import Graph1 from "./Graph1";

export default class VincarioCharts {

    // PRIVATE  CONSTANT
    private readonly _SOURCE_URL: string;
    private readonly _API_URL: string = "https://api.vindecoder.eu/3.1/0461edc86204/6a6ceb2401/vehicle-market-value/";
    private readonly _OPTIONS: iVincarioChartsoptions;
    private _data: iVindecoderResponse | null = null;

    /**
     *
     * @param vincode
     * @param options
     */
    constructor(vincode: string, options: iVincarioChartsoptions) {
        this._SOURCE_URL = this._API_URL + vincode + ".json";
        this._OPTIONS = options;
        this.loadData(this._SOURCE_URL).then(() => {
            this.drawGraphs();
        });
    }

    /**
     * Load data from url
     */
    loadData(url: string): Promise<void> {
        return fetch(this._SOURCE_URL)
            .then(response => response.json() as Promise<iVindecoderResponse>)
            .then(data => {
                console.log(data); // Todo: remove
                this._data = data;
            })
            .catch(error => console.error(error));
    }


    /**
     *
     */
    drawGraphs() {
        if (!this._data) {
            console.error('Data is not loaded yet.');
            return;
        }
        new Graph1().drawPriceVsOdometerChart(this._data, this._OPTIONS.containerElementId);
    }
}
