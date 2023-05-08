import {GraphTypeMap} from "../types/ChartType";

export default interface IVincarioLibConfig {
    containerElementId: string;
    graphs?: (keyof GraphTypeMap)[];
}
