function GetChartOptions(data) {

    //var chartOptions = {
    return {
        animationEnabled: true,
        title: {
            text: "REPORTS"
        },
        axisX: {
            title: "Times",
            valueFormatString: "HH:mm:ss"
        },
        axisY: {
            title: "Coin Value in USD",
            valueFormatString: "$#,##0.#",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        data: data
    };
} // GetChartOptions

function toggleDataSeries(e) {
    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    } else {
        e.dataSeries.visible = true;
    }
    e.chart.render();
}