import {GraphTypeMap} from "../types/ChartType";

export default interface IVincarioLibConfig {
    containerElementId: string;
    currency?: string,
    lengthUnit?: string,
    language?: string,
    graphs?: (keyof GraphTypeMap)[];
    apiKey?: string,
    apiSecret?: string,
}
