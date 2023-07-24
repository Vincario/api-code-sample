import VincarioLib from "./ts/VincarioLib";

window.onload = async () => {
    console.log("Vincario-charts-plugin initialized... ");
    const chartContainers = document.getElementsByClassName('vincario-vehicle-market-value-charts');

    for(let i = 0; i < chartContainers.length; i++) {
        const container = chartContainers[i];
        const children = container.childNodes;
        let dataRecords;

        // Try to parse data records and handle errors
        try {
            const data = container.getAttribute('data-records');
            // Check if data is not empty or not undefined
            if (!data) {
                console.error("Missing data-records attribute or it is empty.");
                continue; // Skip to the next iteration
            }

            dataRecords = JSON.parse(data);
        } catch (error) {
            console.error("Error parsing data-records:", error);
            continue; // Skip to the next iteration
        }

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