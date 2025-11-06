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
        image.href = 'https://vincario.com/';

        const logo = document.createElement('img');

        const svgString = `<svg height="396" viewBox="0 0 383 396" width="383" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><linearGradient id="a" x1="50%" x2="50%" y1="-14.583939%" y2="24.327613%"><stop offset="0" stop-color="#008684" stop-opacity="0"/><stop offset="1" stop-color="#008684"/></linearGradient><g fill="none" fill-rule="evenodd"><g transform="translate(41)"><path d="m0 104.017895 26.3157895 13.09421v90.434737l122.8757895 61.141053 122.876316-61.141053v-90.434737l26.315789-13.09421v119.71421l-149.191579 74.235263s-99.4615787-49.49-149.192105-74.235263z" fill="url(#a)"/><path d="m149.192105 149.192105-149.192105-74.5963155v-74.5957895l149.192105 74.5957895 149.191579-74.5957895v74.5957895z" fill="#00c474"/></g><g fill="#008684" transform="translate(-1 337)"><path d="m31.5877895 57.1184842h-2.7109895l-27.82964211-55.72193683h13.30635791c5.2928842 10.56151583 10.586021 21.12328423 15.8789053 31.68480003l15.8789052-31.68480003h13.3280842z"/><path d="m63.6328421 57.9562105h11.9009684v-56.55966313h-11.9009684z"/><path d="m96.1932632 57.8791579h-11.9014737v-55.04412632l2.5288421-1.12623158 33.1048424 29.8085053v-30.19781056h11.979789v55.12117896c-.843789.3759158-1.687579.7515789-2.528842 1.1274947l-33.1831578-29.814821z"/><path d="m168.473684 1.39705263c7.318737.06366316 14.465684 3.08336842 19.664842 8.18905263l1.093895 1.20126314-8.367158 8.4578527c-5.153684-5.1334737-12.962526-7.5049264-19.65221-4.269979-7.664842 3.7066105-11.754948 13.7974737-7.520842 22.0400842 4.256842 8.2878316 16.395789 12.3837474 25.015578 5.2140632.351158-.2930527.692211-.5997474 1.023158-.9160421l1.144421-1.106779 8.33179 8.3108211-.949895 1.1305263c-11.115789 11.0571789-31.674947 11.4722526-42.641684-3.0538105-7.533474-9.9797053-7.381895-25.1184 1.053474-35.0928 5.262315-6.22231583 13.184842-10.03048425 21.440842-10.10425267.121263-.00025263.242526-.00025263.363789 0z"/><path d="m220.140632 58.1219368h-2.71099l-27.829642-55.7219368h13.306358c5.292884 10.5615158 10.586021 21.1232842 15.878905 31.6848l15.878905-31.6848h13.328085z" transform="matrix(-1 0 0 -1 437.592252 60.521936)"/><path d="m262.096421 57.9562105h-11.901474v-56.55966313c9.468632 0 18.934737-.024 28.403369.00025263 7.801263.06593684 15.344842 5.2224 18.078316 12.6990316 3.150315 8.6220631-.760421 19.389221-9.266527 23.8221473 0 0 11.552842 20.0382316 11.552842 20.0382316h-13.801263l-10.335158-17.8170947h-12.730105zm0-44.5813894v14.7155368c5.492211.0234947 10.984421.1025684 16.474105.0699789 4.693895-.0803368 8.574316-5.4666947 6.785685-10.0595368-1.061053-2.7271579-3.784422-4.6741895-6.785685-4.7254737-5.489684-.0305684-10.981894-.0005052-16.474105-.0005052z"/><path d="m306.567158 57.9562105h11.900968v-56.55966313h-11.900968z"/><path d="m355.686316 1.39705263c16.138105.13288421 30.841263 15.55578947 27.746526 33.42770527-2.526316 14.5877053-17.868631 25.6145684-33.559579 22.6128-18.386526-3.5178947-31.831579-28.6489263-15.337263-46.6853053 5.206737-5.69178944 12.530526-9.19856839 20.422737-9.35115786.242526-.00353685.485052-.0048.727579-.00404211zm-.288 11.97802107c-10.01179.0808421-19.374316 10.6115368-15.226105 22.0115368 2.963368 8.1362527 13.202526 13.1075369 21.918315 9.261979 9.999158-4.4112 14.101895-20.4803369 2.463158-28.5309474-2.657684-1.8381474-5.893895-2.7521684-9.155368-2.7425684z"/></g></g></svg>`
        const blob = new Blob([svgString], {type: "image/svg+xml"});

        logo.src = URL.createObjectURL(blob);
        logo.style.position = 'absolute';
        logo.style.right = '40px';
        logo.style.opacity = '0.7';
        logo.style.maxWidth = '100%';
        logo.style.top = '130px';
        logo.style.width = '7%';
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

    protected wrapAndAddOverlay(chartContainer: HTMLDivElement, chartCanvas: HTMLCanvasElement, containerElement: Element | null): void {
        chartContainer.style.position = 'relative';


        this.addImageOverlay(chartContainer);

        // Append chart canvas to container
        chartContainer.appendChild(chartCanvas);

        // Append chart container to provided container element or body
        if (containerElement) {
            containerElement.appendChild(chartContainer);
        } else {
            document.body.appendChild(chartContainer);
        }
    }
}
