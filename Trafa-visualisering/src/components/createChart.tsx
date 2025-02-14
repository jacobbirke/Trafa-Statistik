import Highcharts from "highcharts";

export function createChart(element: HTMLDivElement) {
  return Highcharts.chart(element, {
    chart: { type: "column" },
    title: { text: "", align: "left" },
    xAxis: {
      type: "category",
      crosshair: true,
    },
    yAxis: [
      {
        title: { text: "", style: { color: "DodgerBlue" } },
        opposite: false,
      },
      {
        title: { text: "", style: { color: "purple" } },
        opposite: true,
      },
    ],
    tooltip: { shared: true },
    plotOptions: {
      column: {
        grouping: true,
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [],
  });
  
}
