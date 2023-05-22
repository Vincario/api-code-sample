// Vincario.ts

import VindecoderApi from "./VindecoderApi";
import {GraphTypeMap} from "./types/ChartType";
import IVindecoderApiResponse from "./interfaces/IVindecoderApiResponse";
import PriceOdoChart from "./components/GraphsTypes/PriceOdoChart";
import PriceHistogramChart from "./components/GraphsTypes/PriceHistogramChart";
import IVincarioLibConfig from "./interfaces/IVincarioLibConfig";
import {initI18n} from "../i18n/i18n";
import AverageOdometerAndPriceChart from "./components/GraphsTypes/AverageOdometerAndPriceChart";
import OdometerReadingChart from "./components/GraphsTypes/OdometerReadingChart";

/**
 * Vincario class, which is responsible for initializing and managing the Vincario charts
 */
export default class VincarioLib {

    /**
     * Constructor takes a VIN code (Vehicle Identification Number) and options for Vincario charts
     * @param vincode: string - The VIN code of the vehicle
     * @param options: IVincarioLibConfig - The options for configuring the Vincario charts
     */
    constructor(private vincode: string, private options: IVincarioLibConfig) {

        // Import styles for lib
        import('../styles/style.scss');

        // Initialize translations
        initI18n(options.language || 'en');

        // Set default vales for some options
        this.options = {
            currency: 'EUR',
            lengthUnit: 'km',
            language: 'en',
            ...this.options, // Overwrite defaults if values are provided
        };
    }

    /**
     * Asynchronous init method to initialize the Vincario charts
     * @returns Promise<void> - A Promise that resolves when the initialization is complete
     */
    public async init(): Promise<void> {

        try {
            // Create a new instance of the VindecoderApi class with the provided VIN code
            const api = new VindecoderApi(this.vincode);

            // Fetch the data from the VindecoderApi
            const data: IVindecoderApiResponse = await api.fetchData();

            this.options.currency = data.records[0].price_currency ?? this.options.currency;
            this.options.lengthUnit = data.market_odometer.odometer_unit ?? this.options.lengthUnit;

            // Draw the Vincario charts with the fetched data and provided options
            this.draw(data);
        } catch (error) {
            // Log the error if an exception occurs during initialization
            console.error("An error occurred while initializing Vincario:", error);
        }
    }

    /**
     * Draws the specified graphs or all available graphs if none are specified.
     * @param {IVindecoderApiResponse} data - The data to be used for drawing the charts.
     */
    private draw(data: IVindecoderApiResponse): void {

        const {graphs, containerElementId} = this.options;

        // Check if containerElementId exists
        const containerElement = document.getElementById(containerElementId);
        if (!containerElement) {
            console.error("Container element not found.");
            return;
        }

        // Create an object to map graph types to their respective classes
        const graphTypeMap: GraphTypeMap = {
            PriceHistogramChart,
            PriceOdoChart,
        };

        // If no specific graphs are provided, draw all available graphs
        const graphTypes = graphs ?? Object.keys(graphTypeMap);

        // Iterate through the available graph types
        for (const graphType of graphTypes) {
            const GraphClass = graphTypeMap[graphType];
            const graphInstance = new GraphClass(data, this.options);
            graphInstance.draw(containerElementId);
        }

    }

}
