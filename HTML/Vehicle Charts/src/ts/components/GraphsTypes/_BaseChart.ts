import IVindecoderApiResponse from "../../interfaces/IVindecoderApiResponse";
import {IChartConfig} from "../../interfaces/IChartConfig";
import IVincarioLibConfig from "../../interfaces/IVincarioLibConfig";
import i18next from "i18next";

/**
 * _BaseChart is an abstract class that serves as a foundation for other chart classes.
 * It provides a basic structure and enforces the implementation of the 'draw' method
 * in any derived class.
 */
export default abstract class _BaseChart<TData> {

    protected _canvas: HTMLCanvasElement;

    /**
     * Creates a new instance of BaseChart.
     * @param _data
     * @param _options
     * @returns A new instance of PriceOdoChart.
     */
    constructor(protected readonly _data: IVindecoderApiResponse, protected readonly _options: IVincarioLibConfig) {
        this._canvas = _BaseChart.createCanvas();
    }

    /**
     * The 'draw' method is responsible for rendering a chart based on provided data
     * and placing it in a specified container element. This method must be implemented
     * in any class derived from _BaseChart.
     * @param {string} containerElementId - ID of the container element to render the chart in.
     *                                      If not provided, the chart will be rendered in the
     *                                      document's body.
     * @param data
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
    abstract prepareConfig(data: TData): IChartConfig;

    abstract createCartHeader(chartContainer: HTMLElement): void;

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
    protected addImageOverlay(container: HTMLElement) {
        const image = document.createElement('a');
        image.href = 'https://vindecoder.eu/';

        const logo = document.createElement('img');
        logo.src = 'src/assets/logo.png';
        logo.style.position = 'absolute';
        logo.style.top = '100px';
        logo.style.right = '30px';
        logo.style.opacity = '0.7';
        logo.style.maxWidth = '100%';
        logo.style.width = '10%';
        logo.style.height = 'auto';
        logo.style.maxHeight = '70px';
        logo.style.zIndex = '99';

        image.appendChild(logo);

        if (container) {
            container.appendChild(image);
        } else {
            console.warn('Container element not found.');
            document.body.appendChild(image);
        }
    }

    protected createTextElement(text: string) {
        const element = document.createElement('p');
        element.textContent = text;
        return element;
    };

    protected createExplanatoryBox(text: string, className: string) {
        const container = document.createElement('div');
        container.classList.add('chart-explanatory-box-container');

        const box = document.createElement('div');
        box.classList.add('chart-explanatory-box');
        box.classList.add(className);

        const textElement = this.createTextElement(text);

        container.appendChild(box);
        container.appendChild(textElement);

        return container;
    }

    protected createTrendlineSign() {
        const container = document.createElement('div');
        container.classList.add('trend-line-sign-container');

        const sign = document.createElement('div');
        sign.classList.add('trend-line-sign');

        const text = this.createTextElement(i18next.t('TRENDLINE'));

        container.appendChild(sign);
        container.appendChild(text);

        return container;
    };

    protected wrapAndAddOverlay(chartContainer: HTMLDivElement, chartCanvas: HTMLCanvasElement, containerElementId: string | null): void {
        chartContainer.style.position = 'relative';


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
