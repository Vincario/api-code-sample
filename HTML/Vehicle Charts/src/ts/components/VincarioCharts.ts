import iVindecoderResponse from "../interfaces/iVindecoderResponse";
import iVincarioChartsOptions from "../interfaces/iVincarioChartsOptions";
//import PriceHistogramChart from "./GraphsTypes/PriceHistogramChart";
import PriceOdoChart from "./GraphsTypes/PriceOdoChart";
import { GraphTypeMap } from "../types/GraphType";

export default class VincarioCharts {
    private readonly apiUrl = "https://api.vindecoder.eu/3.1/0461edc86204/6a6ceb2401/vehicle-market-value/";
    private data: iVindecoderResponse | null = null;
    private readonly sourceUrl: string;
    private readonly options: iVincarioChartsOptions;

    constructor(vincode: string, options: iVincarioChartsOptions) {
        this.sourceUrl = `${this.apiUrl}${vincode}.json`;
        this.options = options;
    }

    /**
     * Initializes the VincarioCharts library by loading data from the API and drawing graphs.
     */
    public async init(): Promise<void> {
        try {
            await this.loadData();
            this.drawGraphs();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Loads data from the API URL.
     *
     * @returns A Promise that resolves with void.
     */
    private async loadData(): Promise<void> {
        try {
            const response = await fetch(this.sourceUrl);
            this.data = await response.json();
        } catch (error) {
            console.error("An error occurred while loading data:", error);
        }
    }

    /**
     * Draws the specified graphs or all available graphs if none are specified.
     * @param {number} width - The width of the charts in pixels.
     * @param {number} height - The height of the charts in pixels.
     */
    private drawGraphs(): void {
        if (!this.data) {
            console.error("Data is not loaded yet.");
            return;
        }

        const { graphs, containerElementId } = this.options;

        // Create an object to map graph types to their respective classes
        const graphTypeMap: GraphTypeMap = {
            // PriceHistogramChart,
            PriceOdoChart,
        };

        // If no specific graphs are provided, draw all available graphs
        const graphTypes = graphs ?? Object.keys(graphTypeMap);

        // Iterate through the available graph types
        for (const graphType of graphTypes) {
            const GraphClass = graphTypeMap[graphType];
            const graphInstance = new GraphClass(this.data,this.options.graphBaseWidth, this.options.graphBaseHeight);
            graphInstance.draw(containerElementId);
        }
    }
}
