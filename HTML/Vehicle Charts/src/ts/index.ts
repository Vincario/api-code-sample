import VincarioCharts from "./components/VincarioCharts";

window.onload = () => {

    const vincode = "WF0AXXGCDA2000000";
    new VincarioCharts(vincode, {
        containerElementId: "vincario-charts",
        graphs: [/*'PriceHistogramChart',*/ 'PriceOdoChart'],
        graphBaseWidth:200,
        graphBaseHeight:200
    }).init();

};
