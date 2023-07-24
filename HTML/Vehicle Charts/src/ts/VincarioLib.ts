// Vincario.ts

import {GraphTypeMap} from "./types/ChartType";
import IVindecoderApiResponse from "./interfaces/IVindecoderApiResponse";
import PriceOdoChart from "./components/GraphsTypes/PriceOdoChart";
import PriceHistogramChart from "./components/GraphsTypes/PriceHistogramChart";
import IVincarioLibConfig from "./interfaces/IVincarioLibConfig";
import {initI18n} from "../i18n/i18n";

/**
 * Vincario class, which is responsible for initializing and managing the Vincario charts
 */
export default class VincarioLib {

    /**
     * Constructor takes a VIN code (Vehicle Identification Number) and options for Vincario charts
     * @param vincode: string - The VIN code of the vehicle
     * @param options: IVincarioLibConfig - The options for configuring the Vincario charts
     */
    constructor(private vincode: string, private readonly options: IVincarioLibConfig) {

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
     * Alternative constructor that directly takes IVindecoderApiResponse data
     * @param data: IVindecoderApiResponse - The data of the vehicle
     * @param options: IVincarioLibConfig - The options for configuring the Vincario charts
     */
    public static createWithData(
        data: IVindecoderApiResponse,
        options: IVincarioLibConfig
    ): VincarioLib {

        const instance = new VincarioLib("", options);
        instance.initWithData(data);
        return instance;
    }

    /**
     * Initializes the Vincario charts with the provided data
     * @param data: IVindecoderApiResponse - The data of the vehicle
     */
    private initWithData(data: IVindecoderApiResponse): void {
        this.options.currency = data.records[0].price_currency ?? this.options.currency;
        this.options.lengthUnit = data.market_odometer.odometer_unit ?? this.options.lengthUnit;

        // Draw the Vincario charts with the fetched data and provided options
        this.draw(data);
    }

    /**
     * Draws the specified graphs or all available graphs if none are specified.
     * @param {IVindecoderApiResponse} data - The data to be used for drawing the charts.
     */
    private draw(data: IVindecoderApiResponse): void {

        const {graphs, containerElement} = this.options;

        // Check if containerElementId exists
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
            graphInstance.draw(containerElement);
        }

    }

}
