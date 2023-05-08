import {GraphTypeMap} from "../types/GraphType";

export default interface iVincarioChartsoptions {
    containerElementId: string;
    graphs?: (keyof GraphTypeMap)[];
    graphBaseWidth?: number;
    graphBaseHeight?: number;
}
