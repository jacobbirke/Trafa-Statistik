import Highcharts from "highcharts";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import OfflineExporting from "highcharts/modules/offline-exporting";
import Accessibility from "highcharts/modules/accessibility";

Exporting(Highcharts);
ExportData(Highcharts);
OfflineExporting(Highcharts);
Accessibility(Highcharts);

export function createChart(element: HTMLDivElement) {
  return Highcharts.chart(element, {
    chart: {
      type: "column",
      options3d: {
        enabled: false,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
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
