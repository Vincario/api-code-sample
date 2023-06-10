import {GraphTypeMap} from "../types/ChartType";

export default interface IVincarioLibConfig {
    containerElement: Element;
    currency?: string,
    lengthUnit?: string,
    language?: string,
    graphs?: (keyof GraphTypeMap)[];
    apiKey?: string,
    apiSecret?: string,
}
