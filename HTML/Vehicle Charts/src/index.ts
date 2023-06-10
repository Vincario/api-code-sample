import VincarioLib from "./ts/VincarioLib";

window.onload = async () => {

    const chartContainers = document.getElementsByClassName('vincario-vehicle-market-value-charts');

    for(let i = 0; i < chartContainers.length; i++) {
        const container = chartContainers[i];
        const children = container.childNodes;
        const dataRecords = JSON.parse(container.getAttribute('data-records'));

        let hasPriceDistribution = false;
        let hasPriceMap = false;

        for (let j = 0; j < children.length; j++) {
            const child = children[j];

            if (child.classList) {
                if (child.classList.contains('vehicle-price-distribution')) {
                    hasPriceDistribution = true;
                }
                if (child.classList.contains('vehicle-price-map')) {
                    hasPriceMap = true;
                }
            }
        }

        const graphsToShow = [];

        if (hasPriceDistribution) {
            graphsToShow.push('PriceHistogramChart');
        }

        if (hasPriceMap) {
            graphsToShow.push('PriceOdoChart');
        }

        if(graphsToShow.length > 0){
            new VincarioLib.createWithData(dataRecords, {
                containerElement: container,
                language:'en',
                graphs: graphsToShow,
            });
        }
    }
}