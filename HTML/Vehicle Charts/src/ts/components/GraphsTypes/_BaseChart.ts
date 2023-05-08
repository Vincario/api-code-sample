import IVindecoderApiResponse from "../../interfaces/IVindecoderApiResponse";

/**
 * _BaseChart is an abstract class that serves as a foundation for other chart classes.
 * It provides a basic structure and enforces the implementation of the 'draw' method
 * in any derived class.
 */
export default abstract class _BaseChart<TData, TConfig> {

    protected _canvas: HTMLCanvasElement;

    /**
     * Creates a new instance of BaseChart.
     * @param _data
     * @returns A new instance of PriceOdoChart.
     */
    constructor(protected readonly _data: IVindecoderApiResponse) {
        this._canvas = _BaseChart.createCanvas();
    }

    /**
     * The 'draw' method is responsible for rendering a chart based on provided data
     * and placing it in a specified container element. This method must be implemented
     * in any class derived from _BaseChart.
     * @param {string} containerElementId - ID of the container element to render the chart in.
     *                                      If not provided, the chart will be rendered in the
     *                                      document's body.
     */
    abstract draw(containerElementId: string = null): void;

    /**
     * Processes the raw data received from the IVindecoderApiResponse and
     * returns the processed data to be used for rendering the chart.
     * This method must be implemented in any class derived from _BaseChart.
     * @returns {TData} The processed chart data.
     */
    abstract prepareChartData(): TData;

    /**
     * Prepares the configuration object for the chart based on the processed data.
     * This method must be implemented in any class derived from _BaseChart.
     * @param {TData} data - The processed chart data.
     * @returns {TConfig} The configuration object for the chart.
     */
    abstract prepareConfig(data: TData): TConfig;

    /**
     * Creates a new canvas element.
     * @returns {HTMLCanvasElement} The newly created canvas element.
     */
    private static createCanvas(): HTMLCanvasElement {
        return document.createElement('canvas');
    }

    /**
     Adds an image overlay to the specified container element or to the document body if no container is specified.
     @param container - The container element to which the image overlay will be added.
     @returns void
     */
    protected addImageOverlay(container : HTMLElement) {
        const image = document.createElement('img');
        image.src = 'src/res/logo.png';
        image.style.position = 'absolute';
        image.style.top = '15px';
        image.style.right = '30px';
        image.style.opacity = '0.4';
        image.style.maxWidth = '100%';
        image.style.width = '10%';
        image.style.height = 'auto';
        image.style.maxHeight = '70px';
        image.style.zIndex = '10';
        image.style.pointerEvents = 'none';

        if (container) {
            container.appendChild(image);
        } else {
            console.warn('container element not found.');
            document.body.appendChild(image);
        }
    }


    protected wrapAndAddOverlay(chartContainer: HTMLDivElement, chartCanvas: HTMLCanvasElement, containerElementId: string | null): void {
        chartContainer.style.position = 'relative';

        // Add image overlay to chart container
        this.addImageOverlay(chartContainer);

        // Append chart canvas to container
        chartContainer.appendChild(chartCanvas);

        // Append chart container to provided container element or body
        const container = document.getElementById(containerElementId);
        if (container) {
            container.appendChild(chartContainer);
        } else {
            document.body.appendChild(chartContainer);
        }
    }
}
