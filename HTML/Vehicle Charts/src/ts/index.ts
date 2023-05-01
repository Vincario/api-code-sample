import VincarioCharts from "./components/VincarioCharts";

window.onload = () => {
    const vincode = "WF0AXXGCDA2000000";
    const charts = new VincarioCharts(vincode, {
        containerElementId: "vincario-charts",
    });
};
