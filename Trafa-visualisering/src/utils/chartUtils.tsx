import Highcharts from "highcharts";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import OfflineExporting from "highcharts/modules/offline-exporting";
import Accessibility from "highcharts/modules/accessibility";
import HighchartsMore from "highcharts/highcharts-more";

HighchartsMore(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);
OfflineExporting(Highcharts);
Accessibility(Highcharts);

export function createChart(element: HTMLDivElement) {
  return Highcharts.chart(element, {
    chart: {
      type: "column",
      zooming: {
        type: "xy",
      },
      animation: {
        duration: 1000,
        easing: "easeInOutBounce",
      },
    },
    title: { text: "", align: "left" },
    xAxis: {
      type: "category",
      crosshair: true,
    },
    yAxis: [
      {
        title: { text: "", style: { color: "" } },
        opposite: false,
      },
      {
        title: { text: "", style: { color: "" } },
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
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        depth: 35,
        dataLabels: {
          enabled: true,
          format: "{point.name}",
        },
      },
    },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: [
            "printChart",
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF",
            "downloadSVG",
            "separator",
            "viewData",
          ],
        },
      },
    },
    credits: { enabled: false },
    series: [],
    accessibility: {
      enabled: true,
    },
  });
}
