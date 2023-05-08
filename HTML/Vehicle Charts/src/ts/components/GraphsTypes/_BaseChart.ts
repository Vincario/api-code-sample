import iVindecoderResponse from "../../interfaces/iVindecoderResponse";
import {ChartOptions} from "chart.js";

/**
 * _BaseChart is an abstract class that serves as a foundation for other chart classes.
 * It provides a basic structure and enforces the implementation of the 'draw' method
 * in any derived class.
 */
export default abstract class _BaseChart {

    protected _canvas: HTMLCanvasElement;

    /**
     * Creates a new instance of BaseChart.
     * @param _data
     * @param width - The width of the chart canvas.
     * @param height - The height of the chart canvas.
     * @returns A new instance of PriceOdoChart.
     */
    constructor(protected readonly _data: iVindecoderResponse, width: number, height: number) {
        this._canvas = _BaseChart.createCanvas(width, height);
    }

    /**
     * The 'draw' method is responsible for rendering a chart based on provided data
     * and placing it in a specified container element. This method must be implemented
     * in any class derived from _BaseChart.
     * @param {string} containerElementId - ID of the container element to render the chart in
     */
    abstract draw(containerElementId: string = null): void;

    /**
     * Processes the graph data and returns processed data for the chart.
     * This method must be implemented in any class derived from _BaseChart.
     */
    abstract prepareChartData(): any;

    abstract prepareConfig(data:any): any;

    /**
     * Creates a new canvas element with the specified width and height.
     * @param {number} width - The width of the canvas element.
     * @param {number} height - The height of the canvas element.
     * @returns {HTMLCanvasElement} The newly created canvas element.
     */
    private static createCanvas(width: number, height: number): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    addImageOverlay(container : HTMLElement) {
        const image = document.createElement('img');
        image.src = 'src/res/logo.png';
        image.style.position = 'absolute';
        image.style.top = '15px';
        image.style.right = '30px';
        image.style.opacity = '0.4';
        image.style.maxWidth = '70px';
        image.style.maxHeight = '70px';
        image.style.zIndex = '10';
        image.style.pointerEvents = 'none';

        if (container) {
            container.appendChild(image);
        } else {
            document.body.appendChild(image);
        }
    }

}
