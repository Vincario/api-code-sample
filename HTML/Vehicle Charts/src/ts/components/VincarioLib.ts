// Vincario.ts

import iVincarioChartsOptions from "../interfaces/iVincarioChartsOptions";
import VindecoderApi from "./VindecoderApi";
import {GraphTypeMap} from "../types/GraphType";
import iVindecoderResponse from "../interfaces/iVindecoderResponse";
import PriceOdoChart from "./GraphsTypes/PriceOdoChart";
import PriceHistogramChart from "./GraphsTypes/PriceHistogramChart";

/**
 * Vincario class, which is responsible for initializing and managing the Vincario charts
 */
export default class VincarioLib {
    /**
     * Constructor takes a VIN code (Vehicle Identification Number) and options for Vincario charts
     * @param vincode: string - The VIN code of the vehicle
     * @param options: iVincarioChartsOptions - The options for configuring the Vincario charts
     */
    constructor(private vincode: string, private options: iVincarioChartsOptions) {
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
            const data : iVindecoderResponse = await api.fetchData();

            // Draw the Vincario charts with the fetched data and provided options
            this.draw(data);
        } catch (error) {
            // Log the error if an exception occurs during initialization
            console.error("An error occurred while initializing Vincario:", error);
        }
    }

    /**
     * Draws the specified graphs or all available graphs if none are specified.
     * @param {iVindecoderResponse} data - The data to be used for drawing the charts.
     */
    public draw(data: iVindecoderResponse): void {


        const { graphs, containerElementId } = this.options;

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
            const graphInstance = new GraphClass(data, this.options.graphBaseWidth, this.options.graphBaseHeight);
            graphInstance.draw(containerElementId);
        }
    }
}
