// _BaseChart.ts

import iVindecoderResponse from "../../interfaces/iVindecoderResponse";

/**
 * _BaseChart is an abstract class that serves as a foundation for other chart classes.
 * It provides a basic structure and enforces the implementation of the 'draw' method
 * in any derived class.
 */
export default abstract class _BaseChart {

    protected readonly _data: iVindecoderResponse;
    protected _canvas: HTMLCanvasElement;

    /**
     * Creates a new instance of BaseChart.
     * @param data - An object containing VIN decoding information for the vehicle.
     * @param width - The width of the chart canvas.
     * @param height - The height of the chart canvas.
     * @returns A new instance of PriceOdoChart.
     */
    constructor(data: iVindecoderResponse, width: number, height: number) {
        this._canvas = _BaseChart.createCanvas(width, height);
        this._data = data;
    }

    /**
     * The 'draw' method is responsible for rendering a chart based on provided data
     * and placing it in a specified container element. This method must be implemented
     * in any class derived from _BaseChart.
     *
     * @param {iVindecoderResponse} data - Data to be used for rendering the chart
     * @param {string} containerElementId - ID of the container element to render the chart in
     */
    abstract draw(containerElementId: string = null): void;

    /**
     * Creates a new canvas element with the specified width and height.
     * @param {number} width - The width of the canvas element.
     * @param {number} height - The height of the canvas element.
     * @returns {HTMLCanvasElement} The newly created canvas element.
     */
    public static createCanvas(width: number, height: number): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
}
