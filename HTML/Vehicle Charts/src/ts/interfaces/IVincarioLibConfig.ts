import {GraphTypeMap} from "../types/ChartType";

export default interface IVincarioLibConfig {
    containerElement: Element;
    currency?: string,
    lengthUnit?: string,
    graphs?: (keyof GraphTypeMap)[];
}
