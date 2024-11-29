import React, { useEffect } from "react";
import Highcharts from "highcharts";
import * as XLSX from "xlsx";

export const ImportPunktlighetPerAr: React.FC = () => {
  useEffect(() => {
    const chart = Highcharts.chart(
      "container",
      {
        chart: {
          zooming: {
            type: "xy",
          },
        },
        title: {
          text: "", // Titel
          align: "left",
        },
        credits: {
          text: 'Source: <a href="https://www.trafa.se/bantrafik/punktlighet-pa-jarnvag/" target="_blank">Trafikanalys</a>',
        },
        xAxis: [
          {
            categories: [],
            crosshair: true,
          },
        ],
        yAxis: [
          {
            // Primär y-axel (Punktlighet)
            title: {
              text: "",
              style: {
                color: Highcharts.getOptions().colors?.[1] as string || "black",
              },
            },
            labels: {
              format: "{value} ",
              style: {
                color: Highcharts.getOptions().colors?.[1] as string || "black",
              },
            },
          },
          {
            // Sekundär y-axel (Antal tåg)
            title: {
              text: "",
              style: {
                color: Highcharts.getOptions().colors?.[0] as string || "black",
              },
            },
            labels: {
              format: "{value} ",
              style: {
                color: Highcharts.getOptions().colors?.[0] as string || "black",
              },
            },
            opposite: true,
          },
        ],
        tooltip: {
          shared: true,
        },
        legend: {
          align: "left",
          verticalAlign: "top",
          backgroundColor:
            Highcharts.defaultOptions.legend?.backgroundColor ||
            "rgba(255,255,255,0.25)",
        },
        series: [
          {
            name: "", // Header 1
            type: "column",
            yAxis: 1,
            data: [],
            tooltip: {
              valueSuffix: "",
            },
          },
          {
            name: "", // Header 2
            type: "spline",
            data: [],
            tooltip: {
              valueSuffix: "", // unit
            },
          },
        ],
      },
      () => {}
    );

    const handleFileUpload = (e: Event) => {
      const inputElement = e.target as HTMLInputElement;
      const file = inputElement.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        });

        const title = jsonData[0]?.[1] || "";
        const headers = jsonData[1];
        const units = jsonData[2];

        const years: string[] = [];
        const trainCounts: number[] = [];
        const punctualities: number[] = [];

        jsonData.forEach((row, index) => {
          if (index <= 2) return; // Skippa titel, header och unit från CVS

          years.push(row[0]); // Första kolumn år
          trainCounts.push(row[1]); // Andra kolumn tåg

          let punctuality = row[2];
          if (punctuality !== undefined && punctuality !== null) {
            punctuality = parseFloat(punctuality).toFixed(2); // Avrunda till 2 decimaler
            punctuality = parseFloat(punctuality);
          }
          punctualities.push(punctuality); // Tredje kolumn punktlighet
        });

        chart.xAxis[0].update({
          categories: years, // År för x-axel
        });

        // Tåg
        chart.series[0].update({
          name: headers[1],
          data: trainCounts,
          tooltip: {
            valueSuffix: " " + units[1], // Detalj vy
          },
          type: "column",
        });

        // Punktlighet
        chart.series[1].update({
          name: headers[2],
          data: punctualities,
          tooltip: {
            valueSuffix: " " + units[2], // Detalj vy
          },
          type: "spline",
        });

        function getColor(colorIndex: number): string {
          const color = Highcharts.getOptions().colors?.[colorIndex];
          return typeof color === "string" ? color : "black";
        }

        // Punktlighet Y-axel
        chart.yAxis[0].update({
          title: {
            text: headers[2],
            style: {
              color: getColor(1),
            },
          },
          labels: {
            format: "{value} " + units[2],
            style: {
              color: getColor(1), // Ensure color is a string
            },
          },
          min: 0, // Procent min - max
          max: 100,
        });

        // Tåg Y-axel
        chart.yAxis[1].update({
          title: {
            text: headers[1],
            style: {
              color: getColor(0), // Ensure color is a string
            },
          },
          labels: {
            format: "{value:,.0f} " + units[1], // :,.0f separerar tusen
            style: {
              color: getColor(0), // Ensure color is a string
            },
          },
        });

        // Titel hämtad från fil
        chart.setTitle({
          text: title,
        });
      };

      reader.readAsBinaryString(file);
    };

    const inputElement = document.getElementById("upload") as HTMLInputElement;
    inputElement.addEventListener("change", handleFileUpload);

    return () => {
      inputElement.removeEventListener("change", handleFileUpload);
    };
  }, []);

  return (
    <>
      <input type="file" id="upload" accept=".csv" />
      <div id="container" className="w-full h-96"></div>
    </>
  );
};

export default ImportPunktlighetPerAr;
