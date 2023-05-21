// Vincario.ts

import VindecoderApi from "./VindecoderApi";
import {GraphTypeMap} from "./types/ChartType";
import IVindecoderApiResponse from "./interfaces/IVindecoderApiResponse";
import PriceOdoChart from "./components/GraphsTypes/PriceOdoChart";
import PriceHistogramChart from "./components/GraphsTypes/PriceHistogramChart";
import IVincarioLibConfig from "./interfaces/IVincarioLibConfig";

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
            const graphInstance = new GraphClass(data);
            graphInstance.draw(containerElementId, graphTypes.length);
        }

        window.addEventListener('resize', this.setChartContainerHeight);
    }

    /**
     * This method adjusts the height of all child elements inside the chart container
     * based on the width of the container. The height is set to be half the width of the container.
     * It's designed to be used as an event listener for the window resize event.
     *
     * @private
     * @return {void}
     */
    private setChartContainerHeight = () => {
        const chartContainer : HTMLElement | null = document.getElementById(this.options.containerElementId);

        if (chartContainer) {
            const children = Array.from(chartContainer.children);

            children.forEach((child) => {
                // Ensure the child is an instance of HTMLElement
                if (child instanceof HTMLElement) {
                    // Set the height of the child to be half the width of the chartContainer
                    child.style.height = `${chartContainer.offsetWidth / 2}px`;
                }
            });
        } else {
            console.error(`Cannot find container with id ${this.options.containerElementId}`);
        }
    }
}
